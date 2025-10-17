import React, { useState, useRef, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';
import { ColumnDef } from '../utils/types';
import { BsButtonControl } from '../../../basecontrol';

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

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenCol(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <tr ref={headerRef}>
      {/* Select All Checkbox */}
      <th
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 103,
          background: bg,
          color,
          width: 40,
          textAlign: 'center',
        }}
      >
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={(e) => onToggleSelectAll(e.target.checked)}
        />
      </th>

      {/* Column Headers */}
      {columns.map((col) => {
        const isOpen = openCol === col.ColumnHeader;
        const isSticky = col.IsFreeze;

        return (
          <th
            key={col.Id}
            className={isSticky ? 'sticky' : ''}
            title={col.ColumnName}
            style={{
              minWidth: col.Length ? `${col.Length}px` : '160px',
              textAlign: 'center',
              color,
              background: bg,
              position: isSticky ? 'sticky' : 'relative',
              top: 0,
              zIndex: isSticky ? 110 : 1,
              padding: '6px 10px',
              whiteSpace: 'nowrap',
              verticalAlign: 'top',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <span>{col.ColumnName}</span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {/* Sort Button */}
                <BsButtonControl
                  onClick={() => onSort(col.ColumnHeader)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color,
                  }}
                  title="Sort"
                >
                  ↕
                </BsButtonControl>

                {/* Filter Button */}
                {enableFiltering && (
                  <BsButtonControl
                    onClick={() =>
                      setOpenCol((prev) =>
                        prev === col.ColumnHeader ? null : col.ColumnHeader
                      )
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color,
                    }}
                    title="Filter"
                  >
                    ⋯
                  </BsButtonControl>
                )}
              </div>

              {/* Filter Dropdown — positioned exactly below header */}
              {enableFiltering && isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%', // directly below the header
                    left: 0,
                    width: '100%',
                    marginTop: 4,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 200,
                  }}
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
