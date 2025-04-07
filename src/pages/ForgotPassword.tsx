
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'verification' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!email) return;
    
    const success = await resetPassword(email);
    setIsSubmitting(false);
    
    if (success) {
      setStep('verification');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) return;
    
    setStep('newPassword');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!newPassword || newPassword !== confirmPassword) {
      setIsSubmitting(false);
      return;
    }
    
    const success = await updatePassword(email, verificationCode, newPassword);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {step === 'email' && 'Recuperar Contraseña'}
            {step === 'verification' && 'Verificar Código'}
            {step === 'newPassword' && 'Nueva Contraseña'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Ingresa tu correo electrónico para recibir un código de verificación'}
            {step === 'verification' && 'Ingresa el código de verificación que recibiste'}
            {step === 'newPassword' && 'Crea una nueva contraseña segura'}
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
                {isSubmitting ? "Enviando..." : "Enviar Código"}
              </Button>
            </form>
          </CardContent>
        )}

        {step === 'verification' && (
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Código de Verificación</Label>
                <div className="flex justify-center py-4">
                  <InputOTP
                    value={verificationCode}
                    onChange={setVerificationCode}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Se ha enviado un código de 6 dígitos a tu correo
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={verificationCode.length !== 6}>
                Verificar Código
              </Button>
            </form>
          </CardContent>
        )}

        {step === 'newPassword' && (
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {newPassword !== confirmPassword && confirmPassword && (
                  <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !newPassword || newPassword !== confirmPassword}
              >
                {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </form>
          </CardContent>
        )}

        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
