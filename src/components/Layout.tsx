import { NavLink, Outlet } from 'react-router';
import { LogOut } from 'lucide-react';
import { useCerrarSesion, useEstaAutenticado, useNombreUsuario } from '../features/auth/hooks';
import { Logo } from './Logo';
import { Marquee } from './Marquee';
import { boton } from './ui';

/** Estructura común: header blanco (DESIGN.md §6.1), contenido, marquee y footer. */
export function Layout() {
  const autenticado = useEstaAutenticado();
  const nombre = useNombreUsuario();
  const cerrarSesion = useCerrarSesion();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2">
          <Logo enlace />
          {autenticado && (
            <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
              <NavLink
                to="/cuentas"
                end
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 font-bold ${isActive ? 'bg-green-25 text-green-700' : 'text-ink hover:text-green-600'}`
                }
              >
                Mis cuentas
              </NavLink>
              <span className="hidden max-w-44 truncate text-muted sm:inline" title={nombre}>
                {nombre}
              </span>
              <button className={boton.secundarioCompacto} onClick={cerrarSesion}>
                <LogOut aria-hidden="true" className="size-4" />
                Cerrar sesión
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16">
        <Outlet />
      </main>

      <Marquee />
      <footer className="bg-surface py-8 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-9" />
          </div>
          <span>Cuenta ficticia · Demo técnica</span>
        </div>
      </footer>
    </div>
  );
}
