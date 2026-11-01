import { tarjeta } from '../../../components/ui';

interface Props {
  etiqueta: string;
  valor: string;
  tono?: 'normal' | 'cargo' | 'abono';
}

const TONOS = { normal: 'text-ink', cargo: 'text-cargo', abono: 'text-abono' };

/** Recuadro con una etiqueta y un monto destacado. */
export function ResumenItem({ etiqueta, valor, tono = 'normal' }: Props) {
  return (
    <div className={`flex flex-1 basis-56 flex-col px-6 py-5 ${tarjeta}`}>
      <span className="text-sm text-muted">{etiqueta}</span>
      <strong className={`text-2xl font-black ${TONOS[tono]}`}>{valor}</strong>
    </div>
  );
}
