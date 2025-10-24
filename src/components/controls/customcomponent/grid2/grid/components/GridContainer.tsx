import React from 'react';
import GridTable from './GridTable';
import type { ColumnDef, Row } from '../utils/types';
import { OptionProvider } from '../../section/optionProviders';

export type GridContainerProps = {
  columns: ColumnDef[];
  rows: Row[];
  onOpenRecord?: (id: number) => void;
  optionProviders?: Record<string, OptionProvider>;
};

type EditingCell = { rowId: number; colKey: string; draft: any; error?: string | null };

export default function GridContainer({ columns, rows, onOpenRecord, optionProviders }: GridContainerProps) {
  const [localRows, setLocalRows] = React.useState<Row[]>(rows);
  const [sort, setSort] = React.useState<{ col: string; dir: 'asc'|'desc' }|null>(null);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [editing, setEditing] = React.useState<EditingCell | null>(null);

  React.useEffect(()=>{ setLocalRows(rows); }, [rows]);

  const sorted = React.useMemo(()=>{
    if (!sort) return localRows;
    return [...localRows].sort((a,b)=>{
      const av = a[sort.col], bv = b[sort.col];
      if (av==bv) return 0;
      const res = av < bv ? -1 : 1;
      return sort.dir==='asc' ? res : -res;
    });
  }, [localRows, sort]);

  const cycleSort = (col: string) => {
    setSort(prev => {
      if (!prev || prev.col!==col) return { col, dir:'asc' };
      if (prev.dir==='asc') return { col, dir:'desc' };
      return null;
    });
  };

  const toggleRow = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };
  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? sorted.map(r=>r.Id) : []);
  };

  const startEdit = (rowId: number, colKey: string, initial?: any) => {
    const row = localRows.find(r=>r.Id===rowId);
    const draft = initial ?? row?.[colKey];
    setEditing({ rowId, colKey, draft });
  };
  const commitEdit = () => {
    if (!editing) return;
    const col = columns.find(c=>c.ColumnHeader===editing.colKey);
    const row = localRows.find(r=>r.Id===editing.rowId);
    if (!col || !row) { setEditing(null); return; }
    const err = col.validate ? col.validate(editing.draft, row) : null;
    if (err) { setEditing(prev=> prev ? { ...prev, error: err } : prev); return; }
    setLocalRows(prev => prev.map(r => r.Id===editing.rowId ? { ...r, [editing.colKey]: editing.draft } : r));
    setEditing(null);
  };
  const cancelEdit = () => setEditing(null);

  return (
    <GridTable
      rows={sorted}
      columns={columns}
      onSort={cycleSort}
      selectedIds={selected}
      onToggleRow={toggleRow}
      onToggleSelectAll={toggleSelectAll}
      selectAllChecked={selected.length>0 && selected.length===sorted.length}
      onHyperlink={onOpenRecord}
      editing={editing}
      onStartEdit={startEdit}
      onDraftChange={(draft)=>setEditing(prev=> prev ? { ...prev, draft, error:null } : prev)}
      onCommit={commitEdit}
      onCancel={cancelEdit}
      optionProviders={optionProviders}
    />
  );
}
