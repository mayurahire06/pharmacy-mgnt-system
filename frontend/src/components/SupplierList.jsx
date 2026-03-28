import { useState, useEffect } from 'react';
import api from '../services/api';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await api.get('/suppliers');
    setSuppliers(res.data);
  };

  const addSupplier = async (e) => {
    e.preventDefault();
    await api.post('/suppliers', { name, contactInfo });
    setName('');
    setContactInfo('');
    fetchSuppliers();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Suppliers</h2>
      
      <form onSubmit={addSupplier} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input type="text" placeholder="Supplier Name" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Contact Info" className="form-control" value={contactInfo} onChange={e => setContactInfo(e.target.value)} required />
        <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Add Supplier</button>
      </form>

      <table className="glass-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.contactInfo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
