import React from 'react';
import { EditAddModalProps, GridSchema, Row } from './utils/types';
import { useExports } from './hooks/useExports';
import { useGridState } from './hooks/useGridState';
import { OptionProvider } from './section/optionProviders';
import GridTable3 from './GridTable3';
import DeleteConfirmModal3 from './section/Modal/DeleteConfirmModal3';
import EditAddModal3 from './section/Modal/EditAddModal3';
import ColumnCustomizerModal3 from './section/Modal/ColumnCustomizerModal3';
import Pagination3 from './utils/Pagination3';
import * as FileIcon from "react-icons/fi";

const { FiPlus, FiEdit, FiTrash2 } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };

// --- Button Control ---
type BsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { title?: string };
const BsButtonControl: React.FC<BsButtonProps> = ({ children, title, ...props }) => (
  <button {...props} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: 4, cursor: props.disabled ? "not-allowed" : "pointer" }} title={title}>
    {children}
  </button>
);

// ---- Types ----
type GridButton = { id: string; name: string; enabled: boolean };
type Props = {
  columns: GridSchema;
  rows: Row[];
  buttons?: GridButton[];
  pageSizeList?: number[];
  onOpenRecord?: (id: number) => void;
  onAction?: (id: string, payload?: any) => void;
  optionProviders?: Record<string, OptionProvider>;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  useGridControls?: boolean;
  children?: React.ReactNode;
  selectedIds?: number[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>;
};
type EditingCell = { rowId: number; colKey: string; draft: any; error?: string | null; };

const GridContainer3: React.FC<Props> = ({
  columns: schema,
  rows,
  buttons = [],
  pageSizeList = [5, 10, 20, 50, 100],
  onOpenRecord,
  onAction,
  optionProviders,
  enableFiltering = true,
  enablePagination = true,
  useGridControls = false,
  children,
  selectedIds: propSelectedIds,
  setSelectedIds: propSetSelectedIds
}) => {

  const [localRows, setLocalRows] = React.useState<Row[]>(rows);
  
  // Local selection state management
  const [localSelectedIds, setLocalSelectedIds] = React.useState<number[]>([]);
  
  // Use prop selection if provided, otherwise use local state
  const selectedIds = propSelectedIds ?? localSelectedIds;
  const setSelectedIds = propSetSelectedIds ?? setLocalSelectedIds;

  // Apply sorting BEFORE passing to useGridState
  const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' } | null>(null);
  
  const sortedRows = React.useMemo(() => {
    if (!sort) return localRows;
    return [...localRows].sort((a, b) => {
      const av = a[sort.col], bv = b[sort.col];
      if (av === bv) return 0;
      const res = av < bv ? -1 : 1;
      return sort.dir === 'asc' ? res : -res;
    });
  }, [localRows, sort]);

  const {
    filters, setFilters,
    selectAllOnPage,
    clearSelection,
    pageNo, setPageNo,
    pageSize, setPageSize,
    columns,
    pageRows,
    total
  } = useGridState(sortedRows, schema.columns); // Pass sortedRows instead of rows

  const { exportCsv } = useExports();
  const [editing, setEditing] = React.useState<EditingCell | null>(null);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState<{ open: boolean; mode: 'Add' | 'Edit'; row?: Row }>({ open: false, mode: 'Add' });

  React.useEffect(() => setLocalRows(rows), [rows]);

  // ---- Selection Handlers ----
  const handleToggleRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all rows on current page
      const pageIds = pageRows.map(row => row.Id);
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    } else {
      // Deselect all rows on current page
      const pageIds = pageRows.map(row => row.Id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const isSelectAllChecked = selectedIds.length > 0 && pageRows.every(row => selectedIds.includes(row.Id));

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
    setLocalRows(prev => prev.map(r => r.Id === rowToUpdateId ? { ...r, [colToUpdateKey]: newValue } : r));
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
        onAction?.('Add', vals);
      } else if (editModal.mode === 'Edit' && editModal.row) {
        const updated = { ...editModal.row, ...vals };
        setLocalRows(prev => prev.map(r => r.Id === editModal.row!.Id ? updated : r));
        onAction?.('Edit', updated);
      }
      setEditModal({ open: false, mode: 'Add' });
    }
  };

  // ---- Sorting ----
  const cycleSort = (col: string) => {
    setSort(prev => !prev || prev.col !== col ? { col, dir: 'asc' } : prev.dir === 'asc' ? { col, dir: 'desc' } : null);
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {useGridControls &&
        <div className="grid-controls flex gap-2 mb-3">
          <BsButtonControl title="Add" onClick={() => setEditModal({ open: true, mode: "Add" })}><FiPlus /></BsButtonControl>
          <BsButtonControl title="Edit" disabled={selectedIds.length !== 1} onClick={() =>
            setEditModal({ open: true, mode: "Edit", row: localRows.find(r => r.Id === selectedIds[0]) })}><FiEdit /></BsButtonControl>
          <BsButtonControl title="Delete" disabled={selectedIds.length === 0} onClick={() => setShowDeleteModal(true)}><FiTrash2 /></BsButtonControl>
        </div>
      }

      <GridTable3
        rows={pageRows} // This now contains properly paginated AND sorted data
        columns={columns}
        onSort={cycleSort}
        selectedIds={selectedIds}
        onToggleRow={handleToggleRow}
        onToggleSelectAll={handleToggleSelectAll}
        selectAllChecked={isSelectAllChecked}
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
        onApply={(cols) => { schema.columns.splice(0, schema.columns.length, ...cols); setShowCustomize(false); }}
      />

      <DeleteConfirmModal3
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        count={selectedIds.length}
        onConfirm={() => {
          setLocalRows(prev => prev.filter(r => !selectedIds.includes(r.Id)));
          setShowDeleteModal(false);
          setSelectedIds([]);
          onAction?.('Delete', selectedIds);
        }}
      />

      {React.isValidElement(children) ? React.cloneElement(children, editCtx) : <EditAddModal3 {...editCtx} />}
    </div>
  );
};

export default GridContainer3;