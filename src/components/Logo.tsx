import { Link } from 'react-router';

interface Props {
  /** Alto con clases de Tailwind; el ancho se ajusta solo (proporción 103×52). */
  className?: string;
  /** Si es true, el logo enlaza al inicio (uso en el header). */
  enlace?: boolean;
}

/**
 * Logo oficial de Mibanco (public/logo-mibanco.svg, entregado por el cliente).
 * Es verde y amarillo: úsalo solo sobre fondos claros (DESIGN.md §2).
 */
export function Logo({ className = 'h-12', enlace = false }: Props) {
  const imagen = (
    <img
      src="/logo-mibanco.svg"
      alt="Mibanco"
      width={103}
      height={52}
      className={`w-auto ${className}`}
    />
  );

  if (!enlace) return imagen;
  return (
    <Link to="/" aria-label="Mibanco, ir al inicio" className="inline-flex items-center">
      {imagen}
    </Link>
  );
}
