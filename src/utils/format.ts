import type { Moneda, TipoCuenta } from '../features/cuentas/types';

// Formato Mibanco: "S/15,000.00" y "US$1,850.25", sin espacio tras el símbolo (DESIGN.md §5)
const SIMBOLOS: Record<Moneda, string> = { PEN: 'S/', USD: 'US$' };
const formatoNumero = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function simboloMoneda(moneda: Moneda): string {
  return SIMBOLOS[moneda];
}

/** Formatea un monto en soles o dólares, por ejemplo "S/1,234.50". */
export function formatearMonto(monto: number, moneda: Moneda): string {
  return `${SIMBOLOS[moneda]}${formatoNumero.format(monto)}`;
}

const formatoFecha = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** Convierte "2026-10-31" en "31 oct. 2026" sin desfase de zona horaria. */
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return formatoFecha.format(new Date(anio ?? 1970, (mes ?? 1) - 1, dia ?? 1));
}

const ETIQUETAS_TIPO: Record<TipoCuenta, string> = {
  AHORROS: 'Cuenta de ahorros',
  CORRIENTE: 'Cuenta corriente',
  TARJETA_CREDITO: 'Tarjeta de crédito',
};

export function etiquetaTipoCuenta(tipo: TipoCuenta): string {
  return ETIQUETAS_TIPO[tipo];
}
