import { api } from '../../lib/http/api';
import { OptionProvider } from '../optionProviders';

export const employeeProvider: OptionProvider = {
  load: async ({ term, cursor, params }) => {
    const q: Record<string, any> = {};
    if (term) q.term = term;
    if (cursor) q.cursor = cursor;
    if (params) Object.entries(params).forEach(([k,v]) => v!=null && (q[k]=v));

    const res = await api.get<{ items: { id:string; name:string }[]; nextCursor?: string | null }>(
      '/employee', { params: q }
    );
    return {
      items: res.items.map(x => ({ value: x.id, label: x.name })),
      nextCursor: res.nextCursor ?? null
    };
  },

  resolve: async (value) => {
    const res = await api.get<{ id:string; name:string }>(`/employee/${value}`);
    return { value: res.id, label: res.name };
  }
};
