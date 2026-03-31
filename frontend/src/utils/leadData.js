import { COURSES, getStudents } from './studentData';
import { getEmployees } from './employeeData';

export const FOLLOW_UP_OPTIONS = ['Interest', 'Not interest', 'Call back', 'No response', 'Call done'];
export const DETAILS_SENT_OPTIONS = ['Yes', 'No'];
export const LEAD_SOURCE_OPTIONS = ['Facebook', 'Instagram', 'Referral', 'Ads'];

export const getLeads = () => {
  const leads = localStorage.getItem('leads');
  return leads ? JSON.parse(leads) : [];
};

export const saveLeads = (leads) => {
  localStorage.setItem('leads', JSON.stringify(leads));
};

export const addLead = (leadData) => {
  const leads = getLeads();
  const newLead = {
    ...leadData,
    leadId: getNextLeadId(),
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
};

export const addBulkLeads = (newLeads) => {
  const leads = getLeads();
  const records = newLeads.map((lead) => ({
    ...lead,
    leadId: getNextLeadId(),
    createdAt: new Date().toISOString(),
  }));
  const merged = [...records, ...leads];
  saveLeads(merged);
  return records.length;
};

export const updateLead = (leadId, updatedData) => {
  const leads = getLeads();
  const index = leads.findIndex((lead) => lead.leadId === leadId);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updatedData, updatedAt: new Date().toISOString() };
    saveLeads(leads);
    return leads[index];
  }
  return null;
};

export const rescheduleLead = (leadId, rescheduledToDate, rescheduleReason) => {
  return updateLead(leadId, {
    isRescheduled: true,
    rescheduledToDate,
    rescheduleReason,
  });
};

export const getRescheduledLeads = () => {
  return getLeads().filter((lead) => lead.isRescheduled);
};

export const deleteLead = (leadId) => {
  const leads = getLeads();
  const filteredLeads = leads.filter((lead) => lead.leadId !== leadId);
  saveLeads(filteredLeads);
};

export const getNextLeadId = () => {
  const lastId = localStorage.getItem('lastLeadId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastLeadId', nextId.toString());
  return `LEA${String(nextId).padStart(5, '0')}`;
};

export const getAssignableNames = () => {
  const employees = getEmployees();
  if (!Array.isArray(employees)) {
    return ['Counsellor 1', 'Counsellor 2', 'Counsellor 3'];
  }
  const employeeNames = employees
    .map((employee) => `${employee.firstName || ''} ${employee.lastName || ''}`.trim())
    .filter(Boolean);

  if (employeeNames.length > 0) {
    return [...new Set(employeeNames)].sort();
  }

  return ['Counsellor 1', 'Counsellor 2', 'Counsellor 3'];
};

export const getAvailableLeadCourses = () => {
  const students = getStudents();
  if (!Array.isArray(students)) {
    return [...COURSES].sort();
  }
  const studentCourses = students.map((student) => student.course).filter(Boolean);
  return [...new Set([...COURSES, ...studentCourses])].sort();
};

export const getAssignableNamesAsync = async () => {
  const employees = await getEmployees();
  const employeeNames = (Array.isArray(employees) ? employees : [])
    .map((employee) => `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.name || '')
    .filter(Boolean);

  if (employeeNames.length > 0) {
    return [...new Set(employeeNames)].sort();
  }

  return ['Counsellor 1', 'Counsellor 2', 'Counsellor 3'];
};

export const getAvailableLeadCoursesAsync = async () => {
  const students = await getStudents();
  const studentCourses = (Array.isArray(students) ? students : []).map((student) => student.course).filter(Boolean);
  return [...new Set([...COURSES, ...studentCourses])].sort();
};
