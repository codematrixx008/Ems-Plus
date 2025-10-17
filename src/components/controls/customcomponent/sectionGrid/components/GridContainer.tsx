import * as React from "react";
import GridTable from "./GridTable";
import Pagination from "./Pagination";
import EditAddModal, { EditAddModalProps } from "./EditAddModal";
import { ColumnDef, SectionGridSchema, Row, EmployeeAddEditModalProps } from "../utils/types";
import { BsButtonControl } from "../../../basecontrol";

import * as FileIcon from "react-icons/fi";

const { FiPlus, FiEdit, FiTrash2, FiDownload } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };


type Props = {
  schema: SectionGridSchema;
  rows: Row[];
  pageSizeList?: number[];
  onOpenRecord?: (id: number) => void;
  onSelectedIdsChange?: (ids: number[]) => void;
  children?: React.ReactNode; // optional custom modal (must accept EditAddModalProps)
  useGridControls: boolean; // whether to show the grid controls (add/edit/delete buttons)
};

export default function GridContainer({
  schema,
  rows,
  pageSizeList = [5, 10, 20, 50, 100],
  onOpenRecord,
  onSelectedIdsChange,
  children,
  useGridControls,
}: Props) {
  const [localRows, setLocalRows] = React.useState<Row[]>(rows);
  React.useEffect(() => setLocalRows(rows), [rows]);

  const [columns, setColumns] = React.useState<ColumnDef[]>(schema.columns);
  React.useEffect(() => setColumns(schema.columns), [schema.columns]);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  React.useEffect(
    () => onSelectedIdsChange?.(selectedIds),
    [selectedIds, onSelectedIdsChange]
  );

  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [sort, setSort] = React.useState<{ col?: string; dir?: "asc" | "desc" }>(
    {}
  );

  const cycleSort = (col: string) => {
    setSort((prev) => {
      if (prev.col !== col) return { col, dir: "asc" };
      if (prev.dir === "asc") return { col, dir: "desc" };
      return {};
    });
  };

  const start = (pageNo - 1) * pageSize;
  const filtered = localRows; // hook up search/filters later

  const sorted = React.useMemo(() => {
    const copy = [...filtered];
    if (sort.col && sort.dir) {
      copy.sort((a, b) => {
        const av = a[sort.col!];
        const bv = b[sort.col!];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return copy;
  }, [filtered, sort]);

  const pageRows = sorted.slice(start, start + pageSize);
  const total = localRows.length;

  const selectAllChecked =
    selectedIds.length > 0 && selectedIds.length === pageRows.length;

  const toggleRow = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const onToggleSelectAll = (checked: boolean) => {
    if (!checked)
      setSelectedIds((prev) =>
        prev.filter((id) => !pageRows.some((r) => r.Id === id))
      );
    else
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...pageRows.map((r) => r.Id)]))
      );
  };

  // Edit/Add modal state
  const [edit, setEdit] = React.useState<{
    open: boolean;
    mode: "Add" | "Edit";
    row?: Row;
  }>({ open: false, mode: "Add" });

  const modalProps: EditAddModalProps = {
    open: edit.open,
    mode: edit.mode,
    columns,
    initial: edit.mode === "Edit" ? edit.row : {},
    onClose: () => setEdit({ open: false, mode: "Add" }),
    onSubmit: (vals) => {
      if (edit.mode === "Add") {
        const nextId = Math.max(0, ...localRows.map((r) => r.Id)) + 1;
        setLocalRows((prev) => [{ Id: nextId, ...vals }, ...prev]);
      } else if (edit.mode === "Edit" && edit.row) {
        setLocalRows((prev) =>
          prev.map((r) =>
            r.Id === edit.row!.Id ? { ...r, ...vals } : r
          )
        );
      }
      setEdit({ open: false, mode: "Add" });
    },
  };

  return (
    <div>
      {/* ===== Toolbar Buttons (Icons Aligned Right) ===== */}
      {useGridControls &&
        <div className="grid-controls flex gap-2 mb-3">
          {/* Add Button */}
          <BsButtonControl
            className="btn flex items-center justify-between gap-2 px-3 py-2"
            title="Add"
            onClick={() => setEdit({ open: true, mode: "Add" })}
          >
            <FiPlus />
          </BsButtonControl>

          {/* Edit Button */}
          <BsButtonControl
            className="btn flex items-center justify-between gap-2 px-3 py-2"
            title="Edit"
            disabled={selectedIds.length !== 1}
            onClick={() =>
              setEdit({
                open: true,
                mode: "Edit",
                row: localRows.find((r) => r.Id === selectedIds[0]),
              })
            }
          >
            <FiEdit />
          </BsButtonControl>

          {/* Delete Button */}
          <BsButtonControl
            className="btn flex items-center justify-between gap-2 px-3 py-2"
            title="Delete"
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (window.confirm(`Delete ${selectedIds.length} row(s)?`)) {
                setLocalRows((prev) =>
                  prev.filter((r) => !selectedIds.includes(r.Id))
                );
                setSelectedIds([]);
              }
            }}
          >
            <FiTrash2 />
          </BsButtonControl>
        </div>
      }
      {/* ===== Grid Table ===== */}
      <GridTable
        rows={pageRows}
        columns={columns}
        onSort={cycleSort}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleSelectAll={onToggleSelectAll}
        selectAllChecked={selectAllChecked}
        onHyperlink={onOpenRecord}
      />

      {/* ===== Pagination ===== */}
      <Pagination
        total={total}
        pageNo={pageNo}
        pageSize={pageSize}
        pageSizeList={pageSizeList}
        onPageNo={(n) => setPageNo(Math.max(1, n))}
        onPageSize={(n) => {
          setPageSize(n);
          setPageNo(1);
        }}
      />

      {/* ===== Edit/Add Modal ===== */}

      {/* For One Children Model ADD/EDIT Modal */}
      {/* {React.isValidElement(children)
        ? React.cloneElement(children as any, modalProps)
        : <EditAddModal {...modalProps} />} */}

      {/* In which multiple childeren Add/ Edit seperately */}

      {React.Children.count(children) > 0
        ? React.Children.map(children, child => {
          if (!React.isValidElement<Partial<EmployeeAddEditModalProps>>(child)) return null;

          const modalType = (child.props as any).modalType as 'Add' | 'Edit';
          // const isAdd = edit.mode === 'Add';
          // const isEdit = edit.mode === 'Edit';

          return React.cloneElement(
            child as React.ReactElement<Partial<EmployeeAddEditModalProps>>,
            {
              columns,
              open: edit.open && ((modalType === 'Add' && edit.mode === 'Add') || (modalType === 'Edit' && edit.mode === 'Edit')),

              initial: modalType === 'Edit' ? edit.row ?? {} : {},
              onClose: () => setEdit({ open: false, mode: 'Add' }),
              onSubmit: (vals: Record<string, any>) => {
                if (modalType === 'Add') {
                  const nextId = Math.max(0, ...localRows.map(r => r.Id)) + 1;
                  setLocalRows(prev => [{ Id: nextId, ...vals }, ...prev]);
                } else if (modalType === 'Edit' && edit.row) {
                  setLocalRows(prev =>
                    prev.map(r => (r.Id === edit.row!.Id ? { ...r, ...vals } : r))
                  );
                }
                setEdit({ open: false, mode: 'Add' });
              }
            }
          );
        })
        : <EditAddModal {...modalProps} />
      }
    </div>
  );
}
