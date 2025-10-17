import { GridSchema } from '../components/controls/customcomponent/grid/utils/types';
import { SectionGridSchema } from '../components/controls/customcomponent/sectionGrid/utils/types';

export const employeeSchema: GridSchema = {
  title: 'Employees',
  settings: {
    isGlobalSearchVisible: true,
    Currency: '₹',
    DateFormat: 'DD/MM/YYYY',
    // Background: '#0970c4ff',
    Color: '#fff',
  },
  columns: [
    { Id: 1, ColumnHeader: 'EmployeeName', ColumnName: 'Name', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 1 },
    { Id: 2, ColumnHeader: 'Department', ColumnName: 'Department', DataType: 'Varchar', ComponentType: 'Dropdown', ColumnOrder: 2 },
    { Id: 3, ColumnHeader: 'Designation', ColumnName: 'Designation', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 3 },
    { Id: 4, ColumnHeader: 'Email', ColumnName: 'Email', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 4 },
    { Id: 5, ColumnHeader: 'Phone', ColumnName: 'Phone', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 5 },
    { Id: 6, ColumnHeader: 'City', ColumnName: 'City', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 6 },
    { Id: 7, ColumnHeader: 'JoinDate', ColumnName: 'Join Date', DataType: 'Date', ComponentType: 'DatePicker', ColumnOrder: 7 },
    { Id: 8, ColumnHeader: 'Experience', ColumnName: 'Experience (Years)', DataType: 'Int', ComponentType: 'Number', ColumnOrder: 8 },
    { Id: 9, ColumnHeader: 'Manager', ColumnName: 'Reporting Manager', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 9 },
    { Id: 10, ColumnHeader: 'Active', ColumnName: 'Active', DataType: 'Bit', ComponentType: 'Checkbox', ColumnOrder: 10 },
    { Id: 11, ColumnHeader: 'Salary', ColumnName: 'Salary', DataType: 'Currency', ComponentType: 'CurrencyTextbox', ColumnOrder: 11 },
    { Id: 12, ColumnHeader: 'Remarks', ColumnName: 'Remarks', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 12 },
  ],
};

export const employeeSectionSchema: SectionGridSchema = {
  title: 'Employees',
  settings: { isGlobalSearchVisible: true },
  columns: [
    { Id: 1, ColumnHeader: 'EmployeeName', ColumnName: 'Employee Name', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 1 },
    { Id: 2, ColumnHeader: 'Department',   ColumnName: 'Department',    DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 2 },
    { Id: 3, ColumnHeader: 'Title',        ColumnName: 'Title',         DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 3 },
    { Id: 4, ColumnHeader: 'StartDate',    ColumnName: 'Start Date',    DataType: 'Date',    ComponentType: 'DatePicker', ColumnOrder: 4 },
    { Id: 5, ColumnHeader: 'Active',       ColumnName: 'Active',        DataType: 'Boolean', ComponentType: 'Checkbox', ColumnOrder: 5 },
  ]
};