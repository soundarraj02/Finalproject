import {
  getEmployees as getEmployeesApi,
  getEmployeeById as getEmployeeByIdApi,
  addEmployee as addEmployeeApi,
  updateEmployee as updateEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
} from '../services/employeeService';

// Employee data management utilities (API-backed)

export const getEmployees = async () => getEmployeesApi();

export const addEmployee = async (employeeData) => addEmployeeApi(employeeData);

export const updateEmployee = async (employeeId, updatedData) =>
  updateEmployeeApi(employeeId, updatedData);

export const getEmployeeById = async (employeeId) => getEmployeeByIdApi(employeeId);

export const deleteEmployee = async (employeeId) => deleteEmployeeApi(employeeId);

// Employee ID management
export const getNextEmployeeId = () => {
  const lastId = localStorage.getItem('lastEmployeeId') || '0';
  const nextId = parseInt(lastId) + 1;
  localStorage.setItem('lastEmployeeId', nextId.toString());
  return `EMP${String(nextId).padStart(5, '0')}`;
};

export const setEmployeeIdPrefix = (prefix) => {
  localStorage.setItem('employeeIdPrefix', prefix || 'EMP');
};

export const getEmployeeIdPrefix = () => {
  return localStorage.getItem('employeeIdPrefix') || 'EMP';
};

// Qualification options
export const QUALIFICATIONS = [
  'High School',
  'Diploma',
  'Bachelor Degree',
  'Master Degree',
  'PhD',
  'Certificate',
  'Other',
];

// Designation options
export const DESIGNATIONS = [
  'Manager',
  'Senior Developer',
  'Developer',
  'Junior Developer',
  'Team Lead',
  'Project Manager',
  'HR Executive',
  'Accountant',
  'Admin',
  'Support Executive',
];

// Employee Type options
export const EMPLOYEE_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Intern',
];

// Employee status options
export const EMPLOYEE_STATUS = ['Active', 'Inactive', 'On Leave', 'Resigned'];
