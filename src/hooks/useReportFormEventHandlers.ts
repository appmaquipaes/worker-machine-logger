
import React from 'react';
import { ReportType } from '@/types/report';

export const useReportFormEventHandlers = (
  setReportType: (value: ReportType) => void,
  setReportDate: (date: Date) => void,
  setDescription: (value: string) => void,
  setTrips: (value: number | undefined) => void,
  setHours: (value: number | undefined) => void,
  setValue: (value: number | undefined) => void,
  setWorkSite: (value: string) => void,
  setOrigin: (value: string) => void,
  setSelectedCliente: (value: string) => void,
  setSelectedFinca: (value: string) => void,
  setMaintenanceValue: (value: number | undefined) => void,
  setCantidadM3: (value: number | undefined) => void,
  setProveedor: (value: string) => void,
  setKilometraje: (value: number | undefined) => void,
  setTipoMateria: (value: string) => void
) => {
  const handleClienteChangeForWorkSite = (cliente: string) => {
    console.log('🔄 Cliente seleccionado para workSite:', cliente);
    setWorkSite(cliente);
  };

  const handleClienteChangeForDestination = (cliente: string) => {
    console.log('🔄 Cliente seleccionado para destino:', cliente);
    setSelectedCliente(cliente);
  };

  const handleFincaChangeForDestination = (finca: string) => {
    console.log('🔄 Finca seleccionada para destino:', finca);
    setSelectedFinca(finca);
  };

  const handleReportTypeChange = (value: ReportType) => {
    setReportType(value);
  };

  const handleReportDateChange = (date: Date) => {
    setReportDate(date);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTripsChange = (value: number | undefined) => {
    setTrips(value);
  };

  const handleHoursChange = (value: number | undefined) => {
    setHours(value);
  };

  const handleValueChange = (value: number | undefined) => {
    setValue(value);
  };

  const handleWorkSiteChange = (value: string) => {
    setWorkSite(value);
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
  };

  const handleSelectedClienteChange = (value: string) => {
    setSelectedCliente(value);
  };

  const handleSelectedFincaChange = (value: string) => {
    setSelectedFinca(value);
  };

  const handleMaintenanceValueChange = (value: number | undefined) => {
    setMaintenanceValue(value);
  };

  const handleCantidadM3Change = (value: number | undefined) => {
    setCantidadM3(value);
  };

  const handleProveedorChange = (value: string) => {
    setProveedor(value);
  };

  const handleKilometrajeChange = (value: number | undefined) => {
    setKilometraje(value);
  };

  const handleTipoMateriaChange = (value: string) => {
    setTipoMateria(value);
  };

  return {
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
    handleReportTypeChange,
    handleReportDateChange,
    handleDescriptionChange,
    handleTripsChange,
    handleHoursChange,
    handleValueChange,
    handleWorkSiteChange,
    handleOriginChange,
    handleSelectedClienteChange,
    handleSelectedFincaChange,
    handleMaintenanceValueChange,
    handleCantidadM3Change,
    handleProveedorChange,
    handleKilometrajeChange,
    handleTipoMateriaChange,
  };
};
