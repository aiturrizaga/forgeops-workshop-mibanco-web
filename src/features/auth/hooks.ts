import { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';
import { useQueryClient } from '@tanstack/react-query';
import { useSesion } from './sesionContext';

/** Nombre a mostrar del usuario autenticado (claims del ID token / userinfo). */
export function useNombreUsuario(): string {
  const { user } = useAuth();
  const perfil = user?.profile;
  if (!perfil) return '';
  const nombreCompleto = [perfil.given_name, perfil.family_name].filter(Boolean).join(' ');
  return perfil.name || nombreCompleto || perfil.preferred_username || 'cliente';
}

/** true si hay usuario y su token no venció. */
export function useEstaAutenticado(): boolean {
  const auth = useAuth();
  return auth.isAuthenticated && !auth.user?.expired;
}

/** Redirige al login de AM y luego vuelve a returnTo. */
export function useIngresar() {
  const { signinRedirect } = useAuth();
  const { reiniciarSesion } = useSesion();
  return useCallback(
    (returnTo = '/cuentas') => {
      reiniciarSesion();
      void signinRedirect({ state: { returnTo } });
    },
    [signinRedirect, reiniciarSesion],
  );
}

/** Cierra la sesión en AM (end_session con id_token_hint) y limpia la caché. */
export function useCerrarSesion() {
  const { signoutRedirect } = useAuth();
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.clear();
    void signoutRedirect();
  }, [signoutRedirect, queryClient]);
}
