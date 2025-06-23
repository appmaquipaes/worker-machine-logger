
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import VentasPageContainerFixed from '@/components/ventas/VentasPageContainerFixed';

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

  return <VentasPageContainerFixed />;
};

export default VentasPage;
