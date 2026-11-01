import { Aviso } from './Aviso';
import { boton } from './ui';

interface Props {
  titulo?: string;
  mensaje: string;
  onReintentar?: () => void;
}

/** Mensaje de error con botón opcional para reintentar. */
export function ErrorMessage({ titulo = 'Algo salió mal', mensaje, onReintentar }: Props) {
  return (
    <Aviso titulo={titulo} tipo="error">
      <p>{mensaje}</p>
      {onReintentar && (
        <button className={boton.secundario} onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </Aviso>
  );
}
