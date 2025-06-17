
import React from 'react';
import { ReportType } from '@/types/report';
import ReportDateInput from './ReportDateInput';
import WorkSiteInput from './WorkSiteInput';
import HoursInput from './HoursInput';
import TripsInput from './TripsInput';

interface BasicReportInputsProps {
  reportType: ReportType;
  reportDate: Date;
  setReportDate: (date: Date) => void;
  workSite: string;
  onClienteChangeForWorkSite: (cliente: string) => void;
  hours?: number;
  setHours: (value: number | undefined) => void;
  trips?: number;
  setTrips: (value: number | undefined) => void;
}

const BasicReportInputs: React.FC<BasicReportInputsProps> = ({
  reportType,
  reportDate,
  setReportDate,
  workSite,
  onClienteChangeForWorkSite,
  hours,
  setHours,
  trips,
  setTrips
}) => {
  return (
    <>
      <ReportDateInput
        reportDate={reportDate}
        setReportDate={setReportDate}
      />

      <WorkSiteInput
        reportType={reportType}
        workSite={workSite}
        onClienteChangeForWorkSite={onClienteChangeForWorkSite}
      />

      <HoursInput
        reportType={reportType}
        hours={hours}
        setHours={setHours}
      />

      <TripsInput
        reportType={reportType}
        trips={trips}
        setTrips={setTrips}
      />
    </>
  );
};

export default BasicReportInputs;
