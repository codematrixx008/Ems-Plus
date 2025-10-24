import React from 'react';
import { GridSettings } from './types';
import { BsInputControl } from '../../../basecontrol';

type Props = {
  settings: GridSettings;
  search: string;
  onSearchChange: (s: string) => void;
  onOpenCustomize: () => void;
  onExportCsv: () => void;
};
const GridToolbar3: React.FC<Props> = ({ settings, search, onSearchChange, onOpenCustomize, onExportCsv }) => {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 8, alignItems: 'center' }}>
      {settings?.isGlobalSearchVisible !== false && (
        <>
          <BsInputControl
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            style={{ padding: 6, minWidth: 240 }}
          />
          {search && <button onClick={() => onSearchChange('')}>Clear</button>}
        </>
      )}

    </div>
  );
};
export default GridToolbar3;
