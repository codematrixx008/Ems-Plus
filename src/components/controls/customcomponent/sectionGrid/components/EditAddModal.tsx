
import * as React from 'react';
import { ColumnDef, Row } from '../utils/types';

export type EditAddModalProps = {
  open: boolean;
  mode: 'Add' | 'Edit';
  columns: ColumnDef[];
  initial?: Row | Record<string, any>;
  onClose: () => void;
  onSubmit: (vals: Record<string, any>) => void;
};

export default function EditAddModal({ open, mode, columns, initial, onClose, onSubmit }: EditAddModalProps) {
  const [vals, setVals] = React.useState<Record<string, any>>(initial ?? {});
  React.useEffect(()=> setVals(initial ?? {}), [open, initial]);
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <strong>{mode} Row </strong>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {columns.filter(c=>!c.IsHidden).map(c=>(
              <label key={c.Id} style={{ display:'grid', gap:6 }}>
                <span style={{ fontWeight:600 }}>{c.ColumnName}</span>
                {c.ComponentType === 'Checkbox' ? (
                  <input type="checkbox"
                    checked={!!vals[c.ColumnHeader]}
                    onChange={(e)=>setVals(v=>({ ...v, [c.ColumnHeader]: e.target.checked }))} />
                ) : c.ComponentType === 'Number' ? (
                  <input type="number"
                    value={vals[c.ColumnHeader] ?? ''}
                    onChange={(e)=>setVals(v=>({ ...v, [c.ColumnHeader]: e.target.valueAsNumber }))} />
                ) : c.ComponentType === 'DatePicker' ? (
                  <input type="date"
                    value={vals[c.ColumnHeader] ?? ''}
                    onChange={(e)=>setVals(v=>({ ...v, [c.ColumnHeader]: e.target.value }))} />
                ) : (
                  <input type="text"
                    value={vals[c.ColumnHeader] ?? ''}
                    onChange={(e)=>setVals(v=>({ ...v, [c.ColumnHeader]: e.target.value }))} />
                )}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={()=>onSubmit(vals)} style={{ background:'#0a7cc2', color:'#fff' }}>Save</button>
        </div>
      </div>
    </div>
  );
}
