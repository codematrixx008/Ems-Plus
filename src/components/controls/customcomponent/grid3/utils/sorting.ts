import { Row, SortConfig } from './types';

export const sortBy = (rows: Row[], sort: SortConfig) => {
  if (!sort) return rows;
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[sort.column], y = b[sort.column];
    if (x == null && y == null) return 0;
    if (x == null) return -1 * dir;
    if (y == null) return 1 * dir;
    if (x < y) return -1 * dir;
    if (x > y) return 1 * dir;
    return 0;
  });
};
