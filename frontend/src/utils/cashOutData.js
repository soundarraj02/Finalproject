export const PAYMENT_TYPES = ['Cash', 'Bank', 'Online pay'];

export const getCashOutRecords = () => {
  const records = localStorage.getItem('cashOutRecords');
  return records ? JSON.parse(records) : [];
};

export const saveCashOutRecords = (records) => {
  localStorage.setItem('cashOutRecords', JSON.stringify(records));
};

export const addCashOutRecord = (recordData) => {
  const records = getCashOutRecords();
  const newRecord = {
    ...recordData,
    cashOutId: getNextCashOutId(),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  saveCashOutRecords(records);
  return newRecord;
};

export const deleteCashOutRecord = (cashOutId) => {
  const records = getCashOutRecords();
  const filtered = records.filter((record) => record.cashOutId !== cashOutId);
  saveCashOutRecords(filtered);
};

export const getNextCashOutId = () => {
  const lastId = localStorage.getItem('lastCashOutId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastCashOutId', nextId.toString());
  return `CSO${String(nextId).padStart(5, '0')}`;
};
