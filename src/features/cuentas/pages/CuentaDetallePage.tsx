import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Spinner } from '../../../components/Spinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { tarjeta } from '../../../components/ui';
import { etiquetaTipoCuenta, formatearMonto } from '../../../utils/format';
import { useMovimientos } from '../hooks';
import type { TipoMovimiento } from '../types';
import { MovimientosLista } from '../components/MovimientosLista';
import { ConsumosPorCategoria } from '../components/ConsumosPorCategoria';
import { ResumenItem } from '../components/ResumenItem';

type Filtro = 'TODOS' | TipoMovimiento;

const FILTROS: { valor: Filtro; etiqueta: string }[] = [
  { valor: 'TODOS', etiqueta: 'Todos' },
  { valor: 'CARGO', etiqueta: 'Cargos' },
  { valor: 'ABONO', etiqueta: 'Abonos' },
];

/** Detalle de una cuenta: movimientos y consumos por categoría. */
export function CuentaDetallePage() {
  const { cuentaId = '' } = useParams();
  const { data, isPending, error, refetch } = useMovimientos(cuentaId);
  // Estado local de UI: filtro de la lista
  const [filtro, setFiltro] = useState<Filtro>('TODOS');

  if (isPending) return <Spinner texto="Cargando movimientos…" />;
  if (error) {
    return (
      <>
        <VolverLink />
        <ErrorMessage mensaje={error.message} onReintentar={() => void refetch()} />
      </>
    );
  }

  const { cuenta, movimientos } = data;
  const esTarjeta = cuenta.tipo === 'TARJETA_CREDITO';
  const visibles = filtro === 'TODOS' ? movimientos : movimientos.filter((m) => m.tipo === filtro);
  const total = (tipo: TipoMovimiento) =>
    movimientos.filter((m) => m.tipo === tipo).reduce((suma, m) => suma + m.monto, 0);

  return (
    <>
      <VolverLink />
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-lg bg-green-600 p-6 text-white sm:p-8">
        <div>
          <p className="text-white/90">
            {etiquetaTipoCuenta(cuenta.tipo)} · {cuenta.numero_enmascarado}
          </p>
          <h1 className="text-h3 font-black sm:text-h2">{cuenta.alias}</h1>
        </div>
        <div className="flex flex-col sm:text-right">
          <span className="text-sm text-white/90">
            {esTarjeta ? 'Línea disponible' : 'Saldo disponible'}
          </span>
          <strong className="text-[2rem] leading-tight font-black">
            {formatearMonto(cuenta.saldo_disponible, cuenta.moneda)}
          </strong>
          <small className="text-white/90">
            Contable: {formatearMonto(cuenta.saldo_contable, cuenta.moneda)}
          </small>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-4">
        <ResumenItem
          etiqueta="Cargos del periodo"
          valor={formatearMonto(total('CARGO'), cuenta.moneda)}
          tono="cargo"
        />
        <ResumenItem
          etiqueta="Abonos del periodo"
          valor={formatearMonto(total('ABONO'), cuenta.moneda)}
          tono="abono"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        <section className={`p-6 md:col-span-2 ${tarjeta}`}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">Movimientos</h2>
            <div
              className="flex gap-1 rounded-full bg-surface p-1"
              role="group"
              aria-label="Filtrar movimientos"
            >
              {FILTROS.map((f) => {
                const activo = filtro === f.valor;
                return (
                  <button
                    key={f.valor}
                    aria-pressed={activo}
                    onClick={() => setFiltro(f.valor)}
                    className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold ${activo ? 'bg-green-600 text-white' : 'text-muted hover:text-ink'}`}
                  >
                    {f.etiqueta}
                  </button>
                );
              })}
            </div>
          </div>
          <MovimientosLista movimientos={visibles} moneda={cuenta.moneda} />
        </section>

        <aside className={`p-6 ${tarjeta}`}>
          <h2 className="mb-4 text-xl font-black">Consumos por categoría</h2>
          <ConsumosPorCategoria movimientos={movimientos} moneda={cuenta.moneda} />
        </aside>
      </div>
    </>
  );
}

function VolverLink() {
  return (
    <Link
      to="/cuentas"
      className="mb-4 inline-flex min-h-11 items-center gap-1 font-bold text-green-600 hover:text-green-700"
    >
      <ChevronLeft aria-hidden="true" className="size-5" />
      Volver a mis cuentas
    </Link>
  );
}
