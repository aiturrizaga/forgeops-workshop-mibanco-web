import { createContext, useContext } from 'react';
import type { Moneda, SaldoCuenta } from './types';

export interface SaldosContextValue {
  /** false por defecto: los saldos siempre empiezan ocultos al entrar a la app. */
  visibles: boolean;
  alternar: () => void;
  /** true mientras se piden los saldos al API tras pulsar el ojo. */
  cargando: boolean;
  error: boolean;
  saldoDe: (cuentaId: string) => SaldoCuenta | undefined;
  totalDe: (moneda: Moneda) => number | undefined;
}

export const SaldosContext = createContext<SaldosContextValue | null>(null);

export function useSaldos(): SaldosContextValue {
  const contexto = useContext(SaldosContext);
  if (!contexto) throw new Error('useSaldos debe usarse dentro de SaldosProvider');
  return contexto;
}
