/** Indicador de carga accesible. */
export function Spinner({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <div
      className="flex items-center justify-center gap-3 py-12 text-muted"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="size-6 animate-spin rounded-full border-3 border-line border-t-green-500"
      />
      <span>{texto}</span>
    </div>
  );
}
