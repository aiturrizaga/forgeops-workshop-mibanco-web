import { useQuery } from '@tanstack/react-query';
import { obtenerCuentas, obtenerMovimientos } from './api';

// Claves de caché de TanStack Query para esta funcionalidad
export const cuentasKeys = {
  todas: ['cuentas'] as const,
  saldos: ['cuentas', 'saldos'] as const,
  movimientos: (cuentaId: string) => ['cuentas', cuentaId, 'movimientos'] as const,
};

export function useCuentas() {
  return useQuery({
    queryKey: cuentasKeys.todas,
    queryFn: ({ signal }) => obtenerCuentas(signal),
    select: (datos) => datos.cuentas,
  });
}

export function useMovimientos(cuentaId: string) {
  return useQuery({
    queryKey: cuentasKeys.movimientos(cuentaId),
    queryFn: ({ signal }) => obtenerMovimientos(cuentaId, signal),
    enabled: Boolean(cuentaId),
  });
}
