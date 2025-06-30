
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ControlCombustibleContainer from '@/components/combustible/ControlCombustibleContainer';

const ControlCombustiblePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ControlCombustibleContainer />
    </div>
  );
};

export default ControlCombustiblePage;
