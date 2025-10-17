// src/grid/components/GridActionButtons.tsx
import React from 'react';
import { Row } from './utils/types';
import { BsButtonControl } from '../../basecontrol';

type GridButton = {
  id: string;
  name: string;
  enabled: boolean;
  visible?: boolean;
};

type Props = {
  buttons: GridButton[];
  selectedIds: number[];
  localRows: Row[];
  onAdd: () => void;
  onEdit: (row: Row) => void;
  onDelete: () => void;
  onExport: () => void;
};

const GridActionButtons: React.FC<Props> = ({
  buttons,
  selectedIds,
  localRows,
  onAdd,
  onEdit,
  onDelete,
  onExport,
}) => {
  const selectedRow = localRows.find(r => r.Id === selectedIds[0]);

  const handleClick = (id: string) => {
    switch (id) {
      case 'add': onAdd(); break;
      case 'edit': selectedRow && onEdit(selectedRow); break;
      case 'delete': onDelete(); break;
      case 'export': onExport(); break;
      default: alert(`Button '${id}' clicked`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {buttons.map(btn => (
        <BsButtonControl
          key={btn.id}
          onClick={() => handleClick(btn.id)}
          disabled={!btn.enabled}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            background: btn.enabled ? 'var(--main-theme)' : 'var(--main-theme-light)',
            color: '#fff',
            border: 'none',
            cursor: btn.enabled ? 'pointer' : 'not-allowed',
            display: btn.visible === false ? 'none' : 'inline-block'
          }}
        >
          {btn.name}
        </BsButtonControl>
      ))}
    </div>
  );
};

export default GridActionButtons;
