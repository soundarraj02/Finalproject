import { useState } from 'react';

export default function CreateInvoiceSimple() {
  const [state, setState] = useState('Tamil Nadu');
  const [useBalance, setUseBalance] = useState(false);
  const [excessBalance] = useState(500);
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);

  const addRow = () => {
    setItems((prev) => [...prev, { desc: '', qty: 1, price: 0 }]);
  };

  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'desc' ? value : Number(value),
      };
      return updated;
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (state === 'Tamil Nadu') {
    cgst = subtotal * 0.09;
    sgst = subtotal * 0.09;
  } else {
    igst = subtotal * 0.18;
  }

  const total = subtotal + cgst + sgst + igst;
  const finalTotal = useBalance ? Math.max(total - excessBalance, 0) : total;
  const balanceUsed = Math.min(excessBalance, total);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Invoice</h3>

      <select
        value={state}
        onChange={(event) => setState(event.target.value)}
      >
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Kerala">Kerala</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
      </select>

      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            placeholder="Desc"
            value={item.desc}
            onChange={(event) => handleChange(index, 'desc', event.target.value)}
          />

          <input
            type="number"
            value={item.qty}
            onChange={(event) => handleChange(index, 'qty', event.target.value)}
          />

          <input
            type="number"
            value={item.price}
            onChange={(event) => handleChange(index, 'price', event.target.value)}
          />

          <span>INR {(item.qty * item.price).toFixed(2)}</span>
        </div>
      ))}

      <button type="button" onClick={addRow}>
        + Add Item
      </button>

      <hr />

      <h5>Subtotal: INR {subtotal.toFixed(2)}</h5>

      {state === 'Tamil Nadu' ? (
        <>
          <h5>CGST (9%): INR {cgst.toFixed(2)}</h5>
          <h5>SGST (9%): INR {sgst.toFixed(2)}</h5>
        </>
      ) : (
        <h5>IGST (18%): INR {igst.toFixed(2)}</h5>
      )}

      <h5>Total: INR {total.toFixed(2)}</h5>

      <hr />

      <h5>Excess Balance: INR {excessBalance.toFixed(2)}</h5>

      <label>
        <input
          type="checkbox"
          checked={useBalance}
          onChange={() => setUseBalance((prev) => !prev)}
        />
        {' '}
        Use Excess Balance
      </label>

      {useBalance && (
        <h5>Balance Used: INR {balanceUsed.toFixed(2)}</h5>
      )}

      <h3>Final Total: INR {finalTotal.toFixed(2)}</h3>
    </div>
  );
}
