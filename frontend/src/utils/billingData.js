export const OUR_DETAILS = {
  name: 'KITKAT SOFTWARE TECHNOLOGIES',
  address: 'No: 707/1, 1st Floor, Krishna Complex, P.N. Palayam, Coimbatore - 641037',
  phone: '7018016299, 0422-4957272',
  gstin: '33AAPFK3628R1ZD',
  bank: {
    name: 'Kitkat Software Technologies',
    bankName: 'Federal Bank',
    accountNumber: '19829000003987',
    ifscCode: 'FDRL0001962',
    branch: 'Pappanaickenpalayam',
  },
};

const INVOICE_DRAFT_KEY = 'billingInvoiceDraft';

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

export const getInvoiceDraft = () => {
  const draft = localStorage.getItem(INVOICE_DRAFT_KEY);
  return draft ? JSON.parse(draft) : null;
};

export const saveInvoiceDraft = (draft) => {
  localStorage.setItem(INVOICE_DRAFT_KEY, JSON.stringify(draft));
};

export const clearInvoiceDraft = () => {
  localStorage.removeItem(INVOICE_DRAFT_KEY);
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
