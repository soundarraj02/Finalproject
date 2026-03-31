export const PAYMENT_TYPES = ['Cash', 'Bank', 'Online pay'];

export const getCashInRecords = () => {
  const records = localStorage.getItem('cashInRecords');
  return records ? JSON.parse(records) : [];
};

export const saveCashInRecords = (records) => {
  localStorage.setItem('cashInRecords', JSON.stringify(records));
};

export const addCashInRecord = (recordData) => {
  const records = getCashInRecords();
  const newRecord = {
    ...recordData,
    cashInId: getNextCashInId(),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  saveCashInRecords(records);
  return newRecord;
};

export const deleteCashInRecord = (cashInId) => {
  const records = getCashInRecords();
  const filtered = records.filter((record) => record.cashInId !== cashInId);
  saveCashInRecords(filtered);
};

export const getNextCashInId = () => {
  const lastId = localStorage.getItem('lastCashInId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastCashInId', nextId.toString());
  return `CSI${String(nextId).padStart(5, '0')}`;
};
