import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { BsPagination } from "./BsPagination";
import "./DataTable.css";
import { BsInputControl } from "./BsInputControl";

// ====================================
// 📘 Column Definition
// ====================================
export type Column<T> = {
  key: keyof T & string;
  title: React.ReactNode;
  width?: number | string;
  sortable?: boolean;
  editable?: boolean;
  frozen?: boolean;
  type?: "text" | "number" | "date" | "boolean";
  render?: (row: T) => React.ReactNode;
};

// ====================================
// 📘 Props Definition
// ====================================
export type BsDataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  pageSize?: number;
  filterText?: string;
  onFilterTextChange?: (v: string) => void;
  onEdit?: (key: keyof T, value: any, rowIndex: number) => void;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableEditing?: boolean;
};

// ====================================
// 📘 Main Component
// ====================================
export function BsDataTable<T extends Record<string, any>>({
  columns,
  rows,
  pageSize = 10,
  filterText = "",
  onFilterTextChange,
  onEdit,
  enableFiltering = true,
  enablePagination = true,
  enableSorting = true,
  enableEditing = true,
}: BsDataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [tempValue, setTempValue] = useState<any>("");

  // 🔍 Apply per-column filters
  const applyFilters = useCallback(
    (data: T[]) =>
      data.filter((row) =>
        columns.every((col) => {
          const f = filters[col.key];
          if (!f) return true;
          const value = row[col.key];

          switch (col.type) {
            case "number": {
              const [min, max] = f || ["", ""];
              return (
                (min === "" || value >= Number(min)) &&
                (max === "" || value <= Number(max))
              );
            }
            case "date": {
              const [start, end] = f || ["", ""];
              const d = new Date(value);
              return (
                (!start || d >= new Date(start)) &&
                (!end || d <= new Date(end))
              );
            }
            case "boolean":
              return f === "all" ? true : String(value) === f;
            default:
              return String(value)
                .toLowerCase()
                .includes(String(f).toLowerCase());
          }
        })
      ),
    [columns, filters]
  );

  // 🔎 Combine global + column filters
  const filtered = useMemo(() => {
    let data = [...rows];
    if (filterText) {
      const text = filterText.toLowerCase();
      data = data.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(text)
        )
      );
    }
    return applyFilters(data);
  }, [rows, filterText, applyFilters]);

  // ↕️ Sorting
  const sorted = useMemo(() => {
    if (!sortKey || !enableSorting) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null || vb == null) return 0;
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, enableSorting]);

  // 🔢 Pagination
  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const pageRows = enablePagination ? sorted.slice(start, start + pageSize) : sorted;

  // ↕️ Sort toggle
  const changeSort = (k: string) => {
    if (!enableSorting) return;
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  //  Row selection
  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    const allIndexes = pageRows.map((_, i) => i + start);
    setSelectedRows(
      selectedRows.length === pageRows.length ? [] : allIndexes
    );
  };

  // ✏️ Inline editing
  const handleDoubleClick = (rowIndex: number, colKey: string, value: any) => {
    const col = columns.find((c) => c.key === colKey);
    if (enableEditing && col?.editable) {
      setEditingCell({ row: rowIndex, col: colKey });
      setTempValue(value ?? "");
    }
  };

  const handleEditSave = () => {
    if (editingCell && onEdit) {
      onEdit(editingCell.col as keyof T, tempValue, editingCell.row);
    }
    setEditingCell(null);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleEditSave();
      if (e.key === "Escape") setEditingCell(null);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [editingCell, tempValue]);

  // 🧮 Frozen offset calculation
  const getFrozenOffset = (colIndex: number) =>
    columns
      .slice(0, colIndex)
      .reduce(
        (acc, col) => (col.frozen ? acc + (Number(col.width) || 100) : acc),
        0
      );

  // ====================================
  // 📘 Render
  // ====================================
  return (
    <div className="cx-panel cx-table-wrapper">
      {/* Header */}
      <div className="cx-table-header">
        {enableFiltering && (
          <BsInputControl
            className="cx-input"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => onFilterTextChange?.(e.target.value)}
          />
        )}
        <div className="cx-results-count">{total} results</div>
      </div>

      {/* Table */}
      <div className="cx-table-container">
        <table className="cx-table">
          <thead>
            <tr>
              <th style={{ position: "sticky", left: 0, zIndex: 3, background: "#fff" }}>
                <BsInputControl
                  type="checkbox"
                  checked={
                    selectedRows.length === pageRows.length &&
                    pageRows.length > 0
                  }
                  onChange={toggleAll}
                />
              </th>

              {columns.map((c, colIndex) => {
                const style: React.CSSProperties = {
                  width: c.width,
                  position: c.frozen ? "sticky" : undefined,
                  left: c.frozen ? getFrozenOffset(colIndex) + 50 : undefined,
                  zIndex: c.frozen ? 3 : undefined,
                  background: c.frozen ? "#fff" : undefined,
                };

                return (
                  <th key={c.key} style={style}>
                    <div
                      className={`cx-sort ${c.sortable ? "cx-sortable" : ""}`}
                      onClick={() => c.sortable && changeSort(c.key)}
                    >
                      {c.title}
                      {sortKey === c.key && (
                        <span className="cx-sort-icon">
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>

                    {enableFiltering && (
                      <div className="cx-col-filter">
                        {c.type === "text" && (
                          <BsInputControl
                            type="text"
                            placeholder="Filter"
                            value={filters[c.key] || ""}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                [c.key]: e.target.value,
                              }))
                            }
                          />
                        )}

                        {c.type === "number" && (
                          <div className="num-filter">
                            <BsInputControl
                              type="number"
                              placeholder="Min"
                              value={filters[c.key]?.[0] || ""}
                              onChange={(e) =>
                                setFilters((f) => ({
                                  ...f,
                                  [c.key]: [
                                    e.target.value,
                                    f[c.key]?.[1] || "",
                                  ],
                                }))
                              }
                            />
                            <BsInputControl
                              type="number"
                              placeholder="Max"
                              value={filters[c.key]?.[1] || ""}
                              onChange={(e) =>
                                setFilters((f) => ({
                                  ...f,
                                  [c.key]: [
                                    f[c.key]?.[0] || "",
                                    e.target.value,
                                  ],
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((r, i) => {
              const rowIndex = i + start;
              return (
                <tr
                  key={rowIndex}
                  className={`cx-row ${selectedRows.includes(rowIndex) ? "selected" : ""
                    }`}
                >
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      background: "#fff",
                    }}
                  >
                    <BsInputControl
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => toggleRow(rowIndex)}
                    />
                  </td>

                  {columns.map((c, colIndex) => {
                    const val = r[c.key];
                    const isEditing =
                      editingCell?.row === rowIndex &&
                      editingCell?.col === c.key;

                    const style: React.CSSProperties = {
                      width: c.width,
                      position: c.frozen ? "sticky" : undefined,
                      left: c.frozen ? getFrozenOffset(colIndex) + 50 : undefined,
                      zIndex: c.frozen ? 2 : undefined,
                      background: c.frozen ? "#fff" : undefined,
                    };

                    return (
                      <td
                        key={c.key}
                        style={style}
                        onDoubleClick={() =>
                          handleDoubleClick(rowIndex, c.key, val)
                        }
                      >
                        {isEditing ? (
                          <BsInputControl
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onBlur={handleEditSave}
                            autoFocus
                          />
                        ) : c.render ? (
                          c.render(r)
                        ) : (
                          String(val)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="cx-table-footer">
          <BsPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
