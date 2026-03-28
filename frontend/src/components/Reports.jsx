import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { BarChart3 } from 'lucide-react';

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data);
      
      if (res.data.length > 0) {
        const months = [...new Set(res.data.map(s => s.saleDate.substring(0, 7)))].sort().reverse();
        setSelectedMonth(months[0]);
      }
    } catch (err) {
      console.error("Failed to fetch sales", err);
    }
  };

  const monthsAvailable = [...new Set(sales.map(s => s.saleDate.substring(0, 7)))].sort().reverse();
  const filteredSales = sales.filter(s => s.saleDate.startsWith(selectedMonth)).sort((a,b) => new Date(b.saleDate) - new Date(a.saleDate));
  const totalAmount = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <BarChart3 size={32} color="var(--primary-color)" />
        <h2>{user.role === 'ROLE_ADMIN' ? 'Global Sales Report' : 'My Monthly Sales'}</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
        <div>
          <label style={{ marginRight: '1rem' }}>Select Month: </label>
          <select className="form-control" style={{ width: '200px', display: 'inline-block' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {monthsAvailable.length === 0 && <option value="">No data</option>}
            {monthsAvailable.map(m => (
              <option key={m} value={m}>{new Date(m + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
            ))}
          </select>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Total Sales for {selectedMonth ? new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Month'}
          </span>
          <h2 style={{ color: 'var(--success)', margin: 0 }}>${totalAmount.toFixed(2)}</h2>
        </div>
      </div>

      <table className="glass-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Customer Name</th>
            {user.role === 'ROLE_ADMIN' && <th>Pharmacist</th>}
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map(sale => (
            <tr key={sale.id}>
              <td>{new Date(sale.saleDate).toLocaleString()}</td>
              <td>{sale.customerName}</td>
              {user.role === 'ROLE_ADMIN' && <td>{sale.pharmacistName}</td>}
              <td><strong style={{ color: 'var(--success)' }}>${sale.totalAmount.toFixed(2)}</strong></td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan={user.role === 'ROLE_ADMIN' ? 4 : 3} style={{ textAlign: 'center', padding: '2rem' }}>No sales found for this month.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
