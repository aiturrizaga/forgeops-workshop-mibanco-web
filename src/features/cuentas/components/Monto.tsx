import { formatearMonto, simboloMoneda } from '../../../utils/format';
import type { Moneda } from '../types';
import { useSaldos } from '../saldosContext';

interface Props {
  /** undefined mientras los saldos no se han pedido al API (o se están cargando). */
  valor: number | undefined;
  moneda: Moneda;
  /** Si es false, el monto oculto se muestra sin el símbolo de la moneda. */
  conSimbolo?: boolean;
}

/** Muestra un saldo pedido al API, o puntos mientras está oculto o cargando. */
export function Monto({ valor, moneda, conSimbolo = true }: Props) {
  const { visibles, cargando } = useSaldos();
  if (visibles && valor !== undefined) return <>{formatearMonto(valor, moneda)}</>;

  return (
    <>
      <span aria-hidden="true" className={cargando ? 'animate-pulse' : undefined}>
        {conSimbolo ? `${simboloMoneda(moneda)} ` : ''}
        <span className="tracking-widest">••••••</span>
      </span>
      <span className="sr-only">{cargando ? 'Cargando saldo' : 'Saldo oculto'}</span>
    </>
  );
}
