import { Link } from 'react-router';
import { Aviso } from '../components/Aviso';
import { boton } from '../components/ui';

export function NotFoundPage() {
  return (
    <Aviso titulo="Página no encontrada">
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className={boton.secundario}>
        Volver al inicio
      </Link>
    </Aviso>
  );
}
