import { env } from '../../config/env';
import { obtenerAccessToken } from '../../features/auth/oidcConfig';
import { ApiError, NetworkError } from './errors';

/** Evento global que escucha SesionProvider cuando el API responde 401. */
export const EVENTO_SESION_EXPIRADA = 'mibanco:sesion-expirada';

function notificarSesionExpirada(): void {
  window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
}

const MENSAJES: Record<number, string> = {
  401: 'Tu sesión venció. Vuelve a ingresar.',
  403: 'No tienes permiso para ver esta información.',
  404: 'No encontramos la información solicitada.',
};

/**
 * Cliente HTTP centralizado: agrega el Bearer token, traduce errores y avisa
 * cuando la sesión venció (401 de PingGateway).
 */
export async function apiGet<T>(ruta: string, signal?: AbortSignal): Promise<T> {
  const token = obtenerAccessToken();
  if (!token) {
    notificarSesionExpirada();
    throw new ApiError(MENSAJES[401]!, 401);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${env.apiBaseUrl}${ruta}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    // Una cancelación (TanStack Query aborta al desmontar) no es error de red
    if (signal?.aborted) throw error;
    throw new NetworkError();
  }

  if (respuesta.status === 401) notificarSesionExpirada();
  if (!respuesta.ok) {
    throw new ApiError(
      MENSAJES[respuesta.status] ??
        `Error del servidor (${respuesta.status}). Inténtalo más tarde.`,
      respuesta.status,
    );
  }
  return (await respuesta.json()) as T;
}
