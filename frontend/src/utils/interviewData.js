export const INTERVIEW_FOLLOW_UP_OPTIONS = [
  'Interviewed',
  'Not interviewed',
  'Call back',
  'No response',
];

export const getInterviews = () => {
  const data = localStorage.getItem('interviewRecords');
  return data ? JSON.parse(data) : [];
};

export const saveInterviews = (records) => {
  localStorage.setItem('interviewRecords', JSON.stringify(records));
};

export const addInterview = (data) => {
  const records = getInterviews();
  const newRecord = {
    ...data,
    interviewId: getNextInterviewId(),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  saveInterviews(records);
  return newRecord;
};

export const deleteInterview = (interviewId) => {
  const records = getInterviews();
  saveInterviews(records.filter((r) => r.interviewId !== interviewId));
};

export const getNextInterviewId = () => {
  const lastId = localStorage.getItem('lastInterviewId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastInterviewId', nextId.toString());
  return `INT${String(nextId).padStart(5, '0')}`;
};
