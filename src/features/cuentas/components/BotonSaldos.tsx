import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useSaldos } from '../saldosContext';

/**
 * Botón del ojo (sobre fondo verde). Mostrar = pedir los saldos al API;
 * ocultar = descartarlos de memoria.
 */
export function BotonSaldos() {
  const { visibles, alternar, cargando, error } = useSaldos();
  const Icono = cargando ? LoaderCircle : visibles ? EyeOff : Eye;

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={alternar}
        aria-pressed={visibles}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/50 bg-white/15 px-4 text-sm font-bold text-white transition-colors hover:bg-white/25"
      >
        <Icono aria-hidden="true" className={`size-5 ${cargando ? 'animate-spin' : ''}`} />
        {cargando ? 'Cargando saldos…' : visibles ? 'Ocultar saldos' : 'Mostrar saldos'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-white">
          No pudimos cargar tus saldos. Ocúltalos y vuelve a intentarlo.
        </p>
      )}
    </div>
  );
}
