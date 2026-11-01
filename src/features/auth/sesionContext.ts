import { createContext, useContext } from 'react';

export interface SesionContextValue {
  /** true cuando el API respondió 401: se muestra un aviso en lugar de redirigir solo. */
  sesionExpirada: boolean;
  reiniciarSesion: () => void;
}

export const SesionContext = createContext<SesionContextValue | null>(null);

export function useSesion(): SesionContextValue {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de SesionProvider');
  return contexto;
}
