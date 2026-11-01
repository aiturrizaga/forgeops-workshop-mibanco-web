const REQUERIDAS = [
  'VITE_OIDC_AUTHORITY',
  'VITE_OIDC_CLIENT_ID',
  'VITE_OIDC_REDIRECT_URI',
  'VITE_OIDC_SCOPE',
  'VITE_API_BASE_URL',
] as const;

export const variablesFaltantes: string[] = REQUERIDAS.filter((nombre) => !import.meta.env[nombre]);

const leer = (nombre: (typeof REQUERIDAS)[number]): string => import.meta.env[nombre] ?? '';

export const env = {
  oidcAuthority: leer('VITE_OIDC_AUTHORITY'),
  oidcClientId: leer('VITE_OIDC_CLIENT_ID'),
  oidcRedirectUri: leer('VITE_OIDC_REDIRECT_URI'),
  oidcScope: leer('VITE_OIDC_SCOPE'),
  oidcPostLogoutRedirectUri:
    import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/`,
  apiBaseUrl: leer('VITE_API_BASE_URL').replace(/\/+$/, ''),
};
