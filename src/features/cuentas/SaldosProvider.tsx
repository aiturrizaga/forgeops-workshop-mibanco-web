import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { obtenerSaldos } from './api';
import { cuentasKeys } from './hooks';
import { SaldosContext } from './saldosContext';
import type { Moneda } from './types';

/**
 * Saldos bajo demanda, compartidos entre el resumen y el detalle.
 * - Ocultos por defecto: no se llama al API hasta pulsar «Mostrar saldos».
 * - Al ocultarlos se borran de la caché; al volver a mostrarlos se piden de nuevo.
 * - El estado vive solo en memoria: al recargar o volver a ingresar, se ocultan.
 */
export function SaldosProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [visibles, setVisibles] = useState(false);

  const consulta = useQuery({
    queryKey: cuentasKeys.saldos,
    queryFn: ({ signal }) => obtenerSaldos(signal),
    enabled: visibles,
    staleTime: 0,
    gcTime: 0,
  });

  const alternar = useCallback(() => {
    setVisibles((actual) => {
      if (actual) queryClient.removeQueries({ queryKey: cuentasKeys.saldos });
      return !actual;
    });
  }, [queryClient]);

  const valor = useMemo(() => {
    const datos = visibles ? consulta.data : undefined;
    return {
      visibles,
      alternar,
      cargando: visibles && consulta.isFetching && !datos,
      error: visibles && consulta.isError,
      saldoDe: (cuentaId: string) => datos?.saldos.find((s) => s.cuenta_id === cuentaId),
      totalDe: (moneda: Moneda) =>
        datos?.totales.find((t) => t.moneda === moneda)?.saldo_disponible,
    };
  }, [visibles, alternar, consulta.data, consulta.isFetching, consulta.isError]);

  return <SaldosContext.Provider value={valor}>{children}</SaldosContext.Provider>;
}
