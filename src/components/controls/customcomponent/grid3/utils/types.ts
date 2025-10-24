import { ActionIdentifier } from "./actions";

// shared types
export type DbType = 'Varchar' | 'Int' | 'Date' | 'datetime' | 'Bit' | 'Currency';


export type TopButtonsComponentProps = {
  selectedIds: number[];
  emit: (identifier: ActionIdentifier, value?: unknown) => void;
};


export interface ColumnDef {
  Id: number;
  ColumnHeader: string;             // field name in row
  ColumnName: string;               // label to display
  ColumnName_StrCode?: string;      // optional translation code

  // Behavior flags
  IsEditable?: boolean;
  IsHidden?: boolean;
  IsFreeze?: boolean;
  IsEnabled?: boolean;
  isLink?: boolean;

  // Data & UI config
  DataType: DbType;
  ComponentType:
    | 'Textbox'
    | 'Dropdown'
    | 'Checkbox'
    | 'Number'
    | 'DatePicker'
    | 'CurrencyTextbox';

  Length?: number;
  DbDateType?: DbType;
  CustomPopover?: boolean;
  Email?: string;

  // Dropdown support
  options?: { value: string | number; label: string }[]; // ✅ local dropdown
  optionProviderKey?: string;                            // ✅ remote dropdown loader
  optionParams?: Record<string, any> | ((row: Row) => Record<string, any>);

  // Formatting & validation
  format?: (val: any) => string;
  validate?: (val: any, row: Row) => string | null;

  // Editor override
  editor?: string; // in case of future custom editor types
  ColumnOrder: number;
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

export type EmployeeAddEditModalProps = {
  open: boolean;
  mode: 'Add' | 'Edit';
  columns: ColumnDef[];
  initial?: Record<string, any>;
  onClose: () => void;
  onSubmit: (vals: Record<string, any>) => void;
  modalType?: 'Add' | 'Edit';
};
