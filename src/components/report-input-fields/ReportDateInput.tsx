
import React from 'react';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/DatePicker';

interface ReportDateInputProps {
  reportDate: Date;
  setReportDate: (date: Date) => void;
}

const ReportDateInput: React.FC<ReportDateInputProps> = ({
  reportDate,
  setReportDate
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={24} />
        <Label htmlFor="report-date" className="text-lg">Fecha del Reporte</Label>
      </div>
      <DatePicker date={reportDate} setDate={setReportDate} />
    </div>
  );
};

export default ReportDateInput;
