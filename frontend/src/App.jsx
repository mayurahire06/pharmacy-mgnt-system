import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';

function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const ProtectedRoute = ({ children, roles }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
    return children;
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? (user.role === 'ROLE_ADMIN' ? '/admin' : '/pharmacist') : '/login'} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pharmacist/*" 
          element={
            <ProtectedRoute roles={['ROLE_PHARMACIST']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
