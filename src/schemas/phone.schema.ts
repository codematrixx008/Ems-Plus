import { SectionGridSchema } from '../components/controls/customcomponent/sectionGrid/utils/types';

export const phoneSchema: SectionGridSchema = {
  title: 'Phone Numbers',
  settings: { isGlobalSearchVisible: false },
  columns: [
    { Id: 1, ColumnHeader: 'Type', ColumnName: 'Phone Type', DataType: 'Varchar', ComponentType: 'Dropdown', ColumnOrder: 1 },
    { Id: 2, ColumnHeader: 'FullPhone', ColumnName: 'Full Phone', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 2 },
    { Id: 3, ColumnHeader: 'Dial', ColumnName: 'Dial', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 3 },
    { Id: 4, ColumnHeader: 'ModifiedOn', ColumnName: 'Modified On', DataType: 'Date', ComponentType: 'DatePicker', ColumnOrder: 4 },
    { Id: 5, ColumnHeader: 'Remarks', ColumnName: 'Remarks', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 5 },
  ]
};
