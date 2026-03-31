export const getVendors = () => {
  const vendors = localStorage.getItem('vendors');
  return vendors ? JSON.parse(vendors) : [];
};

export const saveVendors = (vendors) => {
  localStorage.setItem('vendors', JSON.stringify(vendors));
};

export const addVendor = (vendorData) => {
  const vendors = getVendors();
  const newVendor = {
    ...vendorData,
    vendorId: getNextVendorId(),
    createdAt: new Date().toISOString(),
  };
  vendors.unshift(newVendor);
  saveVendors(vendors);
  return newVendor;
};

export const deleteVendor = (vendorId) => {
  const vendors = getVendors();
  const filteredVendors = vendors.filter((vendor) => vendor.vendorId !== vendorId);
  saveVendors(filteredVendors);
};

export const getNextVendorId = () => {
  const lastId = localStorage.getItem('lastVendorId') || '0';
  const nextId = parseInt(lastId, 10) + 1;
  localStorage.setItem('lastVendorId', nextId.toString());
  return `VEN${String(nextId).padStart(5, '0')}`;
};

export const VENDOR_TYPES = ['Painter', 'Supplier', 'Contractor', 'Wholesale', 'Retail', 'Other'];
