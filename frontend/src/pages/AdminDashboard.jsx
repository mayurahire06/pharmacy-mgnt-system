import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { LogOut, Users, Package } from 'lucide-react';
import MedicineList from '../components/MedicineList';
import SupplierList from '../components/SupplierList';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('medicines');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <div className="sidebar">
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package /> Admin Hub
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><button className={`btn-secondary ${activeTab === 'medicines' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: activeTab === 'medicines' ? 'rgba(255,255,255,0.2)' : '' }} onClick={() => setActiveTab('medicines')}>Manage Medicines</button></li>
          <li><button className={`btn-secondary ${activeTab === 'suppliers' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: activeTab === 'suppliers' ? 'rgba(255,255,255,0.2)' : '' }} onClick={() => setActiveTab('suppliers')}>Manage Suppliers</button></li>
        </ul>
        <button 
          className="btn-danger" 
          style={{ position: 'absolute', bottom: '2rem', width: 'calc(100% - 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
      <div className="main-content">
        <div className="page-header">
          <h1>{activeTab === 'medicines' ? 'Medicines Operations' : 'Suppliers Management'}</h1>
        </div>
        {activeTab === 'medicines' && <MedicineList />}
        {activeTab === 'suppliers' && <SupplierList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
