import { apiGet } from '../../services/api/httpClient';
import type { CuentasResponse, MovimientosResponse, SaldosResponse } from './types';

export function obtenerCuentas(signal?: AbortSignal): Promise<CuentasResponse> {
  return apiGet<CuentasResponse>('/api/cuentas', signal);
}

/** Saldos y totales; se llama solo cuando el usuario pulsa «Mostrar saldos». */
export function obtenerSaldos(signal?: AbortSignal): Promise<SaldosResponse> {
  return apiGet<SaldosResponse>('/api/cuentas/saldos', signal);
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
