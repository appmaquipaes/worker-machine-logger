
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RegisterForm from '@/components/register/RegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Volver al Panel Admin
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
