import { useState } from 'react';
import { ColumnDef } from '../utils/types';

export function useColumnConfig(initial: ColumnDef[]) {
  const [customizeColumns, setCustomizeColumns] = useState<ColumnDef[]>(initial);

  const setHidden = (ids: number[], hidden: boolean) => {
    setCustomizeColumns(prev => prev.map(c => ids.includes(c.Id) ? { ...c, IsHidden: hidden } : c));
  };

  const moveOrder = (id: number, dir: 'up' | 'down') => {
    setCustomizeColumns(prev => {
      const sorted = [...prev].sort((a, b) => a.ColumnOrder - b.ColumnOrder);
      const idx = sorted.findIndex(c => c.Id === id);
      if (idx === -1) return prev;
      const step = dir === 'up' ? -1 : 1;
      let j = idx + step;
      // skip hidden targets
      while (j >= 0 && j < sorted.length && sorted[j].IsHidden) j += step;
      if (j < 0 || j >= sorted.length) return prev;
      const a = sorted[idx], b = sorted[j];
      const tmp = a.ColumnOrder; a.ColumnOrder = b.ColumnOrder; b.ColumnOrder = tmp;
      return sorted;
    });
  };

  return { customizeColumns, setCustomizeColumns, setHidden, moveOrder };
}
