export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Params = Record<string, any>;
export type HeadersInitish = HeadersInit | Record<string, string>;

export type CacheOptions = {
  ttlMs?: number;
  maxEntries?: number;
  staleWhileRevalidate?: boolean;
};

export type RequestOptions = {
  params?: Params;
  headers?: HeadersInitish;
  cache?: {
    bypass?: boolean;
    revalidate?: boolean;
    ttlMs?: number;
    noStore?: boolean;
    noSWR?: boolean;
    key?: string;
  };
  body?: any;
  keyScope?: string;
};

type CacheEntry<T = any> = { value: T; expiresAt: number };

function stableStringify(obj: any): string {
  if (obj == null) return '';
  if (typeof obj !== 'object') return String(obj);
  const allKeys: string[] = [];
  JSON.stringify(obj, (k, v) => (allKeys.push(k), v));
  allKeys.sort();
  return JSON.stringify(obj, allKeys);
}

function buildUrl(baseUrl: string, params?: Params) {
  if (!params || Object.keys(params).length === 0) return baseUrl;
  const u = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    u.searchParams.set(k, String(v));
  });
  return u.pathname + u.search;
}

function buildKey(method: HttpMethod, url: string, params?: Params, body?: any, scope?: string) {
  const sig = [
    method.toUpperCase(),
    url,
    stableStringify(params ?? {}),
    method.toUpperCase() === 'GET' ? '' : stableStringify(body ?? {})
  ].join('::');
  return scope ? `${scope}::${sig}` : sig;
}

class LruCache {
  private store = new Map<string, CacheEntry>();
  constructor(private maxEntries: number, private defaultTtl: number) {}
  get<T>(key: string): CacheEntry<T> | undefined {
    const e = this.store.get(key);
    if (!e) return;
    if (e.expiresAt < Date.now()) { this.store.delete(key); return; }
    this.store.delete(key); this.store.set(key, e);
    return e as CacheEntry<T>;
  }
  set<T>(key: string, value: T, ttlMs?: number) {
    if (this.store.size >= this.maxEntries) {
      const first = this.store.keys().next().value;
      if (first) this.store.delete(first);
    }
    this.store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? this.defaultTtl) });
  }
  delete(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
  deleteByPrefix(prefix: string) {
    for (const k of Array.from(this.store.keys())) if (k.startsWith(prefix)) this.store.delete(k);
  }
}

const inflight = new Map<string, Promise<any>>();

export class ApiClient {
  private base: string;
  private cache: LruCache;
  private defaults: Required<CacheOptions>;
  constructor(baseUrl: string, opts?: CacheOptions, private mockRouter?: (m:HttpMethod, url:string, body?:any)=>Promise<Response|undefined>) {
    this.base = baseUrl.replace(/\/+$/,'');
    this.defaults = {
      ttlMs: opts?.ttlMs ?? 5 * 60 * 1000,
      maxEntries: opts?.maxEntries ?? 800,
      staleWhileRevalidate: !!opts?.staleWhileRevalidate
    };
    this.cache = new LruCache(this.defaults.maxEntries, this.defaults.ttlMs);
  }

  invalidate(keyOrPrefix: string, isPrefix=false) {
    if (isPrefix) this.cache.deleteByPrefix(keyOrPrefix); else this.cache.delete(keyOrPrefix);
  }

  async request<T = any>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, body, cache, keyScope } = options;
    const urlPath = buildUrl(`${this.base}${path.startsWith('/')? '' : '/'}${path}`, params);
    const key = cache?.key ?? buildKey(method, urlPath, params, body, keyScope);

    if (cache?.bypass) {
      const res = await this.fetchJson<T>(method, urlPath, headers, body);
      return res;
    }

    if (this.defaults.staleWhileRevalidate && !cache?.noSWR && !cache?.revalidate) {
      const hit = this.cache.get<T>(key);
      if (hit) {
        if (!inflight.has(key)) {
          inflight.set(key, this.fetchJson<T>(method, urlPath, headers, body)
            .then(fresh => { if (!cache?.noStore) this.cache.set(key, fresh, cache?.ttlMs); })
            .finally(()=> inflight.delete(key)));
        }
        return hit.value;
      }
    } else {
      if (!cache?.revalidate) {
        const hit = this.cache.get<T>(key);
        if (hit) return hit.value;
      }
    }

    if (inflight.has(key)) return inflight.get(key)!;

    const p = this.fetchJson<T>(method, urlPath, headers, body).then(json => {
      if (!cache?.noStore) this.cache.set(key, json, cache?.ttlMs);
      return json;
    }).finally(()=> inflight.delete(key));

    inflight.set(key, p);
    return p;
  }

  get<T = any>(path: string, options?: Omit<RequestOptions, 'body'>) { return this.request<T>('GET', path, options as any); }
  post<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'body'>) { return this.request<T>('POST', path, { ...options, body } as any); }
  put<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'body'>) { return this.request<T>('PUT', path, { ...options, body } as any); }
  patch<T = any>(path: string, body?: any, options?: Omit<RequestOptions, 'body'>) { return this.request<T>('PATCH', path, { ...options, body } as any); }
  delete<T = any>(path: string, options?: RequestOptions) { return this.request<T>('DELETE', path, options as any); }

  private async fetchJson<T>(method: HttpMethod, url: string, headers?: HeadersInit, body?: any): Promise<T> {
    if (this.mockRouter) {
      const mock = await this.mockRouter(method, url, body);
      if (mock) {
        const ct = mock.headers.get('content-type') || '';
        if (!mock.ok) throw new Error(`HTTP ${mock.status} ${mock.statusText}`);
        if (ct.includes('application/json')) return mock.json();
        return (await mock.text()) as unknown as T;
      }
    }
    const init: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) }
    };
    if (method !== 'GET' && body !== undefined) init.body = typeof body === 'string' ? body : JSON.stringify(body);
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text().catch(()=>'');
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text}`);
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return (await res.text()) as unknown as T;
  }
}
