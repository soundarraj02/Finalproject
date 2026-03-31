export const OUR_DETAILS = {
  name: 'Our Company Name',
  address: '123, Business Street, City, State - 600001',
  phone: '+91 98765 43210',
  gstin: '22AAAAA0000A1Z5',
  bank: {
    name: 'Account Holder Name',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    branch: 'Main Branch, City',
  },
};

export const getBills = () => {
  const data = localStorage.getItem('billingRecords');
  return data ? JSON.parse(data) : [];
};

export const saveBills = (bills) => {
  localStorage.setItem('billingRecords', JSON.stringify(bills));
};

export const addBill = (billData) => {
  const bills = getBills();
  const newBill = { ...billData, billId: getNextBillId(), createdAt: new Date().toISOString() };
  bills.unshift(newBill);
  saveBills(bills);
  return newBill;
};

export const getNextBillId = () => {
  const lastId = localStorage.getItem('lastBillId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastBillId', nextId.toString());
  return `BIL${String(nextId).padStart(5, '0')}`;
};

// Convert amount to words (Indian number system)
export const amountToWords = (amount) => {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero Rupees Only';

  const numToWords = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '') + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + numToWords(n % 100);
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + 'Thousand ' + numToWords(n % 1000);
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + 'Lakh ' + numToWords(n % 100000);
    return numToWords(Math.floor(n / 10000000)) + 'Crore ' + numToWords(n % 10000000);
  };

  const intPart = Math.floor(amount);
  const decPart = Math.round((amount - intPart) * 100);
  let words = numToWords(intPart).trim() + ' Rupees';
  if (decPart > 0) words += ' and ' + numToWords(decPart).trim() + ' Paise';
  return words + ' Only';
};
