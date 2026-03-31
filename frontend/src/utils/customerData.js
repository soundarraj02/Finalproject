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
  return `INV${String(nextId).padStart(5, '0')}`;
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
