import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { addBill } from '../services/billingService';
import { getCustomers } from '../utils/customerData';
import {
  OUR_DETAILS,
  addBill as addBillLocal,
  clearInvoiceDraft,
  getInvoiceDraft,
} from '../utils/billingData';
import './invoice.css';

const today = () => new Date().toISOString().split('T')[0];
const emptyRow = () => ({ desc: '', qty: '', unitPrice: '', price: '' });

const getClientGstinValue = (client) => client?.gstIn || client?.gstin || client?.clientGstin || '';

const createDraftCustomer = (draft) => {
  if (!draft?.clientName) {
    return null;
  }

  return {
    customerId: `draft-${draft.invoice || draft.clientName}`,
    clientName: draft.clientName,
    gstIn: draft.gstin,
  };
};

export default function CreateInvoice({ billType = 'gst' }) {
  const isGstBill = billType === 'gst';
  const location = useLocation();
  const customers = useMemo(() => getCustomers(), []);
  const invoiceDraft = useMemo(() => location.state?.invoiceDraft || getInvoiceDraft(), [location.state]);
  const customerOptions = useMemo(() => {
    const draftCustomer = createDraftCustomer(invoiceDraft);

    if (!draftCustomer) {
      return customers;
    }

    const hasExistingCustomer = customers.some((customer) => customer.clientName === draftCustomer.clientName);
    return hasExistingCustomer ? customers : [draftCustomer, ...customers];
  }, [customers, invoiceDraft]);

  const [date, setDate] = useState(today());
  const [invoiceNo, setInvoiceNo] = useState('');
  const [gstin, setGstin] = useState(OUR_DETAILS.gstin || '');
  const [selectedClient, setSelectedClient] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!invoiceDraft) {
      return;
    }

    setDate(invoiceDraft.date || today());
    setInvoiceNo(invoiceDraft.invoice || '');
    setSelectedClient(invoiceDraft.clientName || '');
    setClientGstin(invoiceDraft.gstin || '');
  }, [invoiceDraft]);

  useEffect(() => {
    const client = customerOptions.find((entry) => entry.clientName === selectedClient);
    if (client) {
      setClientGstin(getClientGstinValue(client));
    }
  }, [customerOptions, selectedClient]);

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      const qty = parseFloat(updated[index].qty) || 0;
      const unitPrice = parseFloat(updated[index].unitPrice) || 0;
      updated[index].price = (qty * unitPrice).toFixed(2);

      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.price) || 0), 0);
  const igstAmount = 0;
  const total = subtotal + igstAmount;

  const handleSave = async () => {
    if (!invoiceNo.trim()) {
      setError('Invoice number is required.');
      return;
    }

    if (!selectedClient.trim()) {
      setError('Please select a client.');
      return;
    }

    const hasLineItem = rows.some((row) => row.desc.trim() && (parseFloat(row.qty) || 0) > 0);
    if (!hasLineItem) {
      setError('Add at least one valid bill item.');
      return;
    }

    const billData = {
      type: billType,
      date,
      invoiceNo,
      gstin: isGstBill ? gstin : '',
      clientName: selectedClient,
      clientGstin: isGstBill ? clientGstin : '',
      rows,
      subtotal,
      igstRate: 0,
      igstAmount,
      total,
    };

    try {
      await addBill(billData);
      addBillLocal(billData);
      setSaved(true);
      setError('');
      clearInvoiceDraft();
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      addBillLocal(billData);
      setSaved(true);
      setError(`Could not save to server; data stored locally (${saveError.message}).`);
      clearInvoiceDraft();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handlePrint = () => window.print();

  return (
    <Container fluid className="invoice-page">
      {saved && <div className="invoice-alert success no-print">Bill saved successfully.</div>}
      {error && <div className="invoice-alert error no-print">{error}</div>}

      <Row className="mb-3">
        <Col>
          <h4 className="title">INVOICE</h4>

          <h6>{OUR_DETAILS.name}</h6>
          <p className="small-text">
            No: 70/7, 1st Floor, Krishna complex, PN Palayam <br />
            Coimbatore-641037 <br />
            Phone No: 7010816299, 04224957272
          </p>
        </Col>

        <Col className="text-end">
          <h5 className="logo-text">KITKAT</h5>

          <div className="invoice-meta">
            <p>
              DATE :
              <Form.Control type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </p>
            <p>
              INVOICE NO :
              <Form.Control value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)} />
            </p>
            {isGstBill && (
              <p>
                GSTIN :
                <Form.Control value={gstin} onChange={(event) => setGstin(event.target.value)} />
              </p>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="box">
            <label>INVOICE TO:</label>
            <Form.Select
              className="mt-2"
              value={selectedClient}
              onChange={(event) => setSelectedClient(event.target.value)}
            >
              <option value="">Select a Client</option>
              {customerOptions.map((customer) => (
                <option key={customer.customerId} value={customer.clientName}>
                  {customer.clientName}
                </option>
              ))}
            </Form.Select>
          </div>

          {isGstBill && (
            <div className="box mt-2">
              <label>GSTIN/UIN:</label>
              <Form.Control
                className="mt-2"
                value={clientGstin}
                onChange={(event) => setClientGstin(event.target.value)}
              />
            </div>
          )}
        </Col>
      </Row>

      <Table bordered className="invoice-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>DESCRIPTION</th>
            <th>QTY</th>
            <th>UNIT PRICE (INR)</th>
            <th>PRICE (INR)</th>
            <th className="no-print">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Form.Control value={row.desc} onChange={(event) => handleRowChange(index, 'desc', event.target.value)} />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.qty}
                  onChange={(event) => handleRowChange(index, 'qty', event.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.unitPrice}
                  onChange={(event) => handleRowChange(index, 'unitPrice', event.target.value)}
                />
              </td>
              <td>{(parseFloat(row.price) || 0).toFixed(2)}</td>
              <td className="action-cell no-print">
                <button type="button" className="action-plus" onClick={addRow}>
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="justify-content-end">
        <Col md={3}>
          <div className="total-box">
            <p>Sub Total : {subtotal.toFixed(2)} INR</p>
            <p>IGST : {igstAmount.toFixed(2)} INR</p>
            <p>
              <strong>TOTAL : {total.toFixed(2)} INR</strong>
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h6>Bank Account Details</h6>

          <p className="small-text">
            Name : Kitkat Software Technologies <br />
            Bank : Federal Bank <br />
            Account No : 1982900003697 <br />
            IFSC Code : FDRL0001982 <br />
            Branch : Papanaickenpalayam
          </p>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <p className="thank-text">THANK YOU FOR YOU BUSINESS!</p>
        </Col>
      </Row>

      <div className="text-end mt-3 no-print">
        <Button variant="success" className="me-2" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </Container>
  );
}