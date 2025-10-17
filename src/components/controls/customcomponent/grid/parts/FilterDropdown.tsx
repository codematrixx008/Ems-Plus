import React from 'react';
import { ColumnDef, FilterEntry } from '../utils/types';

type Props = {
  column: ColumnDef;
  value?: FilterEntry;
  onChange: (entry: FilterEntry) => void;
  onClear: () => void;
};
const FilterDropdown: React.FC<Props> = ({ column, value, onChange, onClear }) => {
  const type = column.DbDateType ?? column.DataType ?? 'Varchar';
  const set = (k: keyof FilterEntry, v: any) =>
    onChange({ ...(value ?? { condition: '', value: '' }), [k]: v });

  const options =
    type === 'Varchar'
      ? ['contain', 'doesnotcontain', 'startwith', 'endwith', 'isempty', 'isnotempty']
      : type === 'Int'
        ? ['equal', 'notequal', 'greaterthan', 'greaterthanequal', 'lessthan', 'lessthanequal', 'between', 'isempty', 'isnotempty']
        : type === 'Date' || type === 'datetime'
          ? ['isafter', 'isonorafter', 'isbefore', 'isonorbefore', 'between', 'isempty', 'isnotempty']
          : type === 'Bit'
            ? ['is', 'isnot']
            : ['contain'];

  const cond = value?.condition ?? '';
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8, borderRadius: 4 }}>
      <select value={cond} onChange={(e) => set('condition', e.target.value)}>
        <option value="" disabled>Select Filter</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>

      {['isempty', 'isnotempty'].includes(cond) ? null : type === 'Int' && cond === 'between' ? (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <input type="number" placeholder="Min" value={value?.value?.min ?? ''} onChange={e => set('value', { ...(value?.value ?? {}), min: e.target.value })} />
          <input type="number" placeholder="Max" value={value?.value?.max ?? ''} onChange={e => set('value', { ...(value?.value ?? {}), max: e.target.value })} />
        </div>
      ) : (type === 'Date' || type === 'datetime') && cond === 'between' ? (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <input type="date" value={value?.value?.startDate ?? ''} onChange={e => set('value', { ...(value?.value ?? {}), startDate: e.target.value })} />
          <input type="date" value={value?.value?.endDate ?? ''} onChange={e => set('value', { ...(value?.value ?? {}), endDate: e.target.value })} />
        </div>
      ) : (
        <div style={{ marginTop: 6 }}>
          <input
            type={type === 'Int' ? 'number' : (type === 'Date' || type === 'datetime') ? 'date' : 'text'}
            placeholder="Value"
            value={value?.value ?? ''}
            onChange={e => set('value', e.target.value)}
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  );
};
export default FilterDropdown;
