import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { LogOut, Activity } from 'lucide-react';
import PointOfSale from '../components/PointOfSale';

const PharmacistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pos');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <div className="sidebar">
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity /> Pharma Desk
        </h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><button className={`btn-secondary ${activeTab === 'pos' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: activeTab === 'pos' ? 'rgba(255,255,255,0.2)' : '' }} onClick={() => setActiveTab('pos')}>Point of Sale</button></li>
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
          <h1>Point of Sale & Billing</h1>
        </div>
        {activeTab === 'pos' && <PointOfSale />}
      </div>
    </div>
  );
};

export default PharmacistDashboard;
