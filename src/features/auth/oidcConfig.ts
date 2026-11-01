import { User, WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';
import { env } from '../../config/env';

// Los tokens se guardan en sessionStorage: se pierden al cerrar la pestaña.
const almacenamiento = window.sessionStorage;

/**
 * Configuración OIDC: Authorization Code + PKCE (oidc-client-ts genera el
 * code_verifier/code_challenge automáticamente con response_type "code").
 * No hay client secret: el cliente en AM es público.
 */
export const oidcConfig: AuthProviderProps = {
  authority: env.oidcAuthority,
  client_id: env.oidcClientId,
  redirect_uri: env.oidcRedirectUri,
  post_logout_redirect_uri: env.oidcPostLogoutRedirectUri,
  scope: env.oidcScope,
  response_type: 'code',
  userStore: new WebStorageStateStore({ store: almacenamiento }),
  // Sin renovación silenciosa: al vencer el token se pide volver a ingresar
  automaticSilentRenew: false,
  // Quita ?code=...&state=... de la URL al volver de AM
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

/**
 * Lee el access token guardado por oidc-client-ts fuera de React (lo usa el
 * cliente HTTP). La clave sigue el formato oidc.user:<authority>:<client_id>.
 */
export function obtenerAccessToken(): string | undefined {
  const guardado = almacenamiento.getItem(`oidc.user:${env.oidcAuthority}:${env.oidcClientId}`);
  if (!guardado) return undefined;
  const usuario = User.fromStorageString(guardado);
  return usuario.expired ? undefined : usuario.access_token;
}
