import React from 'react';
import { ColumnDef, GridSettings, Row } from '../utils/types';
import Cell from './Cell';

type Props = {
  rows: Row[];
  columns: ColumnDef[];
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  settings: GridSettings;
  onHyperlink?: (id: number) => void;
};
const Body: React.FC<Props> = ({ rows, columns, selectedIds, onToggleRow, settings, onHyperlink }) => {
  return (
    <>
      {rows.map((row, idx) => (
        <tr key={row.Id} className={idx % 2 === 0 ? 'stripedRow' : ''}>
          <td style={{ position: 'sticky', left: 0, zIndex: 103, background: 'white', width: 60, padding: '14px', textAlign: 'center' }}>
            <input type="checkbox" checked={selectedIds.includes(row.Id)} onChange={() => onToggleRow(row.Id)} />
          </td>
          {columns.map(col => (
            <Cell key={col.Id} rowId={row.Id} col={col} value={row[col.ColumnHeader]} settings={settings} onHyperlink={onHyperlink} />
          ))}
        </tr>
      ))}
    </>
  );
};
export default Body;