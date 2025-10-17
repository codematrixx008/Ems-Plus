import React, { useMemo, useState } from 'react';
import { ColumnDef } from './utils/types';
import { BsButtonControl, BsInputControl } from '../../basecontrol';

type Props = {
  open: boolean;
  columns: ColumnDef[];
  onClose: () => void;
  onApply: (cols: ColumnDef[]) => void;
};

const ColumnCustomizerModal: React.FC<Props> = ({ open, columns, onClose, onApply }) => {
  const [localCols, setLocalCols] = useState<ColumnDef[]>(columns);
  React.useEffect(() => setLocalCols(columns), [columns]);

  const visible = useMemo(() => localCols.filter(c => !c.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder), [localCols]);
  const hidden = useMemo(() => localCols.filter(c => c.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder), [localCols]);

  const setHidden = (ids: number[], flag: boolean) => {
    setLocalCols(prev => prev.map(c => ids.includes(c.Id) ? { ...c, IsHidden: flag } : c));
  };

  const move = (id: number, dir: 'up' | 'down') => {
    setLocalCols(prev => {
      const arr = [...prev].sort((a, b) => a.ColumnOrder - b.ColumnOrder);
      const i = arr.findIndex(c => c.Id === id);
      if (i === -1) return prev;
      const step = dir === 'up' ? -1 : 1;
      let j = i + step;
      while (j >= 0 && j < arr.length && arr[j].IsHidden) j += step;
      if (j < 0 || j >= arr.length) return prev;
      const A = arr[i], B = arr[j];
      const temp = A.ColumnOrder; A.ColumnOrder = B.ColumnOrder; B.ColumnOrder = temp;
      return [...arr];
    });
  };

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'grid', placeItems: 'center', zIndex: 9999
    }}>
      <div style={{ background: '#fff', width: 720, maxWidth: '90vw', padding: 16, borderRadius: 8 }}>
        <h3>Customize Columns</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12 }}>
          <div style={{ border: '1px solid #eee', padding: 8 }}>
            <h4 style={{ marginTop: 0 }}>Hidden</h4>
            {hidden.map(c => (
              <label key={c.Id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <BsInputControl type="checkbox" checked={!!c.IsHidden} onChange={() => setHidden([c.Id], false)} />
                {c.ColumnName}
              </label>
            ))}
            {hidden.length === 0 && <div style={{ opacity: 0.6 }}>None</div>}
          </div>

          <div style={{ display: 'grid', placeItems: 'center' }}>
            <BsButtonControl onClick={() => setHidden(hidden.map(h => h.Id), false)}>{'>> Show all'}</BsButtonControl>
            <BsButtonControl onClick={() => setHidden(visible.map(v => v.Id), true)} style={{ marginTop: 8 }}>{'<< Hide all'}</BsButtonControl>
          </div>

          <div style={{ border: '1px solid #eee', padding: 8 }}>
            <h4 style={{ marginTop: 0 }}>Visible (reorder)</h4>
            {visible.map(c => (
              <div key={c.Id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <BsButtonControl onClick={() => move(c.Id, 'up')}>↑</BsButtonControl>
                <BsButtonControl onClick={() => move(c.Id, 'down')}>↓</BsButtonControl>
                <span>{c.ColumnName}</span>
                <BsButtonControl style={{ marginLeft: 'auto' }} onClick={() => setHidden([c.Id], true)}>Hide</BsButtonControl>
              </div>
            ))}
            {visible.length === 0 && <div style={{ opacity: 0.6 }}>None</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <BsButtonControl onClick={onClose}>Cancel</BsButtonControl>
          <BsButtonControl onClick={() => onApply(localCols)}>Apply</BsButtonControl>
        </div>
      </div>
    </div>
  );
};
export default ColumnCustomizerModal;
