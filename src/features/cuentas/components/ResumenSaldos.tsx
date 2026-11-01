import { formatearMonto } from '../../../utils/format';
import type { Cuenta, Moneda } from '../types';

interface Props {
  nombre: string;
  cuentas: Cuenta[];
}

/**
 * Saludo y total disponible por moneda en una card verde, como la App Mibanco
 * (DESIGN.md §7). No suma tarjetas de crédito: son línea, no saldo.
 */
export function ResumenSaldos({ nombre, cuentas }: Props) {
  const totales = cuentas
    .filter((c) => c.tipo !== 'TARJETA_CREDITO')
    .reduce<Partial<Record<Moneda, number>>>((acc, c) => {
      acc[c.moneda] = (acc[c.moneda] ?? 0) + c.saldo_disponible;
      return acc;
    }, {});
  const monedas = Object.keys(totales) as Moneda[];

  return (
    <section className="mb-10 rounded-lg bg-green-600 p-6 text-white sm:p-8">
      <p className="text-white/90">Hola, {nombre}</p>
      <h1 className="text-h3 font-black sm:text-h2">Mis cuentas</h1>
      {monedas.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
          {monedas.map((moneda) => (
            <div key={moneda}>
              <span className="block text-sm text-white/90">Total disponible en {moneda}</span>
              <strong className="text-[1.75rem] leading-tight font-black">
                {formatearMonto(totales[moneda] ?? 0, moneda)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
