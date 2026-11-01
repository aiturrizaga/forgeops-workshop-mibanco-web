import { Link } from 'react-router';
import { ChevronRight, CreditCard, PiggyBank } from 'lucide-react';
import { chip, tarjeta } from '../../../components/ui';
import { etiquetaTipoCuenta } from '../../../utils/format';
import type { Cuenta } from '../types';
import { useSaldos } from '../saldosContext';
import { Monto } from './Monto';

/** Tarjeta de resumen de una cuenta; toda la tarjeta enlaza a su detalle. */
export function CuentaCard({ cuenta }: { cuenta: Cuenta }) {
  const esTarjeta = cuenta.tipo === 'TARJETA_CREDITO';
  const Icono = esTarjeta ? CreditCard : PiggyBank;
  // Saldo pedido al API solo si el usuario pulsó «Mostrar saldos»
  const saldo = useSaldos().saldoDe(cuenta.id);

  return (
    <Link
      to={`/cuentas/${cuenta.id}`}
      className={`group flex flex-col p-6 transition-colors hover:border-green-500 ${tarjeta}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-full bg-green-25">
          <Icono aria-hidden="true" className="size-5 text-green-600" />
        </span>
        <span className={chip}>{cuenta.moneda}</span>
      </div>
      <p className="mt-4 text-sm text-muted">{etiquetaTipoCuenta(cuenta.tipo)}</p>
      <h3 className="text-lg font-bold">{cuenta.alias}</h3>
      <p className="mb-5 text-sm tracking-wide text-muted">{cuenta.numero_enmascarado}</p>
      <p className="text-sm text-muted">{esTarjeta ? 'Línea disponible' : 'Saldo disponible'}</p>
      <p className="text-[1.75rem] leading-tight font-black">
        <Monto valor={saldo?.saldo_disponible} moneda={cuenta.moneda} />
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="text-muted">
          Contable:{' '}
          <Monto valor={saldo?.saldo_contable} moneda={cuenta.moneda} conSimbolo={false} />
        </span>
        <span className="flex items-center font-bold text-green-600">
          Ver movimientos
          <ChevronRight
            aria-hidden="true"
            className="size-4 transition group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
