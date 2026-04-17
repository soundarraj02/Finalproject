export const getCustomers = () => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
};

export const saveCustomers = (customers) => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const addCustomer = (customerData) => {
  const customers = getCustomers();
  const newCustomer = {
    ...customerData,
    createdAt: new Date().toISOString(),
  };
  customers.unshift(newCustomer);
  saveCustomers(customers);
  return newCustomer;
};

export const updateCustomer = (invoiceNumber, customerData) => {
  const customers = getCustomers();
  const updatedCustomers = customers.map((customer) => (
    customer.invoiceNumber === invoiceNumber
      ? { ...customer, ...customerData }
      : customer
  ));

  saveCustomers(updatedCustomers);
  return updatedCustomers.find((customer) => customer.invoiceNumber === (customerData.invoiceNumber || invoiceNumber));
};

export const deleteCustomer = (invoiceNumber) => {
  const customers = getCustomers();
  const filteredCustomers = customers.filter((customer) => customer.invoiceNumber !== invoiceNumber);
  saveCustomers(filteredCustomers);
};

export const getCustomerByInvoiceNumber = (invoiceNumber) => {
  const customers = getCustomers();
  return customers.find((customer) => customer.invoiceNumber === invoiceNumber);
};

export const getNextInvoiceNumber = () => {
  const lastId = localStorage.getItem('lastInvoiceNumber') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastInvoiceNumber', nextId.toString());
  const year = String(new Date().getFullYear()).slice(-2);
  return `KIT/${year}/${String(nextId).padStart(3, '0')}`;
};

export const getPreviewInvoiceNumber = () => {
  const lastId = localStorage.getItem('lastInvoiceNumber') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  const year = String(new Date().getFullYear()).slice(-2);
  return `KIT/${year}/${String(nextId).padStart(3, '0')}`;
};

  export const syncInvoiceCounterFromCustomers = (customers = []) => {
    let maxSequence = 0;
    customers.forEach((customer) => {
      const invoiceNum = customer.invoiceNumber || '';
      const sequence = extractInvoiceSequence(invoiceNum);
      if (Number.isInteger(sequence) && sequence > maxSequence) {
        maxSequence = sequence;
      }
    });
    localStorage.setItem('lastInvoiceNumber', maxSequence.toString());
    return maxSequence;
  };

  const extractInvoiceSequence = (invoiceNumber = '') => {
  const normalized = String(invoiceNumber).trim();
  const match = normalized.match(/(\d+)\s*$/);

  if (!match) {
    return null;
  }

  return parseInt(match[1], 10);
};

export const syncInvoiceCounter = (invoiceNumber) => {
  const sequence = extractInvoiceSequence(invoiceNumber);

  if (!Number.isInteger(sequence) || sequence < 0) {
    return false;
  }

  localStorage.setItem('lastInvoiceNumber', sequence.toString());
  return true;
};

export const resetInvoiceNumber = () => {
  localStorage.setItem('lastInvoiceNumber', '0');
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry'
];
