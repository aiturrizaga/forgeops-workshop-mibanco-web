// Clases de Tailwind reutilizables con la identidad Mibanco (DESIGN.md §6 y §9.3).

const botonBase =
  'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-3 font-bold transition-colors';

export const boton = {
  // Texto blanco solo sobre green-600 o más oscuro (contraste AA, DESIGN.md §3.2)
  primario: `${botonBase} bg-green-600 text-white hover:bg-green-700`,
  secundario: `${botonBase} border-[1.6px] border-green-600 bg-white text-green-600 hover:bg-green-25`,
  // Botón compacto para el header
  secundarioCompacto:
    'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.6px] border-green-600 px-5 text-sm font-bold text-green-600 transition-colors hover:bg-green-25',
};

export const tarjeta = 'rounded-lg border-[1.6px] border-line bg-white';

export const chip =
  'inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700';
