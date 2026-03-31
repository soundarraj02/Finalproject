import {
  addAttendance as addAttendanceApi,
  deleteAttendance as deleteAttendanceApi,
  getAttendance,
} from '../services/attendanceService';

export const getAttendances = async () => {
  return getAttendance();
};

export const addAttendance = async (attendanceData) => {
  return addAttendanceApi(attendanceData);
};

export const deleteAttendance = async (attendanceId) => {
  return deleteAttendanceApi(attendanceId);
};

export const getAttendanceById = async (attendanceId) => {
  const attendances = await getAttendances();
  return attendances.find((item) => item.attendanceId === attendanceId);
};

export const WORK_STATUS_OPTIONS = ['Present', 'Absent', 'Half Day', 'Remote', 'On Duty'];
export const BOOLEAN_OPTIONS = ['Yes', 'No'];
