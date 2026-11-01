import { useLocation } from 'react-router';
import { Aviso } from '../../components/Aviso';
import { boton } from '../../components/ui';
import { useIngresar } from './hooks';

/** Aviso de sesión vencida con botón para volver a ingresar. */
export function SesionExpirada() {
  const ingresar = useIngresar();
  const location = useLocation();

  return (
    <Aviso titulo="Tu sesión venció" tipo="error">
      <p>Por seguridad, vuelve a ingresar para seguir consultando tus cuentas.</p>
      <button className={boton.primario} onClick={() => ingresar(location.pathname)}>
        Ingresar de nuevo
      </button>
    </Aviso>
  );
}
