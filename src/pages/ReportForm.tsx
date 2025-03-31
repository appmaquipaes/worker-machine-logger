
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport, ReportType } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from "@/components/ui/sonner";

const ReportForm: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('Horas Trabajadas');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { selectedMachine } = useMachine();
  const { addReport } = useReport();
  const navigate = useNavigate();

  // Redirigir si no hay un usuario o máquina seleccionada
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedMachine) {
      toast.error('Debes seleccionar una máquina primero');
      navigate('/machines');
    }
  }, [user, selectedMachine, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debes seleccionar una máquina primero');
      return;
    }
    
    if (!description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addReport(
        selectedMachine.id,
        selectedMachine.name,
        reportType,
        description
      );
      
      // Limpiar el formulario
      setDescription('');
      
      // Mostrar mensaje de éxito
      toast.success('Reporte enviado correctamente');
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('Ha ocurrido un error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !selectedMachine) return null;

  return (
    <div className="container max-w-xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Enviar Reporte</CardTitle>
          <CardDescription>
            Máquina: <span className="font-medium">{selectedMachine.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Tipo de Reporte</Label>
              <RadioGroup
                value={reportType}
                onValueChange={(value) => setReportType(value as ReportType)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Horas Trabajadas" id="horasTrabajadas" />
                  <Label htmlFor="horasTrabajadas">Horas Trabajadas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Horas Extras" id="horasExtras" />
                  <Label htmlFor="horasExtras">Horas Extras</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mantenimiento" id="mantenimiento" />
                  <Label htmlFor="mantenimiento">Mantenimiento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Combustible" id="combustible" />
                  <Label htmlFor="combustible">Combustible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Novedades" id="novedades" />
                  <Label htmlFor="novedades">Novedades</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder={
                  reportType === 'Horas Trabajadas'
                    ? 'Ej. 8 horas trabajadas en el proyecto de construcción'
                    : reportType === 'Horas Extras'
                    ? 'Ej. 2 horas extras trabajadas para finalizar el movimiento de tierra'
                    : reportType === 'Mantenimiento'
                    ? 'Ej. Cambio de aceite y filtros'
                    : reportType === 'Combustible'
                    ? 'Ej. 20 galones de diésel'
                    : 'Descripción de la novedad'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/machines')}>
            Cambiar Máquina
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Volver al Inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportForm;
