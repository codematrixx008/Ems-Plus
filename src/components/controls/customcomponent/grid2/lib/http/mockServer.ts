import { HttpMethod } from './cacheClient';

function jsonResponse(obj: any, status=200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type':'application/json' }});
}

function parseQuery(url: string) {
  const u = new URL(url, 'http://localhost');
  const q: Record<string, string> = {};
  u.searchParams.forEach((v,k)=>{ q[k]=v; });
  return { path: u.pathname, q };
}

const EMPLOYEES: { id:string; name:string; gender:'M'|'F'|'O'; manager:boolean; reportingEligible:boolean }[] =
  Array.from({length: 2000}).map((_,i)=>{
    const id = String(i+1);
    const gender = (i%3===0?'F':(i%3===1?'M':'O')) as 'F'|'M'|'O';
    return {
      id,
      name: `Employee ${id}`,
      gender,
      manager: i % 5 === 0,
      reportingEligible: i % 7 !== 0
    };
  });

const DEPARTMENTS = [
  { id:'10', name:'Engineering' },
  { id:'11', name:'Sales' },
  { id:'12', name:'HR' },
  { id:'13', name:'Finance' },
];

export async function mockRouter(method: HttpMethod, url: string, body?: any): Promise<Response|undefined> {
  if (!url.startsWith('/api')) return undefined;
  const { path, q } = parseQuery(url);

  if (method==='GET' && path==='/api/employee/all') {
    return jsonResponse(EMPLOYEES);
  }
  if (method==='GET' && path==='/api/employee') {
    const term = (q.term||'').toLowerCase();
    const filter = q.filter ? Number(q.filter) : undefined;
    const gender = q.gender as ('M'|'F'|'O'|undefined);
    const cursor = q.cursor ? Number(q.cursor) : 0;
    const pageSize = 40;

    let list = EMPLOYEES;
    if (gender) list = list.filter(e => e.gender===gender);
    if (filter===1) list = list.filter(e => e.manager);
    if (filter===2) list = list.filter(e => e.reportingEligible);
    if (term) list = list.filter(e => e.name.toLowerCase().includes(term));

    const page = list.slice(cursor, cursor+pageSize);
    const nextCursor = (cursor+pageSize) < list.length ? String(cursor+pageSize) : null;
    return jsonResponse({ items: page.map(e=>({ id:e.id, name:e.name })), nextCursor });
  }
  if (method==='GET' && path.startsWith('/api/employee/')) {
    const id = path.split('/').pop()!;
    const e = EMPLOYEES.find(x=>x.id===id);
    if (!e) return jsonResponse({ message:'Not found' }, 404);
    return jsonResponse({ id:e.id, name:e.name });
  }

  if (method==='GET' && path==='/api/department/all') {
    return jsonResponse(DEPARTMENTS);
  }

  return jsonResponse({ message:'Unknown route '+path }, 404);
}
