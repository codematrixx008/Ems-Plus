import React, { useState } from "react";
import Header from "./parts/Header";
import "./GridTable3.css";
import { ColumnDef, GridSettings, Row } from "./utils/types";
import { OptionProvider } from "./section/optionProviders";
import Body from "./parts/Body";

type EditingCell = { rowId: number; colKey: string; draft: any; error?: string | null };

type Props = {
  rows: Row[];
  columns: ColumnDef[];
  settings: GridSettings;
  onSort: (field: string) => void;
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  selectAllChecked: boolean;
  onHyperlink?: (id: number) => void;
  enableFiltering?: boolean;
  editing?: EditingCell | null;
  onStartEdit?: (rowId: number, colKey: string, initial?: any) => void;
  onDraftChange?: (draft: any) => void;
  onCommit?: (rowId?: number, colKey?: string, value?: any) => void;
  onCancel?: () => void;
  optionProviders?: Record<string, OptionProvider>;

  // ✅ Add this line
  filters?: Record<string, any>;
};

const GridTable3: React.FC<Props> = ({
  rows,
  columns,
  settings,
  onSort,
  selectedIds,
  onToggleRow,
  onToggleSelectAll,
  selectAllChecked,
  onHyperlink,
  enableFiltering = true,
  editing,
  onStartEdit,
  onDraftChange,
  onCommit,
  onCancel,
  optionProviders,
  filters: externalFilters, // ✅ new prop
}) => {
  // ✅ Manage filters here
  const [filters, setFilters] = useState<Record<string, any>>(externalFilters ?? {});

  const handleFilterChange = (key: string, entry: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: entry,
    }));
  };

  const handleFilterClear = (key: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Apply filtering to rows
  const filteredRows = React.useMemo(() => {
    if (!enableFiltering) return rows;

    return rows.filter(row => {
      return Object.entries(filters).every(([key, filter]) => {
        if (!filter?.condition) return true;
        const value = String(row[key] ?? "").toLowerCase();
        const target = typeof filter.value === "string" ? filter.value.toLowerCase() : filter.value;

        switch (filter.condition) {
          case "contain":
            return value.includes(target);
          case "doesnotcontain":
            return !value.includes(target);
          case "startwith":
            return value.startsWith(target);
          case "endwith":
            return value.endsWith(target);
          case "equal":
            return value === target;
          case "notequal":
            return value !== target;
          case "greaterthan":
            return Number(value) > Number(target);
          case "lessthan":
            return Number(value) < Number(target);
          case "isempty":
            return value.trim() === "";
          case "isnotempty":
            return value.trim() !== "";
          default:
            return true;
        }
      });
    });
  }, [rows, filters, enableFiltering]);



  return (
    <div
      className="grid-table-container"
      style={{
        overflowX: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
        <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
          <Header
            columns={columns}
            color={"#333"}
            bg={settings.Background || "#f9fafb"}
            onSort={onSort}
            filters={filters}
            onFilterChange={handleFilterChange}
            onFilterClear={handleFilterClear}
            onToggleSelectAll={onToggleSelectAll}
            selectAllChecked={selectAllChecked}
            enableFiltering={enableFiltering}
          />
        </thead>

        <tbody>
          <Body
            rows={filteredRows}
            columns={columns}
            selectedIds={selectedIds}
            onToggleRow={onToggleRow}
            onToggleSelectAll={onToggleSelectAll}
            settings={settings}
            onHyperlink={onHyperlink}
            editing={editing}
            onStartEdit={onStartEdit}
            onDraftChange={onDraftChange}
            onCommit={onCommit}
            onCancel={onCancel}
          />
        </tbody>
      </table>
    </div>
  );
};

export default GridTable3;
