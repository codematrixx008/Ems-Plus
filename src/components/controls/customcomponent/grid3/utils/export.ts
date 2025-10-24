
import { ColumnDef, Row } from './types';

export function exportCsv(rows: Row[], columns: ColumnDef[], title: string) {
  const visible = columns.filter(c => !c.IsHidden);
  const header = visible.map(c => `"${c.ColumnName}"`).join(',');
  const lines = rows.map(r => visible.map(c => {
    const val = r[c.ColumnHeader];
    if (val == null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  }).join(','));

  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g,'_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
