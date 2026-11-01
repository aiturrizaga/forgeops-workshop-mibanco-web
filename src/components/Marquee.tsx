const LEMA = 'Tu valentía tiene un banco';

/**
 * Franja con el concepto de marca repetido antes del footer (DESIGN.md §6.7).
 * La animación solo corre si el usuario no pidió reducir movimiento.
 */
export function Marquee() {
  const repeticiones = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="overflow-hidden bg-green-900 py-4 text-white" aria-hidden="true">
      <div className="flex w-max motion-safe:animate-marquee">
        {[0, 1].map((grupo) => (
          <div key={grupo} className="flex shrink-0">
            {repeticiones.map((i) => (
              <span key={i} className="flex items-center gap-6 pr-6 text-xl font-black">
                {LEMA}
                <span className="size-2 rounded-full bg-yellow-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
