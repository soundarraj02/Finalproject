import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCustomers } from '../utils/customerData';
import {
  OUR_DETAILS,
  addBill as addBillLocal,
  amountToWords,
  clearInvoiceDraft,
  getInvoiceDraft,
} from '../utils/billingData';
import CreateInvoice from './CreateInvoice';

export default function BillingGST() {
  return <CreateInvoice billType="gst" />;
}
const emptyRow = () => ({ desc: '', qty: '', unitPrice: '', price: '' });
