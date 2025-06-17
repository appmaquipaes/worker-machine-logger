
import React from 'react';
import { DatePicker } from '@/components/DatePicker';

interface DateRangeFiltersProps {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const DateRangeFilters: React.FC<DateRangeFiltersProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Fecha Inicio</label>
        <div className="h-12">
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Fecha Fin</label>
        <div className="h-12">
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
      </div>
    </>
  );
};

export default DateRangeFilters;
