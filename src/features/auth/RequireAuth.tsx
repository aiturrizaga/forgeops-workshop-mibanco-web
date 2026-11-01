import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAuth } from 'react-oidc-context';
import { Spinner } from '../../components/Spinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useEstaAutenticado, useIngresar } from './hooks';
import { useSesion } from './sesionContext';
import { SesionExpirada } from './SesionExpirada';

/** Protege las rutas hijas: sin sesión redirige al login de AM. */
export function RequireAuth() {
  const auth = useAuth();
  const autenticado = useEstaAutenticado();
  const { sesionExpirada } = useSesion();
  const ingresar = useIngresar();
  const location = useLocation();
  // Evita lanzar dos redirecciones (por ejemplo con StrictMode en desarrollo)
  const redirigiendo = useRef(false);

  const debeRedirigir =
    !auth.isLoading && !autenticado && !auth.activeNavigator && !auth.error && !sesionExpirada;

  useEffect(() => {
    if (debeRedirigir && !redirigiendo.current) {
      redirigiendo.current = true;
      ingresar(location.pathname + location.search);
    }
  }, [debeRedirigir, ingresar, location.pathname, location.search]);

  if (sesionExpirada) return <SesionExpirada />;
  if (auth.error) {
    return <ErrorMessage titulo="No se pudo iniciar sesión" mensaje={auth.error.message} />;
  }
  if (!autenticado) return <Spinner texto="Redirigiendo al inicio de sesión…" />;
  return <Outlet />;
}
