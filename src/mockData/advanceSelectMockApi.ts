
import { Option } from "../components/controls/type/types";

let STORE: Option[] = [
  { id: "c1", name: "Client" },
  { id: "v1", name: "Vendor" },
  { id: "p1", name: "Partner" },
];
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
export async function loadAll() { await sleep(400); return [...STORE]; }
export async function createOne(draft: { name: string }) {
  await sleep(400);
  const item = { id: Math.random().toString(36).slice(2), name: draft.name };
  STORE.push(item);
  return item;
}
export async function updateOne(id: string, draft: { name: string }) {
  await sleep(400);
  STORE = STORE.map(x => x.id === id ? { ...x, name: draft.name } : x);
  const found = STORE.find(x => x.id === id)!;
  return found;
}