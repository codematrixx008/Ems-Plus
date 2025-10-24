import React from 'react';
import { EditAddModalProps, GridSchema, Row, ColumnDef } from './utils/types';
import { useExports } from './hooks/useExports';
import { useGridState } from './hooks/useGridState';
import { OptionProvider } from './section/optionProviders';
import GridTable3 from './GridTable3';
import DeleteConfirmModal3 from './section/Modal/DeleteConfirmModal3';
import EditAddModal3 from './section/Modal/EditAddModal3';
import * as FileIcon from "react-icons/fi";
import Pagination3 from './utils/Pagination3';
import ColumnCustomizerModal3 from './section/Modal/ColumnCustomizerModal3';


const { FiPlus, FiEdit, FiTrash2, FiDownload } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };

// ---- Types ----
type GridButton = {
  id: string;
  name: string;
  enabled: boolean;
};

type Props = {
  columns: GridSchema;
  rows: Row[];
  buttons?: GridButton[];
  pageSizeList?: number[];
  onOpenRecord?: (id: number) => void;
  onAction?: (id: string, payload?: any) => void; //  FIXED: Added this
  optionProviders?: Record<string, OptionProvider>;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  useGridControls?: boolean;
  children?: React.ReactNode;

  //  For selection control
  selectedIds?: number[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>;
};

type EditingCell = {
  rowId: number;
  colKey: string;
  draft: any;
  error?: string | null;
};

const GridContainer3: React.FC<Props> = ({
  columns: schema,
  rows,
  buttons = [],
  pageSizeList = [5, 10, 20, 50, 100],
  onOpenRecord,
  onAction, //  Included in props
  optionProviders,
  enableFiltering = true,
  enablePagination = true,
  useGridControls = false,
  children,
  selectedIds: propSelectedIds,
  setSelectedIds: propSetSelectedIds
}) => {

  const {
    search, setSearch,
    filters, setFilters,
    selectedIds = propSelectedIds ?? [],
    selectAllOnPage,
    clearSelection,
    pageNo, setPageNo,
    pageSize, setPageSize,
    columns,
    pageRows,
    total
  } = useGridState(rows, schema.columns);

  const { exportCsv } = useExports();
  const [localRows, setLocalRows] = React.useState<Row[]>(rows);
  const [editing, setEditing] = React.useState<EditingCell | null>(null);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState<{ open: boolean; mode: 'Add' | 'Edit'; row?: Row }>({
    open: false,
    mode: 'Add'
  });

  const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' } | null>(null);
  const [selected, setSelected] = React.useState<number[]>([]);



  React.useEffect(() => setLocalRows(rows), [rows]);

  const sorted = React.useMemo(() => {
    if (!sort) return localRows;
    return [...localRows].sort((a, b) => {
      const av = a[sort.col], bv = b[sort.col];
      if (av == bv) return 0;
      const res = av < bv ? -1 : 1;
      return sort.dir === 'asc' ? res : -res;
    });
  }, [localRows, sort]);

  const cycleSort = (col: string) => {
    setSort(prev => {
      if (!prev || prev.col !== col) return { col, dir: 'asc' };
      if (prev.dir === 'asc') return { col, dir: 'desc' };
      return null;
    });
  };

  const toggleRow = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? sorted.map(r => r.Id) : []);
  };

  const selectAllChecked = selectedIds.length > 0 && selectedIds.length === pageRows.length;
  const onToggleSelectAll = (checked: boolean) =>
    checked ? selectAllOnPage() : clearSelection();

  const selectedRows = localRows.filter(r => selectedIds.includes(r.Id));

  // ---- Inline Editing ----
  const startEdit = (rowId: number, colKey: string, initial?: any) => {
    const row = localRows.find(r => r.Id === rowId);
    const draft = initial ?? row?.[colKey];
    setEditing({ rowId, colKey, draft });
  };

  const commitEdit = (rowId?: number, colKey?: string, value?: any) => {
    if (!editing && (!rowId || !colKey)) return;
    const rowToUpdateId = rowId ?? editing?.rowId!;
    const colToUpdateKey = colKey ?? editing?.colKey!;
    const newValue = value ?? editing?.draft;

    setLocalRows(prev =>
      prev.map(r =>
        r.Id === rowToUpdateId ? { ...r, [colToUpdateKey]: newValue } : r
      )
    );
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  // ---- Edit/Add Modal ----
  const editCtx: EditAddModalProps = {
    open: editModal.open,
    mode: editModal.mode,
    columns: schema.columns,
    initial: editModal.mode === 'Edit' ? editModal.row : {},
    onClose: () => setEditModal({ open: false, mode: 'Add' }),
    onSubmit: (vals) => {
      if (editModal.mode === 'Add') {
        const nextId = Math.max(0, ...localRows.map(r => r.Id)) + 1;
        setLocalRows(prev => [{ Id: nextId, ...vals }, ...prev]);
        onAction?.('Add', vals); //  Trigger parent onAction
      } else if (editModal.mode === 'Edit' && editModal.row) {
        const updated = { ...editModal.row, ...vals };
        setLocalRows(prev => prev.map(r => r.Id === editModal.row!.Id ? updated : r));
        onAction?.('Edit', updated); //  Trigger parent onAction
      }
      setEditModal({ open: false, mode: 'Add' });
    }
  };

  // ---- Render ----
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* <h2 style={{ margin: '8px 0' }}>{schema.title}</h2> */}

      {useGridControls &&
        <div className="grid-controls flex gap-2 mb-3">
          {/* Add Button */}
          <BsButtonControl
            className="btn flex items-center justify-between gap-2 px-3 py-2"
            title="Add"
            onClick={() => setEditModal({ open: true, mode: "Add" })}
          >
            <FiPlus />
          </BsButtonControl>

          {/* Edit Button */}
          <BsButtonControl
            className="btn flex items-center justify-between gap-2 px-3 py-2"
            title="Edit"
            disabled={selectedIds.length !== 1}
            onClick={() =>
              setEditModal({
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
                propSetSelectedIds && propSetSelectedIds([]); //  FIXED
              }
            }}
          >
            <FiTrash2 />
          </BsButtonControl>

        </div>
      }
      {/* abc */}

      {/* <GridTable3
        rows={pageRows}
        columns={columns}
        settings={schema.settings}
        filters={enableFiltering ? filters : {}}
        onFilterChange={enableFiltering ? (key, entry) => setFilters(prev => ({ ...prev, [key]: entry })) : undefined}
        onFilterClear={enableFiltering ? (key) => setFilters(prev => {
          const { [key]: _, ...rest } = prev;
          return rest;
        }) : undefined}
        onSort={cycleSort}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleSelectAll={onToggleSelectAll}
        selectAllChecked={selectAllChecked}
        onHyperlink={onOpenRecord}
        enableFiltering={enableFiltering}
        editing={editing}
        onStartEdit={startEdit}
        onDraftChange={(draft) => setEditing(prev => prev ? { ...prev, draft, error: null } : prev)}
        onCommit={commitEdit}
        onCancel={cancelEdit}
        optionProviders={optionProviders}
      /> */}

      <GridTable3
        rows={sorted}
        columns={columns}
        onSort={cycleSort}
        selectedIds={selected}
        onToggleRow={toggleRow}
        onToggleSelectAll={toggleSelectAll}
        selectAllChecked={selected.length > 0 && selected.length === sorted.length}
        onHyperlink={onOpenRecord}
        editing={editing}
        onStartEdit={startEdit}
        onDraftChange={(draft) => setEditing(prev => prev ? { ...prev, draft, error: null } : prev)}
        onCommit={commitEdit}
        onCancel={cancelEdit}
        optionProviders={optionProviders}
        settings={schema.settings}
        filters={enableFiltering ? filters : {}} />

      {enablePagination && (
        <Pagination3
          total={total}
          pageNo={pageNo}
          pageSize={pageSize}
          pageSizeList={pageSizeList}
          onPageNo={setPageNo}
          onPageSize={(n) => { setPageSize(n); setPageNo(1); }}
        />
      )}

      <ColumnCustomizerModal3
        open={showCustomize}
        columns={schema.columns}
        onClose={() => setShowCustomize(false)}
        onApply={(cols) => {
          schema.columns.splice(0, schema.columns.length, ...cols);
          setShowCustomize(false);
        }}
      />

      <DeleteConfirmModal3
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        count={selectedIds.length}
        onConfirm={() => {
          setLocalRows(prev => prev.filter(r => !selectedIds.includes(r.Id)));
          setShowDeleteModal(false);
          onAction?.('Delete', selectedIds); //  Trigger parent onAction
        }}
      />

      {React.isValidElement(children)
        ? React.cloneElement(children, editCtx)
        : <EditAddModal3 {...editCtx} />}
    </div>
  );
};

export default GridContainer3;