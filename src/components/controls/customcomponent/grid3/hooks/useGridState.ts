import { useMemo, useState } from 'react';
import { Filters, Row, ColumnDef, SortConfig } from '../utils/types';
import { applyFilters } from '../utils/filtering';
import { sortBy } from '../utils/sorting';

export function useGridState(rowsIn: Row[], columnsIn: ColumnDef[]) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<SortConfig>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [...columnsIn].filter(c => !c.IsHidden).sort((a, b) => a.ColumnOrder - b.ColumnOrder),
    [columnsIn]
  );

  const filtered = useMemo(() => applyFilters(rowsIn, filters, columns, search), [rowsIn, filters, columns, search]);
  const sorted = useMemo(() => sortBy(filtered, sort), [filtered, sort]);

  const total = sorted.length;
  const start = (pageNo - 1) * pageSize;
  const pageRows = useMemo(() => sorted.slice(start, start + pageSize), [sorted, start, pageSize]);

  const toggleRow = (id: number) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const selectAllOnPage = () => setSelectedIds(pageRows.map(r => r.Id));
  const clearSelection = () => setSelectedIds([]);

  const cycleSort = (field: string) =>
    setSort(prev => !prev || prev.column !== field ? { column: field, direction: 'asc' } :
      { column: field, direction: prev.direction === 'asc' ? 'desc' : 'asc' });

  return {
    search, setSearch,
    filters, setFilters,
    sort, cycleSort,
    selectedIds, toggleRow, selectAllOnPage, clearSelection,
    pageNo, setPageNo,
    pageSize, setPageSize,
    columns, pageRows, total
  };
}
