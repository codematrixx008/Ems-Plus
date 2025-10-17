import { ActionIdentifier } from './actions';

export type TopButtonsComponentProps = {
  selectedIds: number[];
  emit: (identifier: ActionIdentifier, value?: unknown) => void;
};

export type ColumnDef = {
  Id: number;
  ColumnHeader: string;
  ColumnName: string;
  DataType: 'Varchar' | 'Int' | 'Date' | 'Boolean' | string;
  ComponentType?: 'Textbox' | 'Number' | 'DatePicker' | 'Checkbox' | 'Dropdown' | string;
  ColumnOrder?: number;
  IsHidden?: boolean;
  IsFreeze?: boolean;
};

export type Row = { Id: number;[key: string]: any };

export type SectionGridSchema = {
  title: string;
  settings?: {
    isGlobalSearchVisible?: boolean;
    Background?: string;
    Color?: string;
  };
  columns: ColumnDef[];
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
