import { useState, useEffect } from 'react';
import api from '../services/api';

const PointOfSale = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const res = await api.get('/medicines');
    setMedicines(res.data);
  };

  const addToCart = (medicine) => {
    const existing = cart.find(item => item.medicineId === medicine.id);
    if (existing) {
      if (existing.quantity >= medicine.stockQuantity) {
        alert("Not enough stock!");
        return;
      }
      setCart(cart.map(item => item.medicineId === medicine.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (medicine.stockQuantity < 1) {
        alert("Out of stock!");
        return;
      }
      setCart([...cart, { medicineId: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };

  const decrementQuantity = (medicineId) => {
    const existing = cart.find(item => item.medicineId === medicineId);
    if (existing.quantity === 1) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map(item => item.medicineId === medicineId ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const checkout = async () => {
    setError('');
    if (cart.length === 0) {
      setError("Please add at least one medicine to the cart to print a bill.");
      return;
    }
    if (!customerName.trim()) {
      setError("Please enter the customer's name.");
      return;
    }
    try {
      const payload = {
        customerName,
        items: cart.map(item => ({ medicineId: item.medicineId, quantity: item.quantity }))
      };
      
      const response = await api.post('/sales', payload, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setCart([]);
      setCustomerName('');
      fetchMedicines(); // refresh stock
    } catch (error) {
      alert("Error during checkout");
    }
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Available Medicines</h2>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>${m.price}</td>
                <td><span style={{color: m.stockQuantity < 10 ? 'var(--danger)' : 'inherit'}}>{m.stockQuantity}</span></td>
                <td><button className="btn-secondary" onClick={() => addToCart(m)} disabled={m.stockQuantity < 1}>Add</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Current Cart</h2>
        <input 
          type="text" 
          placeholder="Customer Name" 
          className="form-control" 
          value={customerName} 
          onChange={e => setCustomerName(e.target.value)} 
          style={{ marginBottom: '1rem' }}
        />
        
        {cart.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ flex: 1 }}>
              <p>{item.name}</p>
              <small>${item.price} each</small>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }} onClick={() => decrementQuantity(item.medicineId)}>-</button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }} onClick={() => {
                  const med = medicines.find(m => m.id === item.medicineId);
                  addToCart(med);
                }}>+</button>
              </div>
              <strong style={{ minWidth: '60px', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</strong>
              <button className="btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => removeFromCart(item.medicineId)}>X</button>
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
          {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}
          <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={checkout}>
            Checkout & Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointOfSale;
