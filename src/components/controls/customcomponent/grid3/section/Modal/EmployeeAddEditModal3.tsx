import React, { useEffect, useState } from 'react';
import { EmployeeAddEditModalProps } from '../../utils/types';

const EmployeeAddEditModal3: React.FC<Partial<EmployeeAddEditModalProps>> = ({
  open,
  mode,
  columns,
  initial,
  onClose,
  onSubmit
}) => {
  const [vals, setVals] = useState<Record<string, any>>(initial ?? {});
  useEffect(() => setVals(initial ?? {}), [open, initial]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 10000
      }}
    >
      <div
        style={{
          background: '#fff',
          width: 640,
          maxWidth: '95vw',
          padding: 16,
          borderRadius: 10
        }}
      >
        <h3 style={{ marginTop: 0 }}>{mode} Custom Employee </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 12
          }}
        >
          {(columns ?? []).filter(c => !c.IsHidden).map(c => (
            <label key={c.Id} style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontWeight: 600 }}>{c.ColumnName}</span>

              {c.ComponentType === 'Checkbox' ? (
                <input
                  type="checkbox"
                  checked={!!vals[c.ColumnHeader]}
                  onChange={(e) =>
                    setVals(v => ({ ...v, [c.ColumnHeader]: e.target.checked }))
                  }
                />
              ) : c.ComponentType === 'Number' ? (
                <input
                  type="number"
                  value={vals[c.ColumnHeader] ?? ''}
                  onChange={(e) =>
                    setVals(v => ({ ...v, [c.ColumnHeader]: e.target.valueAsNumber }))
                  }
                />
              ) : c.ComponentType === 'DatePicker' ? (
                <input
                  type="date"
                  value={vals[c.ColumnHeader] ?? ''}
                  onChange={(e) =>
                    setVals(v => ({ ...v, [c.ColumnHeader]: e.target.value }))
                  }
                />
              ) : (
                <input
                  type="text"
                  value={vals[c.ColumnHeader] ?? ''}
                  onChange={(e) =>
                    setVals(v => ({ ...v, [c.ColumnHeader]: e.target.value }))
                  }
                />
              )}
            </label>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            marginTop: 16
          }}
        >
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSubmit?.(vals)}
            style={{ background: '#0a7cc2', color: '#fff' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddEditModal3;
