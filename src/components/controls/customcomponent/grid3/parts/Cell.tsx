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
  // Style should be applied in <td> from Body, not here
  // So Cell will now only return inner content

  // Hyperlink Column Example
  if (col.ColumnName === "EmployeeName") {
    return (
      <a
        onClick={() => onHyperlink?.(rowId)}
        style={{ cursor: 'pointer', color: "blue", textDecoration: "underline" }}
      >
        {value}
      </a>
    );
  }

  // Checkbox Column
  if (col.ComponentType === "Checkbox") {
    return <input type="checkbox" checked={!!value} readOnly />;
  }

  // Currency Column
  if (col.ComponentType === "CurrencyTextbox") {
    return <span>{`${settings?.Currency ?? ''} ${value ?? ''}`}</span>;
  }

  // Default
  return <span>{String(value ?? '')}</span>;
};

export default Cell;
