import React from 'react';
import { ColumnDef, GridSettings } from '../utils/types';

type Props = {
  rowId: number;
  col: ColumnDef;
  value: any;
  settings: GridSettings;
  onHyperlink?: (id: number) => void;
};
const Cell: React.FC<Props> = ({ rowId, col, value, settings, onHyperlink }) => {
  const style: React.CSSProperties = {
    textAlign:
      col.ComponentType === "CurrencyTextbox" ? "right" :
        col.ComponentType === "Textbox" || col.ComponentType === "Dropdown" ? "left" : "center",
    minWidth: col.Length ? `${col.Length}px` : "160px",
    padding: "6px 10px",
    borderRight: "1px solid #eee",
    position: col.IsFreeze ? "sticky" : "static",
    background: col.IsFreeze ? (settings?.FreezeBackground || "whitesmoke") : "transparent",
    zIndex: col.IsFreeze ? 100 : 1,
  };

  if (col.ColumnName === "EmployeeName") {
    return <td style={style}><a onClick={() => onHyperlink?.(rowId)} style={{ cursor: 'pointer' }}>{value}</a></td>;
  }
  if (col.ComponentType === "Checkbox") {
    return <td style={style}><input type="checkbox" checked={!!value} readOnly /></td>;
  }
  if (col.ComponentType === "CurrencyTextbox") {
    return <td style={style}>{`${settings?.Currency ?? ''} ${value ?? ''}`}</td>;
  }
  return <td style={style}>{String(value ?? '')}</td>;
};
export default Cell;
