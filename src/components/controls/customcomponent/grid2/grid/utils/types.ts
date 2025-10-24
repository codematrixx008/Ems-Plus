export type Row = { Id: number; [key: string]: any };

export type ColumnDef = {
  Id: number;
  ColumnHeader: string;
  ColumnName: string;
  DataType?: 'Varchar' | 'Int' | 'Date' | 'Boolean' | string;
  ColumnOrder?: number;
  IsHidden?: boolean;
  IsFreeze?: boolean;

  editable?: boolean;
  editor?: 'text' | 'checkbox' | 'select' | 'select-remote';
  options?: { value: string; label: string }[];
  optionProviderKey?: string;
  optionParams?: Record<string, any> | ((row: Row) => Record<string, any>);
  format?: (val: any) => string;
  validate?: (val: any, row: Row) => string | null;
};
