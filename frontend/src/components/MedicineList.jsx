import { useState, useEffect } from 'react';
import api from '../services/api';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [expiry, setExpiry] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const medRes = await api.get('/medicines');
    setMedicines(medRes.data);
    const supRes = await api.get('/suppliers');
    setSuppliers(supRes.data);
  };

  const addMedicine = async (e) => {
    e.preventDefault();
    await api.post('/medicines', {
      name, price: Number(price), stockQuantity: Number(stock), expiryDate: expiry, supplier: { id: supplierId }
    });
    setName(''); setPrice(''); setStock(''); setExpiry(''); setSupplierId('');
    fetchData();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Medicines</h2>
      
      <form onSubmit={addMedicine} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <input type="text" placeholder="Name" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Price" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock Quantity" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
        <input type="date" className="form-control" value={expiry} onChange={e => setExpiry(e.target.value)} required />
        <select className="form-control" value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
          <option value="">Select Supplier</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit" className="btn-primary">Add Medicine</button>
      </form>

      <table className="glass-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Expiry</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>${m.price}</td>
              <td>
                <span style={{ color: m.stockQuantity < 10 ? 'var(--danger)' : 'inherit', fontWeight: m.stockQuantity < 10 ? 'bold' : 'normal' }}>
                  {m.stockQuantity}
                </span>
                {m.stockQuantity < 10 && <span style={{marginLeft: '8px', fontSize: '0.75rem', color: 'var(--danger)'}}>(Low Stock)</span>}
              </td>
              <td>{m.expiryDate}</td>
              <td>{m.supplier?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineList;
