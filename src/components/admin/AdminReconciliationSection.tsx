
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReconciliationDashboard from '@/components/reconciliation/ReconciliationDashboard';

const AdminReconciliationSection: React.FC = () => {
  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Control de Consistencia de Datos
        </CardTitle>
        <CardDescription>
          Verifica la integridad entre reportes, inventario y ventas automáticas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReconciliationDashboard />
      </CardContent>
    </Card>
  );
};

export default AdminReconciliationSection;
