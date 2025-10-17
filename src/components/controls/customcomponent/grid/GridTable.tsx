import React from "react";
import Header from "./parts/Header";
import Body from "./parts/Body";
import { ColumnDef, GridSettings, Row } from "./utils/types";
import './GridTable.css';



type Props = {
  rows: Row[];
  columns: ColumnDef[];
  settings: GridSettings;
  filters: Record<string, any>;
  onFilterChange?: (key: string, entry: any) => void;
  onFilterClear?: (key: string) => void;
  onSort: (field: string) => void;
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  selectAllChecked: boolean;
  onHyperlink?: (id: number) => void;
  enableFiltering?: boolean;
};

const GridTable: React.FC<Props> = ({
  rows,
  columns,
  settings,
  filters,
  onFilterChange,
  onFilterClear,
  onSort,
  selectedIds,
  onToggleRow,
  onToggleSelectAll,
  selectAllChecked,
  onHyperlink,
  enableFiltering = true,
}) => {
  return (
    <div
      className="grid-table-container"
      style={{
        overflowX: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <table
        cellPadding={0}
        cellSpacing={0}
        className="grid-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.875rem",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: settings.Background || "var(--main-theme, #f3f4f6)",
            color: settings.Color || "#333",
          }}
        >
          <Header
            columns={columns}
            color={settings.Color || "#333"}
            bg={settings.Background || "var(--main-theme, #f3f4f6)"}
            onSort={onSort}
            filters={enableFiltering ? filters : {}}
            onFilterChange={onFilterChange || (() => {})}
            onFilterClear={onFilterClear || (() => {})}
            onToggleSelectAll={onToggleSelectAll}
            selectAllChecked={selectAllChecked}
            enableFiltering={enableFiltering}
          />
        </thead>

        <tbody>
          <Body
            rows={rows}
            columns={columns}
            selectedIds={selectedIds}
            onToggleRow={onToggleRow}
            settings={settings}
            onHyperlink={onHyperlink}
          />
        </tbody>
      </table>
    </div>
  );
};

export default GridTable;
