
import * as React from 'react';
import { ColumnDef, Row } from '../utils/types';
import { BsButtonControl, BsInputControl } from '../../../basecontrol';

type Props = {
  rows: Row[];
  columns: ColumnDef[];
  onSort?: (col: string) => void;
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  selectAllChecked: boolean;
  onHyperlink?: (id: number) => void;
};

export default function GridTable({
  rows, columns, onSort,
  selectedIds, onToggleRow, onToggleSelectAll, selectAllChecked,
  onHyperlink
}: Props) {

  const visibleCols = React.useMemo(
    () => [...columns].filter(c => !c.IsHidden).sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0)),
    [columns]
  );

  return (
    <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <table className="table striped">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <BsInputControl type="checkbox" checked={selectAllChecked} onChange={(e) => onToggleSelectAll(e.target.checked)} />
            </th>
            {visibleCols.map(col => (
              <th key={col.Id}>
                <BsButtonControl className="btn" onClick={() => onSort?.(col.ColumnHeader)}>{col.ColumnName}</BsButtonControl>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.Id}>
              <td>
                <BsInputControl type="checkbox" checked={selectedIds.includes(r.Id)} onChange={() => onToggleRow(r.Id)} />
              </td>
              {visibleCols.map(col => (
                <td key={col.Id}>
                  {col.ColumnHeader.toLowerCase().includes('name') && onHyperlink
                    ? <a href="#" onClick={(e) => { e.preventDefault(); onHyperlink(r.Id); }}>{String(r[col.ColumnHeader] ?? '')}</a>
                    : String(r[col.ColumnHeader] ?? '')
                  }
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={visibleCols.length + 1} style={{ textAlign: 'center', padding: 16, color: '#777' }}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
