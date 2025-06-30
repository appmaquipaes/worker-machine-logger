
import React from 'react';
import { TarifaCliente } from '@/models/TarifasCliente';
import { useTarifaForm } from '@/hooks/useTarifaForm';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import TarifaTransporteForm from '@/components/TarifaTransporteForm';
import TarifaAlquilerForm from '@/components/TarifaAlquilerForm';
import TarifaEscombreraForm from '@/components/TarifaEscombreraForm';
import ServiceTypeSelector from '@/components/tarifa-forms/ServiceTypeSelector';
import ObservationsSection from '@/components/tarifa-forms/ObservationsSection';
import TarifaFormActions from '@/components/tarifa-forms/TarifaFormActions';

interface TarifaClienteFormProps {
  initialData?: TarifaCliente | null;
  onTarifaCreated: (tarifa: TarifaCliente) => void;
  onCancel: () => void;
}

const TarifaClienteForm: React.FC<TarifaClienteFormProps> = ({
  initialData,
  onTarifaCreated,
  onCancel
}) => {
  const {
    // Data
    proveedores,
    materiales,
    machines,
    
    // Form state
    tipoServicio,
    cliente,
    finca,
    origen,
    destino,
    valorFlete,
    tipoMaterial,
    valorMaterial,
    valorMaterialCliente,
    maquinaId,
    valorPorHora,
    valorPorDia,
    valorPorMes,
    escombreraId,
    valorVolquetaSencilla,
    valorVolquetaDobletroque,
    observaciones,
    clienteTieneFincas,
    
    // Setters
    setTipoServicio,
    setOrigen,
    setDestino,
    setValorFlete,
    setValorMaterialCliente,
    setMaquinaId,
    setValorPorHora,
    setValorPorDia,
    setValorPorMes,
    setEscombreraId,
    setValorVolquetaSencilla,
    setValorVolquetaDobletroque,
    setObservaciones,
    
    // Handlers
    handleClienteChange,
    handleFincaChange,
    handleMaterialChange,
    handleSubmit
  } = useTarifaForm(initialData, onTarifaCreated);

  return (
    <div className="space-y-8">
      {/* Service Type Selection */}
      <ServiceTypeSelector
        selectedType={tipoServicio}
        onTypeChange={setTipoServicio}
      />

      {/* Client and Farm Selection */}
      <div className="bg-slate-50 p-6 rounded-xl">
        <ClienteFincaSelector
          selectedCliente={cliente}
          selectedFinca={finca}
          onClienteChange={handleClienteChange}
          onFincaChange={handleFincaChange}
          autoSetDestination={true}
        />
      </div>

      {/* Service-specific forms */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        {tipoServicio === 'transporte' ? (
          <TarifaTransporteForm
            origen={origen}
            destino={destino}
            valorFlete={valorFlete}
            tipoMaterial={tipoMaterial}
            valorMaterial={valorMaterial}
            valorMaterialCliente={valorMaterialCliente}
            proveedores={proveedores}
            materiales={materiales}
            cliente={cliente}
            clienteTieneFincas={clienteTieneFincas}
            onOrigenChange={setOrigen}
            onDestinoChange={setDestino}
            onValorFleteChange={setValorFlete}
            onMaterialChange={handleMaterialChange}
            onValorMaterialClienteChange={setValorMaterialCliente}
          />
        ) : tipoServicio === 'alquiler_maquina' ? (
          <TarifaAlquilerForm
            maquinaId={maquinaId}
            valorPorHora={valorPorHora}
            valorPorDia={valorPorDia}
            valorPorMes={valorPorMes}
            machines={machines}
            onMaquinaChange={setMaquinaId}
            onValorPorHoraChange={setValorPorHora}
            onValorPorDiaChange={setValorPorDia}
            onValorPorMesChange={setValorPorMes}
          />
        ) : (
          <TarifaEscombreraForm
            escombreraId={escombreraId}
            valorVolquetaSencilla={valorVolquetaSencilla}
            valorVolquetaDobletroque={valorVolquetaDobletroque}
            onEscombreraChange={setEscombreraId}
            onValorSencillaChange={setValorVolquetaSencilla}
            onValorDobletroqueChange={setValorVolquetaDobletroque}
          />
        )}
      </div>
      
      {/* Observations */}
      <ObservationsSection
        value={observaciones}
        onChange={setObservaciones}
      />
      
      {/* Action Buttons */}
      <TarifaFormActions
        isEditing={!!initialData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
};

export default TarifaClienteForm;
