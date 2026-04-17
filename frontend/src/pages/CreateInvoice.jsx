import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { addBill, getBills } from '../services/billingService';
import { getCustomers as getCustomersAPI } from '../services/customerService';
 import { getCustomers, syncInvoiceCounterFromCustomers } from '../utils/customerData';
import {
  OUR_DETAILS,
  addBill as addBillLocal,
  clearInvoiceDraft,
  getInvoiceDraft,
} from '../utils/billingData';
import './invoice.css';

const HOME_STATE = 'Tamil Nadu';
const today = () => new Date().toISOString().split('T')[0];
const emptyRow = () => ({ desc: '', qty: '', unitPrice: '', price: '' });
const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const normalizeState = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const getClientGstinValue = (client) => client?.gstIn || client?.gstin || client?.clientGstin || '';
const getClientStateValue = (client) => client?.state || client?.clientState || '';
const getClientInvoiceNumber = (client) => client?.invoiceNumber || '';
const getCustomerKey = (customer) =>
  String(customer?.invoiceNumber || customer?.customerId || customer?.clientName || '')
    .trim()
    .toLowerCase();

const mergeCustomers = (apiCustomers = [], localCustomers = []) => {
  const merged = [...apiCustomers];
  const existing = new Set(apiCustomers.map(getCustomerKey));

  localCustomers.forEach((customer) => {
    const key = getCustomerKey(customer);
    if (key && !existing.has(key)) {
      merged.push(customer);
      existing.add(key);
    }
  });

  return merged;
};

const createDraftCustomer = (draft) => {
  if (!draft?.clientName) {
    return null;
  }

  return {
    customerId: `draft-${draft.invoice || draft.clientName}`,
    clientName: draft.clientName,
    gstIn: draft.gstin,
    state: draft.state || '',
  };
};

export default function CreateInvoice({ billType = 'gst' }) {
  const isGstBill = billType === 'gst';
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  
  // Function to calculate outstanding from bills data
  const getOutstandingForCustomer = (clientName) => {
    if (!clientName || !bills.length) return 0;
    const normalized = clientName.trim().toLowerCase();
    const total = bills
      .filter((bill) => {
        const billClientMatch = (bill.clientName || '').trim().toLowerCase() === normalized;
        const isUnpaid = bill.status !== 'paid';
        return billClientMatch && isUnpaid;
      })
      .reduce((sum, bill) => sum + (parseFloat(bill.total) || 0), 0);
    return Math.round((total + Number.EPSILON) * 100) / 100;
  };
  
  // Fetch customers and bills from API on mount
  useEffect(() => {
    const fetchData = async () => {
      const localCustomers = getCustomers() || [];

      try {
        const [apiCustomers, apiBills] = await Promise.all([
          getCustomersAPI(),
          getBills()
        ]);
        const combinedCustomers = mergeCustomers(apiCustomers || [], localCustomers);
        syncInvoiceCounterFromCustomers(combinedCustomers);
        setCustomers(combinedCustomers);
        setBills(apiBills || []);
      } catch (error) {
        // Fallback to localStorage if API fails
        syncInvoiceCounterFromCustomers(localCustomers);
        setCustomers(localCustomers);
        setBills([]);
      }
    };
    
    fetchData();
  }, []);

  const routeInvoiceDraft = location.state?.invoiceDraft || null;
  const invoiceDraft = useMemo(() => routeInvoiceDraft || getInvoiceDraft(), [routeInvoiceDraft]);
  const customerOptions = useMemo(() => {
    if (!routeInvoiceDraft) {
      return customers;
    }

    const draftCustomer = createDraftCustomer(invoiceDraft);

    if (!draftCustomer) {
      return customers;
    }

    const hasExistingCustomer = customers.some((customer) => customer.clientName === draftCustomer.clientName);
    return hasExistingCustomer ? customers : [draftCustomer, ...customers];
  }, [customers, invoiceDraft, routeInvoiceDraft]);

  const [date, setDate] = useState(today());
  const [invoiceNo, setInvoiceNo] = useState('');
  const [gstin, setGstin] = useState(OUR_DETAILS.gstin || '');
  const [selectedCustomerKey, setSelectedCustomerKey] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [clientState, setClientState] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const selectedCustomer = useMemo(
    () => customerOptions.find((entry) => getCustomerKey(entry) === selectedCustomerKey) || null,
    [customerOptions, selectedCustomerKey]
  );
  const selectedClient = selectedCustomer?.clientName || '';

  useEffect(() => {
    if (!invoiceDraft) {
      return;
    }

    const matchingCustomer = customers.find((customer) => customer.clientName === invoiceDraft.clientName);
    const shouldApplyDraftCustomer = Boolean(routeInvoiceDraft || matchingCustomer);

    setDate(invoiceDraft.date || today());
    setInvoiceNo(invoiceDraft.invoice || '');
    setGstRate(String(invoiceDraft.gstRate ?? invoiceDraft.igstRate ?? 18));

    if (shouldApplyDraftCustomer) {
      const draftMatchedCustomer = customerOptions.find(
        (customer) =>
          customer.clientName === invoiceDraft.clientName
          && (!invoiceDraft.invoice || getClientInvoiceNumber(customer) === invoiceDraft.invoice)
      ) || customerOptions.find((customer) => customer.clientName === invoiceDraft.clientName);

      setSelectedCustomerKey(draftMatchedCustomer ? getCustomerKey(draftMatchedCustomer) : '');
      setClientGstin(invoiceDraft.gstin || '');
      setClientState(invoiceDraft.state || '');
      return;
    }

    setSelectedCustomerKey('');
    setClientGstin('');
    setClientState('');
  }, [customerOptions, customers, invoiceDraft, routeInvoiceDraft]);

  useEffect(() => {
    if (!selectedCustomer) {
      setClientGstin('');
      setClientState('');
      return;
    }

    const invoiceNum = getClientInvoiceNumber(selectedCustomer);
    setClientGstin(getClientGstinValue(selectedCustomer) || '');
    setClientState(getClientStateValue(selectedCustomer) || '');
    setInvoiceNo(invoiceNum || '');
  }, [selectedCustomer]);

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
  const taxBreakdown = useMemo(() => {
    const normalizedRate = isGstBill ? Math.max(0, Number(gstRate) || 0) : 0;
    const normalizedClientState = normalizeState(clientState);
    const isTamilNaduCustomer = normalizedClientState === normalizeState(HOME_STATE);

    if (!isGstBill || normalizedRate === 0) {
      return {
        gstRate: 0,
        isTamilNaduCustomer,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 0,
        igstAmount: 0,
        taxAmount: 0,
      };
    }

    if (isTamilNaduCustomer) {
      const localRate = roundCurrency(normalizedRate / 2);
      const cgstAmount = roundCurrency((subtotal * localRate) / 100);
      const sgstAmount = roundCurrency((subtotal * localRate) / 100);

      return {
        gstRate: normalizedRate,
        isTamilNaduCustomer,
        cgstRate: localRate,
        cgstAmount,
        sgstRate: localRate,
        sgstAmount,
        igstRate: 0,
        igstAmount: 0,
        taxAmount: roundCurrency(cgstAmount + sgstAmount),
      };
    }

    const igstAmount = roundCurrency((subtotal * normalizedRate) / 100);

    return {
      gstRate: normalizedRate,
      isTamilNaduCustomer,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: normalizedRate,
      igstAmount,
      taxAmount: igstAmount,
    };
  }, [billType, clientState, gstRate, isGstBill, subtotal]);
  const total = roundCurrency(subtotal + taxBreakdown.taxAmount);

  const previousOutstanding = useMemo(
    () => getOutstandingForCustomer(selectedClient),
    [selectedClient, bills]
  );
  const grandTotal = roundCurrency(total + previousOutstanding);

  const handleSave = async () => {
    if (!invoiceNo.trim()) {
      setError('Invoice number is required.');
      return;
    }

    if (!selectedClient.trim()) {
      setError('Please select a client.');
      return;
    }

    if (isGstBill && !clientState.trim()) {
      setError('Client state is required for GST calculation.');
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
      clientState: isGstBill ? clientState : '',
      rows,
      subtotal,
      gstRate: taxBreakdown.gstRate,
      cgstRate: taxBreakdown.cgstRate,
      cgstAmount: taxBreakdown.cgstAmount,
      sgstRate: taxBreakdown.sgstRate,
      sgstAmount: taxBreakdown.sgstAmount,
      igstRate: taxBreakdown.igstRate,
      igstAmount: taxBreakdown.igstAmount,
      taxAmount: taxBreakdown.taxAmount,
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
              value={selectedCustomerKey}
              onChange={(event) => setSelectedCustomerKey(event.target.value)}
            >
              <option value="">Select a Client</option>
              {customerOptions.map((customer) => (
                <option key={customer.customerId || getCustomerKey(customer)} value={getCustomerKey(customer)}>
                  {customer.clientName}
                </option>
              ))}
            </Form.Select>
          </div>

          {isGstBill && (
            <>
              <div className="box mt-2">
                <label>GSTIN/UIN:</label>
                <Form.Control
                  className="mt-2"
                  value={clientGstin}
                  onChange={(event) => setClientGstin(event.target.value)}
                />
              </div>
              <div className="box mt-2">
                <label>State:</label>
                <Form.Control
                  className="mt-2"
                  value={clientState}
                  onChange={(event) => setClientState(event.target.value)}
                  placeholder="Enter client state"
                />
              </div>
            </>
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
            {isGstBill && taxBreakdown.isTamilNaduCustomer && (
              <>
                <p>CGST ({taxBreakdown.cgstRate.toFixed(2)}%) : {taxBreakdown.cgstAmount.toFixed(2)} INR</p>
                <p>SGST ({taxBreakdown.sgstRate.toFixed(2)}%) : {taxBreakdown.sgstAmount.toFixed(2)} INR</p>
                <p className="tax-note">Applied for Tamil Nadu customer.</p>
              </>
            )}
            {isGstBill && !taxBreakdown.isTamilNaduCustomer && (
              <>
                <p>
                  IGST - {clientState || 'Other State'} ({taxBreakdown.igstRate.toFixed(2)}%) : {taxBreakdown.igstAmount.toFixed(2)} INR
                </p>
                {clientState && <p className="tax-note">Inter-state GST for {clientState}.</p>}
              </>
            )}
            {!isGstBill && <p>Tax : 0.00 INR</p>}
            <p>
              <strong>TOTAL : {total.toFixed(2)} INR</strong>
            </p>
            {previousOutstanding > 0 && (
              <>
                <p className="outstanding-line">Previous Outstanding : {previousOutstanding.toFixed(2)} INR</p>
                <p>
                  <strong>GRAND TOTAL : {grandTotal.toFixed(2)} INR</strong>
                </p>
              </>
            )}
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