import type { ColumnDef } from '../grid/utils/types';

export const departmentSchema: ColumnDef[] = [
  { Id:1, ColumnHeader:'DepartmentName', ColumnName:'Department', editable:true, editor:'text', ColumnOrder:1 },
  { Id:2, ColumnHeader:'HeadId', ColumnName:'Head (Employee)', editable:true, editor:'select-remote', optionProviderKey:'Employee', optionParams:{ filter:1 }, ColumnOrder:2 },
];

export const departmentRows = [
  { Id: 1, DepartmentName: 'Engineering', HeadId:'' },
  { Id: 2, DepartmentName: 'Sales', HeadId:'' },
  { Id: 3, DepartmentName: 'HR', HeadId:'' },
  { Id: 4, DepartmentName: 'Finance', HeadId:'' },
];
