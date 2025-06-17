
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import VentasPageContainer from '@/components/ventas/VentasPageContainer';

const VentasPage = () => {
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

  return <VentasPageContainer />;
};

export default VentasPage;
