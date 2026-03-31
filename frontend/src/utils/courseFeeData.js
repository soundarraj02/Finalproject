export const DEFAULT_COURSES = [
  'Web Development',
  'Mobile App Dev',
  'Data Science',
  'Cloud Computing',
  'AI & Machine Learning',
  'Full Stack Development',
  'Python Programming',
  'Java Programming',
];

export const getCourseFeePlans = () => {
  const plans = localStorage.getItem('courseFeePlans');
  return plans ? JSON.parse(plans) : [];
};

export const saveCourseFeePlans = (plans) => {
  localStorage.setItem('courseFeePlans', JSON.stringify(plans));
};

export const addCourseFeePlan = (planData) => {
  const plans = getCourseFeePlans();
  const newPlan = {
    ...planData,
    courseFeeId: getNextCourseFeeId(),
    createdAt: new Date().toISOString(),
  };
  plans.unshift(newPlan);
  saveCourseFeePlans(plans);
  return newPlan;
};

export const updateCourseFeePlan = (courseFeeId, updatedData) => {
  const plans = getCourseFeePlans();
  const index = plans.findIndex((plan) => plan.courseFeeId === courseFeeId);
  if (index !== -1) {
    plans[index] = { ...plans[index], ...updatedData, updatedAt: new Date().toISOString() };
    saveCourseFeePlans(plans);
    return plans[index];
  }
  return null;
};

export const deleteCourseFeePlan = (courseFeeId) => {
  const plans = getCourseFeePlans();
  saveCourseFeePlans(plans.filter((plan) => plan.courseFeeId !== courseFeeId));
};

export const getCourseFeePlanById = (courseFeeId) => {
  return getCourseFeePlans().find((plan) => plan.courseFeeId === courseFeeId);
};

export const getAvailableCourses = () => {
  const plannedCourses = getCourseFeePlans().map((plan) => plan.course).filter(Boolean);
  return [...new Set([...DEFAULT_COURSES, ...plannedCourses])].sort();
};

export const getNextCourseFeeId = () => {
  const lastId = localStorage.getItem('lastCourseFeeId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastCourseFeeId', nextId.toString());
  return `CRS${String(nextId).padStart(5, '0')}`;
};
