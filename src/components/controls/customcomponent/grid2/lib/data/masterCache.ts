type Params = Record<string, any>;
type Listener = () => void;

function stableKey(obj: Params = {}) {
  const keys = Object.keys(obj).sort();
  return JSON.stringify(keys.reduce((acc, k) => (acc[k] = obj[k], acc), {} as Params));
}

export type DatasetOptions<T> = {
  id: string;
  loader: () => Promise<T[]>;
  ttlMs?: number;
};

export type Dataset<T> = {
  id: string;
  ensure: () => Promise<T[]>;
  refresh: () => Promise<T[]>;
  setData: (items: T[]) => void;
  getAll: () => T[];
  query: (params: Params, predicate: (item: T, params: Params) => boolean) => T[];
  subscribe: (l: Listener) => () => void;
  lastLoadedAt: number | null;
};

export function createDataset<T>(opts: DatasetOptions<T>): Dataset<T> {
  const { id, loader, ttlMs = 10 * 60_000 } = opts;
  let items: T[] | null = null;
  let version = 0;
  let lastLoadedAt: number | null = null;
  let inflight: Promise<T[]> | null = null;
  const queryCache = new Map<string, T[]>();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach(l=>l());
  const clearDerived = () => queryCache.clear();

  const setData = (next: T[]) => {
    items = next;
    version++;
    lastLoadedAt = Date.now();
    clearDerived();
    notify();
  };

  const load = async () => {
    const data = await loader();
    setData(data);
    return data;
  };

  const ensure = async () => {
    if (inflight) return inflight;
    const fresh = items && lastLoadedAt && (Date.now() - lastLoadedAt) < ttlMs;
    if (fresh && items) return items;
    inflight = load().finally(()=>{ inflight = null; });
    return inflight;
  };

  const refresh = async () => {
    inflight = load().finally(()=>{ inflight = null; });
    return inflight;
  };

  const getAll = () => {
    if (!items) throw new Error(`Dataset "${id}" not loaded. Call ensure() first.`);
    return items;
  };

  const query = (params: Params, predicate: (item: T, params: Params) => boolean) => {
    if (!items) throw new Error(`Dataset "${id}" not loaded. Call ensure() first.`);
    const k = `${stableKey(params)}::v${version}`;
    const hit = queryCache.get(k);
    if (hit) return hit;
    const out = items.filter(it => predicate(it, params));
    queryCache.set(k, out);
    return out;
  };

  const subscribe = (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };

  return { id, ensure, refresh, setData, getAll, query, subscribe, get lastLoadedAt(){ return lastLoadedAt; } };
}
