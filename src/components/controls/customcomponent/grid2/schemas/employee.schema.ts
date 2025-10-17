import type { ColumnDef } from '../grid/utils/types';

export const employeeSchema: ColumnDef[] = [
  { Id:1, ColumnHeader:'EmployeeName', ColumnName:'Employee Name', editable:true, editor:'text', ColumnOrder:1 },
  { Id:2, ColumnHeader:'Gender', ColumnName:'Gender', editable:true, editor:'select', options:[
    { value:'M', label:'Male' },
    { value:'F', label:'Female' },
    { value:'O', label:'Other' },
  ], ColumnOrder:2 },
  { Id:3, ColumnHeader:'Active', ColumnName:'Active', editable:true, editor:'checkbox', ColumnOrder:3 },
  { Id:4, ColumnHeader:'ManagerId', ColumnName:'Manager', editable:true, editor:'select-remote', optionProviderKey:'Employee', optionParams:(row:any)=>({ filter:1, gender: row.Gender }), ColumnOrder:4 },
  { Id:5, ColumnHeader:'ReportingToId', ColumnName:'Reporting To', editable:true, editor:'select-remote', optionProviderKey:'Employee', optionParams:(row:any)=>({ filter:2, gender: row.Gender }), ColumnOrder:5 },
];

export const employeeRows = Array.from({ length: 24 }).map((_, i) => ({
  Id: i+1,
  EmployeeName: `Emp ${i+1}`,
  Gender: (i%3===0?'F':(i%3===1?'M':'O')),
  Active: i%2===0,
  ManagerId: '',
  ReportingToId: ''
}));
