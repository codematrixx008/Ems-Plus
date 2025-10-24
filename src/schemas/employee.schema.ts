import { GridSchema } from '../components/controls/customcomponent/grid/utils/types';
import { SectionGridSchema } from '../components/controls/customcomponent/sectionGrid/utils/types';
import { ColumnDef } from "../components/controls/customcomponent/grid3/utils/types";


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
    { Id: 1, ColumnHeader: 'EmployeeName', ColumnName: 'Name', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 1, validate: null },
    { Id: 2, ColumnHeader: 'Department', ColumnName: 'Department', DataType: 'Varchar', ComponentType: 'Dropdown', ColumnOrder: 2, validate: null },
    { Id: 3, ColumnHeader: 'Designation', ColumnName: 'Designation', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 3, validate: null },
    { Id: 4, ColumnHeader: 'Email', ColumnName: 'Email', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 4, validate: null },
    { Id: 5, ColumnHeader: 'Phone', ColumnName: 'Phone', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 5, validate: null },
    { Id: 6, ColumnHeader: 'City', ColumnName: 'City', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 6, validate: null },
    { Id: 7, ColumnHeader: 'JoinDate', ColumnName: 'Join Date', DataType: 'Date', ComponentType: 'DatePicker', ColumnOrder: 7, validate: null },
    { Id: 8, ColumnHeader: 'Experience', ColumnName: 'Experience (Years)', DataType: 'Int', ComponentType: 'Number', ColumnOrder: 8, validate: null },
    { Id: 9, ColumnHeader: 'Manager', ColumnName: 'Reporting Manager', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 9, validate: null },
    { Id: 10, ColumnHeader: 'Active', ColumnName: 'Active', DataType: 'Bit', ComponentType: 'Checkbox', ColumnOrder: 10, validate: null },
    { Id: 11, ColumnHeader: 'Salary', ColumnName: 'Salary', DataType: 'Currency', ComponentType: 'CurrencyTextbox', ColumnOrder: 11, validate: null },
    { Id: 12, ColumnHeader: 'Remarks', ColumnName: 'Remarks', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 12, validate: null },
  ],
};

export const employeeSectionSchema: SectionGridSchema = {
  title: 'Employees',
  settings: { isGlobalSearchVisible: true },
  columns: [
    { Id: 1, ColumnHeader: 'EmployeeName', ColumnName: 'Employee Name', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 1 },
    { Id: 2, ColumnHeader: 'Department', ColumnName: 'Department', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 2 },
    { Id: 3, ColumnHeader: 'Title', ColumnName: 'Title', DataType: 'Varchar', ComponentType: 'Textbox', ColumnOrder: 3 },
    { Id: 4, ColumnHeader: 'StartDate', ColumnName: 'Start Date', DataType: 'Date', ComponentType: 'DatePicker', ColumnOrder: 4 },
    { Id: 5, ColumnHeader: 'Active', ColumnName: 'Active', DataType: 'Boolean', ComponentType: 'Checkbox', ColumnOrder: 5 },
  ]
};