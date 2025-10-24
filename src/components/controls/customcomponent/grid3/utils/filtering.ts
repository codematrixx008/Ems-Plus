import { Filters, Row, ColumnDef } from './types';
import { isDateLike } from './date';

export const applyFilters = (
  rows: Row[],
  filters: Filters,
  columns: ColumnDef[],
  globalSearch?: string
) => {
  let result = rows;

  // global search across visible columns
  if (globalSearch?.trim()) {
    const s = globalSearch.toLowerCase();
    const keys = columns.filter(c => !c.IsHidden).map(c => c.ColumnHeader);
    result = result.filter(r => keys.some(k => String(r[k] ?? '').toLowerCase().includes(s)));
  }

  // column filters
  Object.entries(filters).forEach(([key, f]) => {
    if (!f?.condition) return;
    result = result.filter(row => {
      const v = row[key];
      const cond = f.condition;
      const val = f.value;

      if (v == null) return false;

      if (typeof v === 'string') {
        const sv = v.toLowerCase();
        const tv = String(val ?? '').toLowerCase();
        if (cond === 'contain') return sv.includes(tv);
        if (cond === 'doesnotcontain') return !sv.includes(tv);
        if (cond === 'startwith') return sv.startsWith(tv);
        if (cond === 'endwith') return sv.endsWith(tv);
        // date-like in string
        if (['isafter','isonorafter','isbefore','isonorbefore'].includes(cond) && isDateLike(v)) {
          const dv = new Date(v).getTime(), tvt = new Date(val).getTime();
          if (cond === 'isafter') return dv > tvt;
          if (cond === 'isbefore') return dv < tvt;
          if (cond === 'isonorafter') return dv >= tvt;
          if (cond === 'isonorbefore') return dv <= tvt;
        }
      }

      if (typeof v === 'number') {
        const n = Number(val);
        if (Number.isNaN(n) && cond !== 'isempty' && cond !== 'isnotempty') return true;
        if (cond === 'equal') return v === n;
        if (cond === 'notequal') return v !== n;
        if (cond === 'greaterthan') return v > n;
        if (cond === 'greaterthanequal') return v >= n;
        if (cond === 'lessthan') return v < n;
        if (cond === 'lessthanequal') return v <= n;
        if (cond === 'between') {
          const min = Number(val?.min), max = Number(val?.max);
          if (Number.isNaN(min) || Number.isNaN(max)) return true;
          return v >= min && v <= max;
        }
      }

      if (typeof v === 'boolean') {
        if (cond === 'is') return v === (val === true || val === 'true');
        if (cond === 'isnot') return v !== (val === true || val === 'true');
      }

      if (isDateLike(v)) {
        const dv = new Date(v).getTime();
        if (cond === 'isafter') return dv > new Date(val).getTime();
        if (cond === 'isbefore') return dv < new Date(val).getTime();
        if (cond === 'isonorafter') return dv >= new Date(val).getTime();
        if (cond === 'isonorbefore') return dv <= new Date(val).getTime();
        if (cond === 'between') {
          const s = new Date(val?.startDate).getTime();
          const e = new Date(val?.endDate).getTime();
          if (Number.isNaN(s) || Number.isNaN(e)) return true;
          return dv >= s && dv <= e;
        }
      }

      if (cond === 'isempty') return v === '' || v === null || v === undefined;
      if (cond === 'isnotempty') return !(v === '' || v === null || v === undefined);
      return true;
    });
  });

  return result;
};
