import React from 'react';
import type { Row, ColumnDef } from '../utils/types';
import { OptionProvider, OptionItem } from '../../section/optionProviders';

type EditingCell = { rowId: number; colKey: string; draft: any; error?: string | null };

export type GridTableProps = {
  rows: Row[];
  columns: ColumnDef[];
  selectedIds: number[];
  selectAllChecked: boolean;
  onToggleRow: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onSort?: (col: string) => void;
  onHyperlink?: (id: number) => void;

  editing: EditingCell | null;
  onStartEdit: (rowId: number, colKey: string, initial?: any) => void;
  onDraftChange: (draft: any) => void;
  onCommit: () => void;
  onCancel: () => void;

  optionProviders?: Record<string, OptionProvider>;
};

function useDebounced<T>(val: T, delay = 250) {
  const [deb, setDeb] = React.useState(val);
  React.useEffect(() => { const t = setTimeout(()=>setDeb(val), delay); return ()=>clearTimeout(t); }, [val, delay]);
  return deb;
}

function TextCellEditor({ value, onChange, onCommit, onCancel, error }:{
  value:any; onChange:(v:any)=>void; onCommit:()=>void; onCancel:()=>void; error?:string|null;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(()=>{ ref.current?.focus(); ref.current?.select(); },[]);
  return (
    <div>
      <input
        ref={ref}
        className="editor-input"
        value={value ?? ''}
        onChange={(e)=>onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e)=>{ if(e.key==='Enter'){ onCommit(); } if(e.key==='Escape'){ onCancel(); } }}
      />
      {error ? <div style={{ color:'crimson', fontSize:12 }}>{error}</div> : null}
    </div>
  );
}

function CheckboxCellEditor({ value, onChange, onCommit }:{
  value:boolean; onChange:(v:boolean)=>void; onCommit:()=>void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(()=>{ ref.current?.focus(); },[]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!value}
      onChange={(e)=>{ onChange(e.target.checked); onCommit(); }}
    />
  );
}

function SelectCellEditor({ value, onChange, onCommit, onCancel, options }:{
  value:any; onChange:(v:any)=>void; onCommit:()=>void; onCancel:()=>void;
  options:{value:string; label:string}[];
}) {
  const ref = React.useRef<HTMLSelectElement>(null);
  React.useEffect(()=>{ ref.current?.focus(); },[]);
  return (
    <select
      ref={ref}
      value={value ?? ''}
      onChange={(e)=>{ onChange(e.target.value); }}
      onBlur={onCommit}
      onKeyDown={(e)=>{ if(e.key==='Enter'){ onCommit(); } if(e.key==='Escape'){ onCancel(); } }}
      className="editor-input"
    >
      <option value="" disabled>— select —</option>
      {options.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SelectRemoteEditor({
  value, onChange, onCommit, onCancel, provider, params
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  provider: OptionProvider;
  params?: Record<string, any>;
}) {
  const [term, setTerm] = React.useState('');
  const debTerm = useDebounced(term, 250);
  const [items, setItems] = React.useState<OptionItem[]>([]);
  const [cursor, setCursor] = React.useState<string | null | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const loadPage = React.useCallback(async (reset = true) => {
    const nextCursor = reset ? null : (cursor ?? null);
    setLoading(true);
    try {
      const page = await provider.load({ term: debTerm, cursor: nextCursor, params });
      const merged = reset ? page.items : [ ...(items ?? []), ...page.items ];
      setItems(merged);
      setCursor(page.nextCursor ?? null);
    } finally { setLoading(false); }
  }, [debTerm, cursor, params, provider, items]);

  React.useEffect(()=>{ loadPage(true); }, [loadPage]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onCommit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div style={{ position:'relative' }} onKeyDown={onKeyDown}>
      <input
        autoFocus
        placeholder="Search…"
        value={term}
        onChange={(e)=>setTerm(e.target.value)}
        className="editor-input"
        style={{ marginBottom: 6, width:'100%' }}
      />
      <div style={{ maxHeight: 220, overflow:'auto', border:'1px solid #e5e7eb', borderRadius:8, background:'#fff' }}>
        {items.map(opt => (
          <div
            key={opt.value}
            onMouseDown={()=>{ onChange(opt.value); onCommit(); }}
            style={{ padding:'6px 8px', cursor:'pointer', background: value===opt.value ? '#eef6ff' : 'transparent' }}
          >
            {opt.label}
          </div>
        ))}
        {loading && <div style={{ padding:8, color:'#666' }}>Loading…</div>}
        {!loading && cursor && (
          <button className="btn" style={{ width:'100%', borderRadius:0 }} onMouseDown={(e)=>{ e.preventDefault(); loadPage(false); }}>
            Load more
          </button>
        )}
        {!loading && items.length===0 && <div style={{ padding:8, color:'#999' }}>No results</div>}
      </div>
    </div>
  );
}

function resolveOptionParams(col: ColumnDef, row: Row): Record<string, any> | undefined {
  if (!col.optionParams) return undefined;
  return typeof col.optionParams === 'function' ? col.optionParams(row) : col.optionParams;
}

export default function GridTable(props: GridTableProps) {
  const {
    rows, columns, selectedIds, selectAllChecked, onToggleRow, onToggleSelectAll,
    onSort, onHyperlink, editing, onStartEdit, onDraftChange, onCommit, onCancel,
    optionProviders
  } = props;

  const visibleCols = React.useMemo(
    () => [...columns].filter(c => !c.IsHidden).sort((a,b)=>(a.ColumnOrder??0)-(b.ColumnOrder??0)),
    [columns]
  );

  const renderCell = (r: Row, col: ColumnDef) => {
    const isEditing = editing && editing.rowId === r.Id && editing.colKey === col.ColumnHeader;
    if (isEditing) {
      if (col.editor === 'checkbox') {
        return <CheckboxCellEditor value={!!editing!.draft} onChange={onDraftChange} onCommit={onCommit} />;
      }
      if (col.editor === 'select' && col.options) {
        return <SelectCellEditor value={editing!.draft} options={col.options} onChange={onDraftChange} onCommit={onCommit} onCancel={onCancel} />;
      }
      if (col.editor === 'select-remote' && col.optionProviderKey && optionProviders?.[col.optionProviderKey]) {
        const params = resolveOptionParams(col, r);
        return <SelectRemoteEditor value={editing!.draft} provider={optionProviders[col.optionProviderKey]} params={params} onChange={onDraftChange} onCommit={onCommit} onCancel={onCancel} />;
      }
      return <TextCellEditor value={editing!.draft} onChange={onDraftChange} onCommit={onCommit} onCancel={onCancel} error={editing!.error} />;
    }

    const raw = r[col.ColumnHeader];
    const display = col.format ? col.format(raw) : (raw ?? '');
    const canEdit = col.editable === true;

    const content = (col.ColumnHeader.toLowerCase().includes('name') && onHyperlink)
      ? <a href="#" onClick={(e)=>{ e.preventDefault(); onHyperlink(r.Id); }}>{String(display)}</a>
      : <span>{String(display)}</span>;

    return (
      <div
        onDoubleClick={()=> canEdit && onStartEdit(r.Id, col.ColumnHeader, raw)}
        title={canEdit ? 'Double-click to edit' : undefined}
        style={{ cursor: canEdit ? 'text' : 'default' }}
      >{content}</div>
    );
  };

  return (
    <div style={{ overflow:'auto', border:'1px solid #e5e7eb', borderRadius:12 }}>
      <table className="table striped">
        <thead>
          <tr>
            <th style={{ width:36 }}>
              <input type="checkbox" checked={selectAllChecked} onChange={(e)=>onToggleSelectAll(e.target.checked)} />
            </th>
            {visibleCols.map(col => (
              <th key={col.Id}>
                <button className="btn" onClick={()=>onSort?.(col.ColumnHeader)}>{col.ColumnName}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.Id}>
              <td>
                <input type="checkbox" checked={selectedIds.includes(r.Id)} onChange={()=>onToggleRow(r.Id)} />
              </td>
              {visibleCols.map(col => (
                <td key={col.Id}>
                  {renderCell(r, col)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={visibleCols.length+1} style={{textAlign:'center',padding:16,color:'#666'}}>No data</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
