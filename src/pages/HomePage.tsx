import { Link } from 'react-router';
import { ChartPie, ReceiptText, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '../components/Logo';
import { boton, tarjeta } from '../components/ui';
import { useEstaAutenticado, useIngresar } from '../features/auth/hooks';

const ACCIONES: { icono: LucideIcon; titulo: string; descripcion: string }[] = [
  { icono: Wallet, titulo: 'Consulta tus saldos', descripcion: 'En soles y dólares, al toque' },
  {
    icono: ReceiptText,
    titulo: 'Revisa tus movimientos',
    descripcion: 'Cargos y abonos de cada cuenta',
  },
  { icono: ChartPie, titulo: 'Mira tus consumos', descripcion: 'Agrupados por categoría' },
];

/** Inicio público: hero de marca con acceso a la banca (DESIGN.md §6.4 y §6.5). */
export function HomePage() {
  const autenticado = useEstaAutenticado();
  const ingresar = useIngresar();

  return (
    <>
      <section className="grid items-center gap-8 rounded-lg bg-green-900 p-6 text-white sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:p-14">
        <div>
          <h1 className="font-display text-[2rem] leading-tight font-black sm:text-display">
            Tu valentía tiene un banco
          </h1>
          <p className="mt-4 max-w-xl text-lead text-white/90">
            Consulta tus cuentas, saldos y movimientos desde donde estés, sin hacer colas.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 text-ink sm:p-8">
          <Logo className="mb-5 h-10" />
          <h2 className="text-h3 font-bold">Ingresa a tu banca por internet</h2>
          <p className="mt-2 mb-6 text-sm text-muted">
            Te llevaremos a la página segura de inicio de sesión.
          </p>
          {autenticado ? (
            <Link to="/cuentas" className={`${boton.primario} w-full`}>
              Ir a mis cuentas
            </Link>
          ) : (
            <button className={`${boton.primario} w-full`} onClick={() => ingresar('/cuentas')}>
              Ingresar
            </button>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-[1.75rem] leading-tight font-black">¿Qué puedes hacer?</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {ACCIONES.map(({ icono: Icono, titulo, descripcion }) => (
            <li key={titulo} className={`flex items-start gap-4 p-6 ${tarjeta}`}>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-25">
                <Icono aria-hidden="true" className="size-6 text-green-600" />
              </span>
              <span>
                <span className="block font-bold">{titulo}</span>
                <span className="text-sm text-muted">{descripcion}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
