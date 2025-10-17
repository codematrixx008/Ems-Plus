import React from 'react';
import Pagination from './Pagination';
import ColumnCustomizerModal from './ColumnCustomizerModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditAddModal from './EditAddModal';
import GridActionButtons from './GridActionButtons';
import { EditAddModalProps, GridSchema, Row } from './utils/types';
import GridTable from './GridTable';
import GridToolbar from './GridToolbar';
import { useExports } from './hooks/useExports';
import { useGridState } from './hooks/useGridState';

type GridButton = {
  id: string;
  name: string;
  enabled: boolean;
};

type Props = {
  schema: GridSchema;
  rows: Row[];
  buttons: GridButton[];
  pageSizeList?: number[];
  onOpenRecord?: (id: number) => void;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  children?: React.ReactNode;
};

const GridContainer: React.FC<Props> = ({
  schema,
  rows,
  buttons,
  pageSizeList = [5, 10, 20, 50, 100],
  onOpenRecord,
  enableFiltering = true,
  enablePagination = true,
  children,
}) => {
  const {
    search, setSearch,
    filters, setFilters,
    cycleSort,
    selectedIds, toggleRow, selectAllOnPage, clearSelection,
    pageNo, setPageNo, pageSize, setPageSize,
    columns, pageRows, total
  } = useGridState(rows, schema.columns);

  const { exportCsv } = useExports();

  const selectAllChecked = selectedIds.length > 0 && selectedIds.length === pageRows.length;
  const onToggleSelectAll = (checked: boolean) =>
    checked ? selectAllOnPage() : clearSelection();

  const [showCustomize, setShowCustomize] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState<{ open: boolean; mode: 'Add' | 'Edit'; row?: Row }>({
    open: false,
    mode: 'Add'
  });

  const [localRows, setLocalRows] = React.useState<Row[]>(rows);
  React.useEffect(() => setLocalRows(rows), [rows]);

  const selectedRows = localRows.filter(r => selectedIds.includes(r.Id));

  //  Context to pass into modal
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
      } else if (editModal.mode === 'Edit' && editModal.row) {
        setLocalRows(prev => prev.map(r => r.Id === editModal.row!.Id ? { ...r, ...vals } : r));
      }
      setEditModal({ open: false, mode: 'Add' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: '8px 0' }}>{schema.title}</h2>

      {/* Toolbar */}
      <GridToolbar
        settings={schema.settings}
        search={search}
        onSearchChange={setSearch}
        onOpenCustomize={() => setShowCustomize(true)}
        onExportCsv={() =>
          exportCsv(selectedRows.length ? selectedRows : pageRows, columns, schema.settings, schema.title)
        }
      />

      {/* Action Buttons */}
      <GridActionButtons
        buttons={buttons}
        selectedIds={selectedIds}
        localRows={localRows}
        onAdd={() => setEditModal({ open: true, mode: 'Add' })}
        onEdit={(row) => setEditModal({ open: true, mode: 'Edit', row })}
        onDelete={() => setShowDeleteModal(true)}
        onExport={() =>
          exportCsv(selectedRows.length ? selectedRows : pageRows, columns, schema.settings, schema.title)
        }
      />

      {/* Table */}
      <GridTable
        rows={pageRows}
        columns={columns}
        settings={schema.settings}
        filters={enableFiltering ? filters : {}}
        onFilterChange={
          enableFiltering ? (key, entry) => setFilters(prev => ({ ...prev, [key]: entry })) : undefined
        }
        onFilterClear={
          enableFiltering
            ? (key) => setFilters(prev => {
              const { [key]: _, ...rest } = prev;
              return rest;
            })
            : undefined
        }
        onSort={cycleSort}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleSelectAll={onToggleSelectAll}
        selectAllChecked={selectAllChecked}
        onHyperlink={onOpenRecord}
        enableFiltering={enableFiltering}  //  Controlled by parent
      />

      {/* Pagination */}
      {enablePagination && (
        <Pagination
          total={total}
          pageNo={pageNo}
          pageSize={pageSize}
          pageSizeList={pageSizeList}
          onPageNo={setPageNo}
          onPageSize={(n) => { setPageSize(n); setPageNo(1); }}
        />
      )}

      {/* Modals */}
      <ColumnCustomizerModal
        open={showCustomize}
        columns={schema.columns}
        onClose={() => setShowCustomize(false)}
        onApply={(cols) => {
          schema.columns.splice(0, schema.columns.length, ...cols);
          setShowCustomize(false);
        }}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        count={selectedIds.length}
        onConfirm={() => {
          setLocalRows(prev => prev.filter(r => !selectedIds.includes(r.Id)));
          setShowDeleteModal(false);
        }}
      />

      {/* Edit/Add Modal */}
      {React.isValidElement(children)
        ? React.cloneElement(children, editCtx)
        : <EditAddModal {...editCtx} />}
    </div>
  );
};

export default GridContainer;
