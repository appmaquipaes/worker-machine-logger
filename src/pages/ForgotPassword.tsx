
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!email) return;
    
    const success = await resetPassword(email);
    setIsSubmitting(false);
    
    if (success) {
      setStep('success');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="mb-6 flex justify-start">
        <Button
          variant="outline"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft size={18} />
          Volver al inicio de sesión
        </Button>
      </div>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {step === 'email' && 'Recuperar Contraseña'}
            {step === 'success' && 'Correo Enviado'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Ingresa tu correo electrónico para recibir un enlace de recuperación'}
            {step === 'success' && 'Revisa tu correo electrónico para continuar con el proceso'}
          </CardDescription>
        </CardHeader>

        {step === 'email' && (
          <CardContent>
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex">
                  <Mail className="w-5 h-5 mr-2 text-muted-foreground mt-2.5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@maquipaes.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </Button>
            </form>
          </CardContent>
        )}

        {step === 'success' && (
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Se ha enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Haz clic en el enlace del correo para crear una nueva contraseña.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
