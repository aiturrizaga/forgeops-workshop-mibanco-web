import { formatearMonto } from '../../../utils/format';
import type { Moneda, Movimiento } from '../types';

interface Props {
  movimientos: Movimiento[];
  moneda: Moneda;
}

/** Suma de cargos por categoría, de mayor a menor, con una barra proporcional. */
export function ConsumosPorCategoria({ movimientos, moneda }: Props) {
  const porCategoria = new Map<string, number>();
  for (const m of movimientos) {
    if (m.tipo === 'CARGO') {
      porCategoria.set(m.categoria, (porCategoria.get(m.categoria) ?? 0) + m.monto);
    }
  }
  const filas = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);
  const maximo = filas[0]?.[1] ?? 0;

  if (filas.length === 0) {
    return <p className="py-6 text-center text-muted">Sin consumos en el periodo.</p>;
  }

  return (
    <ul className="space-y-4">
      {filas.map(([categoria, total]) => (
        <li key={categoria}>
          <div className="flex justify-between gap-2 text-sm">
            <span>{categoria}</span>
            <span className="font-bold">{formatearMonto(total, moneda)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${(total / maximo) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
