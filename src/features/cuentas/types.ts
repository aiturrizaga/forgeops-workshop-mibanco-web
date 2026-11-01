// Contrato del API de cuentas (mismo formato que devuelve el backend).

export type TipoCuenta = 'AHORROS' | 'CORRIENTE' | 'TARJETA_CREDITO';
export type Moneda = 'PEN' | 'USD';
export type TipoMovimiento = 'CARGO' | 'ABONO';

export interface Cuenta {
  id: string;
  tipo: TipoCuenta;
  alias: string;
  numero_enmascarado: string;
  moneda: Moneda;
  saldo_disponible: number;
  saldo_contable: number;
}

export interface Movimiento {
  id: string;
  fecha: string; // AAAA-MM-DD
  descripcion: string;
  comercio: string | null;
  categoria: string;
  monto: number; // siempre positivo; el signo lo da "tipo"
  tipo: TipoMovimiento;
}

export interface CuentasResponse {
  cuentas: Cuenta[];
}

export interface MovimientosResponse {
  cuenta: Cuenta;
  movimientos: Movimiento[];
}
