import type { ReactNode } from 'react';
import { CircleAlert, Info } from 'lucide-react';

interface Props {
  titulo: string;
  children: ReactNode;
  tipo?: 'info' | 'error';
}

/** Recuadro centrado para avisos (sesión vencida, errores, 404). */
export function Aviso({ titulo, children, tipo = 'info' }: Props) {
  const esError = tipo === 'error';
  const Icono = esError ? CircleAlert : Info;

  return (
    <section
      role={esError ? 'alert' : undefined}
      className={`mx-auto my-8 max-w-lg rounded-lg border-[1.6px] p-8 text-center ${esError ? 'border-danger/20 bg-danger-soft' : 'border-line bg-white'}`}
    >
      <Icono
        aria-hidden="true"
        className={`mx-auto mb-3 size-10 ${esError ? 'text-danger' : 'text-green-600'}`}
      />
      <h2 className="mb-2 text-h3 font-bold">{titulo}</h2>
      <div className="space-y-5 text-muted">{children}</div>
    </section>
  );
}
