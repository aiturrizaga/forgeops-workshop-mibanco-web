/** Error HTTP devuelto por el API (o por PingGateway). */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** No se pudo contactar al servidor (sin red, DNS, CORS rechazado, etc.). */
export class NetworkError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
    this.name = 'NetworkError';
  }
}

/** Solo se reintentan errores de red y 5xx; un 4xx no cambia al reintentar. */
export function esReintentable(error: unknown): boolean {
  if (error instanceof ApiError) return error.status >= 500;
  return true;
}
