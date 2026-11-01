import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import { Spinner } from '../../components/Spinner';
import { ErrorMessage } from '../../components/ErrorMessage';

interface EstadoLogin {
  returnTo?: string;
}

/**
 * Destino de redirect_uri. react-oidc-context canjea el código (con PKCE)
 * automáticamente; aquí solo se espera el resultado y se navega a returnTo.
 */
export function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading || auth.error) return;
    if (auth.isAuthenticated) {
      const estado = auth.user?.state as EstadoLogin | undefined;
      // Solo rutas internas, para no redirigir a otro sitio
      const destino = estado?.returnTo?.startsWith('/') ? estado.returnTo : '/cuentas';
      navigate(destino, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [auth.isLoading, auth.error, auth.isAuthenticated, auth.user, navigate]);

  if (auth.error) {
    return (
      <ErrorMessage
        titulo="No se pudo completar el inicio de sesión"
        mensaje={auth.error.message}
      />
    );
  }
  return <Spinner texto="Completando el inicio de sesión…" />;
}
