import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { useQueryClient } from '@tanstack/react-query';
import { EVENTO_SESION_EXPIRADA } from '../../services/api/httpClient';
import { SesionContext } from './sesionContext';

/**
 * Reacciona a la sesión vencida: borra el usuario y la caché de datos.
 * No redirige automáticamente al login para evitar un bucle si AM entrega
 * tokens que IG rechaza (por ejemplo, sin el scope cuentas.read).
 */
export function SesionProvider({ children }: { children: ReactNode }) {
  const { removeUser } = useAuth();
  const queryClient = useQueryClient();
  const [sesionExpirada, setSesionExpirada] = useState(false);

  useEffect(() => {
    const alExpirar = () => {
      setSesionExpirada(true);
      queryClient.clear();
      void removeUser();
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, [queryClient, removeUser]);

  const reiniciarSesion = useCallback(() => setSesionExpirada(false), []);
  const valor = useMemo(
    () => ({ sesionExpirada, reiniciarSesion }),
    [sesionExpirada, reiniciarSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
