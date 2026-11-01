import { apiGet } from '../../services/api/httpClient';
import type { CuentasResponse, MovimientosResponse } from './types';

export function obtenerCuentas(signal?: AbortSignal): Promise<CuentasResponse> {
  return apiGet<CuentasResponse>('/api/cuentas', signal);
}

export function obtenerMovimientos(
  cuentaId: string,
  signal?: AbortSignal,
): Promise<MovimientosResponse> {
  return apiGet<MovimientosResponse>(
    `/api/cuentas/${encodeURIComponent(cuentaId)}/movimientos`,
    signal,
  );
}
