import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatearFecha, formatearMonto } from '../../../utils/format';
import type { Moneda, Movimiento } from '../types';

interface Props {
  movimientos: Movimiento[];
  moneda: Moneda;
}

/** Lista de movimientos: cargos en rojo con signo menos, abonos en verde. */
export function MovimientosLista({ movimientos, moneda }: Props) {
  if (movimientos.length === 0) {
    return <p className="py-6 text-center text-muted">No hay movimientos para mostrar.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {movimientos.map((m) => {
        const esCargo = m.tipo === 'CARGO';
        const Icono = esCargo ? ArrowUpRight : ArrowDownLeft;
        return (
          <li key={m.id} className="flex items-center gap-3 py-4">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${esCargo ? 'bg-danger-soft text-cargo' : 'bg-green-25 text-abono'}`}
            >
              <Icono aria-hidden="true" className="size-5" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-bold">{m.descripcion}</span>
              <span className="truncate text-sm text-muted">
                {formatearFecha(m.fecha)}
                {m.comercio ? ` · ${m.comercio}` : ''}
              </span>
              <span className="w-fit rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted">
                {m.categoria}
              </span>
            </div>
            <span
              className={`font-black whitespace-nowrap ${esCargo ? 'text-cargo' : 'text-abono'}`}
            >
              {esCargo ? '−' : '+'}
              {formatearMonto(m.monto, moneda)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
