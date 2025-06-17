
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Download } from 'lucide-react';

interface ActionButtonsProps {
  generateReport: () => void;
  exportToExcel: () => void;
  reportDataLength: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  generateReport,
  exportToExcel,
  reportDataLength
}) => {
  return (
    <div className="action-grid-2 gap-4">
      <Button onClick={generateReport} className="btn-primary-large">
        <BarChart3 className="mobile-icon" />
        Generar Reporte
      </Button>
      {reportDataLength > 0 && (
        <Button onClick={exportToExcel} className="btn-secondary-large">
          <Download className="mobile-icon" />
          Exportar Excel
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
