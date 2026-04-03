import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Container, Form, InputGroup, Modal, Pagination, Table } from 'react-bootstrap';
import { deleteVendor, getVendors } from '../utils/vendorData';

const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setVendors(getVendors());
  }, []);

  const loadVendors = () => {
    setVendors(getVendors());
  };

  const filteredVendors = useMemo(() => vendors.filter((vendor) => {
    const normalizedSearch = searchTerm.toLowerCase();
    return vendor.vendorName.toLowerCase().includes(normalizedSearch)
      || vendor.vendorType.toLowerCase().includes(normalizedSearch)
      || vendor.mobileNumber.toLowerCase().includes(normalizedSearch)
      || vendor.emailId.toLowerCase().includes(normalizedSearch)
      || vendor.vendorId.toLowerCase().includes(normalizedSearch);
  }), [vendors, searchTerm]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (vendorId) => {
    deleteVendor(vendorId);
    setShowDeleteConfirm(false);
    setSelectedVendor(null);
    loadVendors();
    if (paginatedVendors.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button variant="primary" onClick={() => navigate('/vendor/add-vendor')}>Create</Button>
          <h4 className="mb-0">Manage Vendor</h4>
          <Button variant="outline-secondary" onClick={() => navigate('/vendor')}>Vendors {'>'} Manage Vendor</Button>
        </Card.Header>
        <Card.Body>
          {vendors.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Vendors Found</h5>
              <p className="text-muted mb-3">Add vendor records to manage them here.</p>
              <Button variant="primary" onClick={() => navigate('/vendor/add-vendor')}>Add Vendor</Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <InputGroup style={{ maxWidth: 420 }}>
                  <InputGroup.Text>Search</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Vendor, type, mobile, email, or ID"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </InputGroup>
                <Badge bg="secondary">{paginatedVendors.length} of {filteredVendors.length}</Badge>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Remaining Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVendors.map((vendor) => (
                    <tr key={vendor.vendorId}>
                      <td>{vendor.vendorName}</td>
                      <td>{vendor.vendorId}</td>
                      <td>{vendor.vendorType}</td>
                      <td>{vendor.mobileNumber}</td>
                      <td>{vendor.emailId}</td>
                      <td>Rs. {Number(vendor.remainingAmount).toLocaleString()}</td>
                      <td className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => setSelectedVendor(vendor)}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => {
                            setSelectedVendor(vendor);
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
                  <Pagination.Prev onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1} />
                  <Pagination.Item active>{currentPage}</Pagination.Item>
                  <Pagination.Next onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages} />
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(selectedVendor && !showDeleteConfirm)} onHide={() => setSelectedVendor(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Vendor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <Table bordered size="sm">
              <tbody>
                <tr><th>Vendor Name</th><td>{selectedVendor.vendorName}</td></tr>
                <tr><th>Vendor Type</th><td>{selectedVendor.vendorType}</td></tr>
                <tr><th>Mobile</th><td>{selectedVendor.mobileNumber}</td></tr>
                <tr><th>Email</th><td>{selectedVendor.emailId}</td></tr>
                <tr><th>Address</th><td>{selectedVendor.address}</td></tr>
                <tr><th>Current Balance</th><td>Rs. {Number(selectedVendor.currentBalance).toLocaleString()}</td></tr>
                <tr><th>Paid Amount</th><td>Rs. {Number(selectedVendor.paidAmount).toLocaleString()}</td></tr>
                <tr><th>Remaining Amount</th><td>Rs. {Number(selectedVendor.remainingAmount).toLocaleString()}</td></tr>
                <tr><th>Comments</th><td>{selectedVendor.comments || '-'}</td></tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={Boolean(showDeleteConfirm && selectedVendor)} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Vendor?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedVendor?.vendorName}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(selectedVendor.vendorId)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendorList;
