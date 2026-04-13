import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Container, Form, InputGroup, Modal, Pagination, Table } from 'react-bootstrap';
import { deleteBill, getBills as getServerBills } from '../services/billingService';
import { updateCustomer as updateCustomerOnServer } from '../services/customerService';
import { clearInvoiceDraftIfMatches, deleteBillsByCustomer } from '../utils/billingData';
import { deleteCustomer, getCustomers, updateCustomer } from '../utils/customerData';

const createEditableCustomer = (customer) => ({
  clientName: customer?.clientName || '',
  invoiceNumber: customer?.invoiceNumber || '',
  contactNumber: customer?.contactNumber || '',
  date: customer?.date || '',
  state: customer?.state || '',
  gstIn: customer?.gstIn || '',
  address: customer?.address || '',
});

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editableCustomer, setEditableCustomer] = useState(createEditableCustomer(null));
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const loadCustomers = () => {
    setCustomers(getCustomers());
  };

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const normalizedSearch = searchTerm.toLowerCase();
    return customer.clientName.toLowerCase().includes(normalizedSearch)
      || customer.invoiceNumber.toLowerCase().includes(normalizedSearch)
      || customer.gstIn.toLowerCase().includes(normalizedSearch)
      || customer.contactNumber.toLowerCase().includes(normalizedSearch);
  }), [customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    setEditableCustomer(createEditableCustomer(customer));
    setIsEditingCustomer(false);
    setSaveError('');
  };

  const closeCustomerModal = () => {
    setSelectedCustomer(null);
    setEditableCustomer(createEditableCustomer(null));
    setIsEditingCustomer(false);
    setSaveError('');
  };

  const handleEditableCustomerChange = (field, value) => {
    setEditableCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) {
      return;
    }

    if (!editableCustomer.clientName.trim()) {
      setSaveError('Client name is required.');
      return;
    }

    if (!editableCustomer.contactNumber.trim()) {
      setSaveError('Contact number is required.');
      return;
    }

    const updatedCustomer = {
      ...selectedCustomer,
      ...editableCustomer,
    };

    updateCustomer(selectedCustomer.invoiceNumber, updatedCustomer);

    try {
      if (selectedCustomer.customerId) {
        await updateCustomerOnServer(selectedCustomer.customerId, {
          clientName: updatedCustomer.clientName,
          phone: updatedCustomer.contactNumber,
          address: updatedCustomer.address,
          state: updatedCustomer.state,
          invoiceNumber: updatedCustomer.invoiceNumber,
          gstin: updatedCustomer.gstIn,
        });
      }
    } catch {
      // Local update succeeded; keep the UI updated even if API sync fails.
    }

    setSelectedCustomer(updatedCustomer);
    setEditableCustomer(createEditableCustomer(updatedCustomer));
    setIsEditingCustomer(false);
    setSaveError('');
    loadCustomers();
  };

  const handleDelete = async (customer) => {
    deleteCustomer(customer.invoiceNumber);
    deleteBillsByCustomer({
      clientName: customer.clientName,
      invoiceNo: customer.invoiceNumber,
    });
    clearInvoiceDraftIfMatches({
      clientName: customer.clientName,
      invoiceNo: customer.invoiceNumber,
    });

    try {
      const serverBills = await getServerBills();
      const relatedBills = serverBills.filter((bill) => (
        bill.clientName === customer.clientName || bill.invoiceNo === customer.invoiceNumber
      ));

      await Promise.all(relatedBills.map((bill) => deleteBill(bill.billId)));
    } catch {
      // Local data was already updated; ignore API failures here.
    }

    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
    loadCustomers();
    if (paginatedCustomers.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button variant="primary" onClick={() => navigate('/customer/add-customer')}>
            Add Customer
          </Button>
          <h4 className="mb-0">Manage Customer</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/customer')}>
            Customer {'>'} Customer List
          </Button>
        </Card.Header>
        <Card.Body>
          {customers.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Customers Found</h5>
              <p className="text-muted mb-3">Register customers to manage them here.</p>
              <Button variant="primary" onClick={() => navigate('/customer/add-customer')}>Add Customer</Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <InputGroup style={{ maxWidth: 420 }}>
                  <InputGroup.Text>Search</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Client, invoice number, GST IN, or contact"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </InputGroup>
                <Badge bg="secondary">{paginatedCustomers.length} of {filteredCustomers.length}</Badge>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Invoice No</th>
                    <th>Contact</th>
                    <th>State</th>
                    <th>GST IN</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.invoiceNumber}>
                      <td>{customer.clientName}</td>
                      <td>{customer.invoiceNumber}</td>
                      <td>{customer.contactNumber}</td>
                      <td>{customer.state}</td>
                      <td>{customer.gstIn}</td>
                      <td>{customer.date}</td>
                      <td className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => openCustomerModal(customer)}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            openCustomerModal(customer);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Item active>{currentPage}</Pagination.Item>
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(selectedCustomer && !showDeleteConfirm)} onHide={closeCustomerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && <div className="text-danger mb-3">{saveError}</div>}
          {selectedCustomer && (
            isEditingCustomer ? (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Client Name</Form.Label>
                  <Form.Control
                    value={editableCustomer.clientName}
                    onChange={(event) => handleEditableCustomerChange('clientName', event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control value={editableCustomer.invoiceNumber} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    value={editableCustomer.contactNumber}
                    onChange={(event) => handleEditableCustomerChange('contactNumber', event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editableCustomer.date}
                    onChange={(event) => handleEditableCustomerChange('date', event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    value={editableCustomer.state}
                    onChange={(event) => handleEditableCustomerChange('state', event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>GST IN</Form.Label>
                  <Form.Control
                    value={editableCustomer.gstIn}
                    onChange={(event) => handleEditableCustomerChange('gstIn', event.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editableCustomer.address}
                    onChange={(event) => handleEditableCustomerChange('address', event.target.value)}
                  />
                </Form.Group>
              </Form>
            ) : (
              <Table bordered size="sm">
                <tbody>
                  <tr><th>Client Name</th><td>{selectedCustomer.clientName}</td></tr>
                  <tr><th>Invoice Number</th><td>{selectedCustomer.invoiceNumber}</td></tr>
                  <tr><th>Contact</th><td>{selectedCustomer.contactNumber}</td></tr>
                  <tr><th>Date</th><td>{selectedCustomer.date}</td></tr>
                  <tr><th>State</th><td>{selectedCustomer.state}</td></tr>
                  <tr><th>GST IN</th><td>{selectedCustomer.gstIn}</td></tr>
                  <tr><th>Address</th><td>{selectedCustomer.address}</td></tr>
                </tbody>
              </Table>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditingCustomer ? (
            <>
              <Button variant="secondary" onClick={() => {
                setEditableCustomer(createEditableCustomer(selectedCustomer));
                setIsEditingCustomer(false);
                setSaveError('');
              }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateCustomer}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline-primary" onClick={() => setIsEditingCustomer(true)}>
              Edit Customer
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(showDeleteConfirm && selectedCustomer)} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Customer?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedCustomer?.clientName}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(selectedCustomer)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerList;
