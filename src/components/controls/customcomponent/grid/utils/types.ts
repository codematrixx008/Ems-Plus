// shared types
export type DbType = 'Varchar' | 'Int' | 'Date' | 'datetime' | 'Bit' | 'Currency';

export interface ColumnDef {
  Id: number;
  ColumnHeader: string;           // field key in row
  ColumnName: string;             // label
  ColumnName_StrCode?: string;    // i18n key (optional)
  DataType: DbType;
  ComponentType: 'Textbox' | 'Dropdown' | 'Checkbox' | 'Number' | 'DatePicker' | 'CurrencyTextbox';
  Length?: number;
  IsHidden?: boolean;
  IsFreeze?: boolean;
  IsEnabled?: boolean;
  ColumnOrder: number;
  DbDateType?: DbType;
  CustomPopover?: boolean;
  Email?: string;
}

export interface GridSettings {
  Background?: string;
  Color?: string;
  FreezeBackground?: string;
  Currency?: string;
  DateFormat?: string;
  isGlobalSearchVisible?: boolean;
}

export interface GridSchema {
  title: string;
  columns: ColumnDef[];
  settings: GridSettings;
}

export type Row = Record<string, any> & { Id: number };

export type SortConfig = { column: string; direction: 'asc' | 'desc' } | null;

export type FilterEntry = { condition: string; value: any };
export type Filters = Record<string, FilterEntry | undefined>;

export type EditAddModalProps = {
  open: boolean;
  mode: 'Add' | 'Edit';
  columns: ColumnDef[];
  initial?: Record<string, any>;
  onClose: () => void;
  onSubmit: (vals: Record<string, any>) => void;
};
