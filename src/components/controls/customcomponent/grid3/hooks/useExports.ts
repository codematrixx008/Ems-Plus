import { ColumnDef, Row, GridSettings } from '../utils/types';

const ts = () => {
  const d = new Date(); const pad = (n:number)=>String(n).padStart(2,'0');
  return `${pad(d.getMonth()+1)}${pad(d.getDate())}${d.getFullYear()}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

export function useExports() {
  const exportCsv = (rows: Row[], columns: ColumnDef[], settings: GridSettings, title = 'export') => {
    const visible = columns.filter(c => !c.IsHidden);
    const head = visible.map(c => `"${c.ColumnName}"`).join(',');
    const lines = rows.map(r => visible.map(c => `"${(r[c.ColumnHeader] ?? '')}"`).join(','));
    const blob = new Blob([[head, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title}_${ts()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  };
  // you can add XLSX/PDF later
  return { exportCsv };
}
