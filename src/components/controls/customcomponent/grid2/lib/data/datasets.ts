import { createDataset } from './masterCache';
import { api } from '../http/api';

export type Employee = {
  id: string;
  name: string;
  gender: 'M' | 'F' | 'O';
  manager?: boolean;
  reportingEligible?: boolean;
};

export type Department = {
  id: string;
  name: string;
};

export const employeesDataset = createDataset<Employee>({
  id: 'employees',
  loader: async () => {
    const all = await api.get<Employee[]>('/employee/all', { cache: { ttlMs: 10 * 60_000 } });
    return all;
  },
  ttlMs: 10 * 60_000
});

export const departmentsDataset = createDataset<Department>({
  id: 'departments',
  loader: async () => {
    const all = await api.get<Department[]>('/department/all', { cache: { ttlMs: 60 * 60_000 } });
    return all;
  },
  ttlMs: 60 * 60_000
});
