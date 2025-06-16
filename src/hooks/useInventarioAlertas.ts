
import { useState, useEffect, useCallback } from 'react';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from 'sonner';

export type AlertaInventario = {
  id: string;
  material: string;
  cantidadActual: number;
  umbralMinimo: number;
  fechaDeteccion: Date;
  tipo: 'stock_bajo' | 'stock_critico' | 'sin_stock';
  activa: boolean;
};

export type UmbralMaterial = {
  material: string;
  umbralMinimo: number;
  umbralCritico: number;
};

export const useInventarioAlertas = () => {
  const [alertas, setAlertas] = useState<AlertaInventario[]>([]);
  const [umbrales, setUmbrales] = useState<UmbralMaterial[]>([]);

  // Cargar configuración de umbrales desde localStorage
  const cargarUmbrales = useCallback(() => {
    const umbralGuardado = localStorage.getItem('umbrales_inventario');
    if (umbralGuardado) {
      setUmbrales(JSON.parse(umbralGuardado));
    }
  }, []);

  // Guardar umbrales en localStorage
  const guardarUmbrales = useCallback((nuevosUmbrales: UmbralMaterial[]) => {
    localStorage.setItem('umbrales_inventario', JSON.stringify(nuevosUmbrales));
    setUmbrales(nuevosUmbrales);
  }, []);

  // Cargar alertas desde localStorage
  const cargarAlertas = useCallback(() => {
    const alertasGuardadas = localStorage.getItem('alertas_inventario');
    if (alertasGuardadas) {
      const alertasParsed = JSON.parse(alertasGuardadas).map((alerta: any) => ({
        ...alerta,
        fechaDeteccion: new Date(alerta.fechaDeteccion)
      }));
      setAlertas(alertasParsed);
    }
  }, []);

  // Guardar alertas en localStorage
  const guardarAlertas = useCallback((nuevasAlertas: AlertaInventario[]) => {
    localStorage.setItem('alertas_inventario', JSON.stringify(nuevasAlertas));
    setAlertas(nuevasAlertas);
  }, []);

  // Verificar niveles de stock y generar alertas
  const verificarStock = useCallback(() => {
    const inventario = loadInventarioAcopio();
    const nuevasAlertas: AlertaInventario[] = [];

    inventario.forEach(item => {
      const umbral = umbrales.find(u => u.material === item.tipo_material);
      if (!umbral) return;

      let tipoAlerta: AlertaInventario['tipo'] | null = null;

      if (item.cantidad_disponible === 0) {
        tipoAlerta = 'sin_stock';
      } else if (item.cantidad_disponible <= umbral.umbralCritico) {
        tipoAlerta = 'stock_critico';
      } else if (item.cantidad_disponible <= umbral.umbralMinimo) {
        tipoAlerta = 'stock_bajo';
      }

      if (tipoAlerta) {
        // Verificar si ya existe una alerta activa para este material
        const alertaExistente = alertas.find(
          a => a.material === item.tipo_material && a.activa && a.tipo === tipoAlerta
        );

        if (!alertaExistente) {
          const nuevaAlerta: AlertaInventario = {
            id: Date.now().toString() + Math.random().toString().slice(2, 7),
            material: item.tipo_material,
            cantidadActual: item.cantidad_disponible,
            umbralMinimo: umbral.umbralMinimo,
            fechaDeteccion: new Date(),
            tipo: tipoAlerta,
            activa: true
          };

          nuevasAlertas.push(nuevaAlerta);

          // Mostrar toast según el tipo de alerta
          const mensaje = tipoAlerta === 'sin_stock' 
            ? `¡Sin stock de ${item.tipo_material}!`
            : tipoAlerta === 'stock_critico'
            ? `Stock crítico: ${item.tipo_material} (${item.cantidad_disponible} m³)`
            : `Stock bajo: ${item.tipo_material} (${item.cantidad_disponible} m³)`;

          toast.warning(mensaje, {
            description: `Umbral mínimo: ${umbral.umbralMinimo} m³`
          });
        }
      }
    });

    if (nuevasAlertas.length > 0) {
      const todasLasAlertas = [...alertas, ...nuevasAlertas];
      guardarAlertas(todasLasAlertas);
    }
  }, [umbrales, alertas, guardarAlertas]);

  // Desactivar una alerta
  const desactivarAlerta = useCallback((alertaId: string) => {
    const alertasActualizadas = alertas.map(alerta =>
      alerta.id === alertaId ? { ...alerta, activa: false } : alerta
    );
    guardarAlertas(alertasActualizadas);
  }, [alertas, guardarAlertas]);

  // Configurar umbral para un material
  const configurarUmbral = useCallback((material: string, umbralMinimo: number, umbralCritico: number) => {
    const umbralExistente = umbrales.findIndex(u => u.material === material);
    let nuevosUmbrales: UmbralMaterial[];

    if (umbralExistente >= 0) {
      nuevosUmbrales = umbrales.map(u =>
        u.material === material ? { ...u, umbralMinimo, umbralCritico } : u
      );
    } else {
      nuevosUmbrales = [...umbrales, { material, umbralMinimo, umbralCritico }];
    }

    guardarUmbrales(nuevosUmbrales);
  }, [umbrales, guardarUmbrales]);

  // Obtener alertas activas
  const alertasActivas = alertas.filter(alerta => alerta.activa);

  useEffect(() => {
    cargarUmbrales();
    cargarAlertas();
  }, [cargarUmbrales, cargarAlertas]);

  // Verificar stock cuando cambian los umbrales
  useEffect(() => {
    if (umbrales.length > 0) {
      verificarStock();
    }
  }, [umbrales, verificarStock]);

  return {
    alertas: alertasActivas,
    umbrales,
    verificarStock,
    desactivarAlerta,
    configurarUmbral,
    cantidadAlertasActivas: alertasActivas.length
  };
};
