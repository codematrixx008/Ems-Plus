import React, { useState, useRef, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import { ColumnDef } from "../utils/types";
import { BsButtonControl } from "../../../basecontrol";

type Props = {
  columns: ColumnDef[];
  color: string;
  bg: string;
  onSort: (field: string) => void;
  filters: Record<string, any>;
  onFilterChange: (colKey: string, entry: any) => void;
  onFilterClear: (colKey: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  selectAllChecked: boolean;
  enableFiltering?: boolean;
};

const Header: React.FC<Props> = ({
  columns,
  color,
  bg,
  onSort,
  filters,
  onFilterChange,
  onFilterClear,
  onToggleSelectAll,
  selectAllChecked,
  enableFiltering = true,
}) => {
  const [openCol, setOpenCol] = useState<string | null>(null);
  const headerRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenCol(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <tr ref={headerRef}>
      <th
        style={{
          position: "sticky",
          left: 0,
          zIndex: 103,
          background: bg,
          color,
          width: 40,
          textAlign: "center",
        }}
      >
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={(e) => onToggleSelectAll(e.target.checked)}
        />
      </th>

      {columns.map((col) => {
        const isOpen = openCol === col.ColumnHeader;
        const isSticky = col.IsFreeze ?? false;

        return (
          <th
            key={col.Id}
            title={col.ColumnName}
            style={{
              minWidth: col.Length ? `${col.Length}px` : "160px",
              textAlign: "center",
              color,
              background: bg,
              position: isSticky ? "sticky" : "relative",
              top: 0,
              zIndex: isSticky ? 110 : 1,
              padding: "6px 10px",
              whiteSpace: "nowrap",
              verticalAlign: "top",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <span
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => onSort(col.ColumnHeader)}
              >
                {col.ColumnName}
              </span>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <BsButtonControl
                  onClick={() => onSort(col.ColumnHeader)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color,
                  }}
                >
                  ↕
                </BsButtonControl>

                {enableFiltering && (
                  <BsButtonControl
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCol((prev) =>
                        prev === col.ColumnHeader ? null : col.ColumnHeader
                      );
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color,
                    }}
                    title="Filter"
                  >
                    ⋯
                  </BsButtonControl>
                )}
              </div>

              {enableFiltering && isOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    width: "240px",
                    marginTop: 4,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 200,
                    padding: 6,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FilterDropdown
                    column={col}
                    value={filters[col.ColumnHeader]}
                    onChange={(entry) => onFilterChange(col.ColumnHeader, entry)}
                    onClear={() => onFilterClear(col.ColumnHeader)}
                  />
                </div>
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
};

export default Header;
