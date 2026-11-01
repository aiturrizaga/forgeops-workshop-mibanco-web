import type { Cuenta, Moneda } from '../types';
import { useSaldos } from '../saldosContext';
import { BotonSaldos } from './BotonSaldos';
import { Monto } from './Monto';

interface Props {
  nombre: string;
  cuentas: Cuenta[];
}

/**
 * Saludo y total disponible por moneda en una card verde, como la App Mibanco
 * (DESIGN.md §7). Los totales los calcula el backend (sin tarjetas de crédito)
 * y solo se piden al pulsar el botón del ojo.
 */
export function ResumenSaldos({ nombre, cuentas }: Props) {
  const { totalDe } = useSaldos();
  // Monedas con cuentas de saldo: definen qué totales mostrar, aunque estén ocultos
  const monedas = [
    ...new Set(cuentas.filter((c) => c.tipo !== 'TARJETA_CREDITO').map((c) => c.moneda)),
  ] as Moneda[];

  return (
    <section className="mb-10 rounded-lg bg-green-600 p-6 text-white sm:p-8">
      <p className="text-white/90">
        Hola, <span className="font-bold text-white">{nombre}</span>
      </p>
      <h1 className="text-h3 font-black sm:text-h2">Mis cuentas</h1>
      {monedas.length > 0 && (
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {monedas.map((moneda) => (
              <div key={moneda}>
                <span className="block text-sm text-white/90">Total disponible en {moneda}</span>
                <strong className="text-[1.75rem] leading-tight font-black">
                  <Monto valor={totalDe(moneda)} moneda={moneda} />
                </strong>
              </div>
            ))}
          </div>
          <BotonSaldos />
        </div>
      )}
    </section>
  );
}
