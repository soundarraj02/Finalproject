import {
  getStudents as getStudentsApi,
  getNextStudentId as getNextStudentIdApi,
  getStudentById as getStudentByIdApi,
  addStudent as addStudentApi,
  updateStudent as updateStudentApi,
  deleteStudent as deleteStudentApi,
} from '../services/studentService';

// Student data management utilities (API-backed)

export const getStudents = async () => {
  return getStudentsApi();
};

export const addStudent = async (studentData) => {
  return addStudentApi(studentData);
};

export const updateStudent = async (studentId, updatedData) => {
  return updateStudentApi(studentId, updatedData);
};

export const getStudentById = async (studentId) => {
  return getStudentByIdApi(studentId);
};

export const deleteStudent = async (studentId) => {
  return deleteStudentApi(studentId);
};

// Student ID management
export const getNextStudentId = async () => {
  try {
    return await getNextStudentIdApi();
  } catch {
    const lastId = localStorage.getItem('lastStudentId') || '0';
    const nextId = parseInt(lastId, 10) + 1;
    localStorage.setItem('lastStudentId', nextId.toString());
    return `STU${String(nextId).padStart(5, '0')}`;
  }
};

export const setStudentIdPrefix = (prefix) => {
  localStorage.setItem('studentIdPrefix', prefix || 'STU');
};

export const getStudentIdPrefix = () => {
  return localStorage.getItem('studentIdPrefix') || 'STU';
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

// Course options
export const COURSES = [
  'Web Development',
  'Mobile App Dev',
  'Data Science',
  'Cloud Computing',
  'AI & Machine Learning',
  'Full Stack Development',
  'Python Programming',
  'Java Programming',
];

// Mentor options
export const MENTORS = [
  'John Smith',
  'Sarah Johnson',
  'Mike Davis',
  'Emily Brown',
  'Robert Wilson',
  'Lisa Anderson',
];

// Student status options
export const STUDENT_STATUS = ['Ongoing', 'Completed', 'On Hold', 'Discontinued'];
