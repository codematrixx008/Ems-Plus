// src/grid/components/GridActionButtons3.tsx
import React from "react";
import { Row } from "../utils/types";
import { BsButtonControl } from "../../../basecontrol";

// Define button type
type GridButton = {
  id: string;
  name: string;
  enabled: boolean;
  visible?: boolean;
};

// Define props type
type Props = {
  buttons?: GridButton[]; // made optional for safety
  selectedIds?: number[];
  localRows?: Row[];
  onAdd: () => void;
  onEdit: (row: Row) => void;
  onDelete: () => void;
  onExport: () => void;
};

const GridActionButtons3: React.FC<Props> = ({
  buttons = [], // default empty array
  selectedIds = [],
  localRows = [],
  onAdd,
  onEdit,
  onDelete,
  onExport,
}) => {
  // Try to get the first selected row safely
  const selectedRow = localRows.find((r) => r.Id === selectedIds[0]);

  const handleClick = (id: string) => {
    switch (id) {
      case "add":
        onAdd();
        break;
      case "edit":
        if (selectedRow) onEdit(selectedRow);
        else alert("Please select a row to edit.");
        break;
      case "delete":
        onDelete();
        break;
      case "export":
        onExport();
        break;
      default:
        alert(`Button '${id}' clicked`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {buttons.length === 0 ? (
        <span style={{ color: "#888", fontSize: 13 }}>
          No actions available
        </span>
      ) : (
        buttons.map((btn) =>
          btn.visible === false ? null : (
            <BsButtonControl
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              disabled={!btn.enabled}
              style={{
                padding: "6px 12px",
                borderRadius: 4,
                background: btn.enabled
                  ? "var(--main-theme)"
                  : "var(--main-theme-light)",
                color: "#fff",
                border: "none",
                cursor: btn.enabled ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              {btn.name}
            </BsButtonControl>
          )
        )
      )}
    </div>
  );
};

export default GridActionButtons3;
