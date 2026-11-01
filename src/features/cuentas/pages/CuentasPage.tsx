import { Spinner } from '../../../components/Spinner';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { useNombreUsuario } from '../../auth/hooks';
import { useCuentas } from '../hooks';
import { CuentaCard } from '../components/CuentaCard';
import { ResumenSaldos } from '../components/ResumenSaldos';

/** Resumen de cuentas y saldos del usuario autenticado. */
export function CuentasPage() {
  const nombre = useNombreUsuario();
  const { data: cuentas, isPending, error, refetch } = useCuentas();

  return (
    <>
      <ResumenSaldos nombre={nombre} cuentas={cuentas ?? []} />

      {isPending && <Spinner texto="Cargando tus cuentas…" />}
      {error && <ErrorMessage mensaje={error.message} onReintentar={() => void refetch()} />}

      {cuentas && cuentas.length === 0 && (
        <p className="py-6 text-center text-muted">
          No encontramos cuentas asociadas a tu usuario.
        </p>
      )}
      {cuentas && cuentas.length > 0 && (
        <section>
          <h2 className="mb-5 text-[1.75rem] leading-tight font-black">Tus productos</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
            {cuentas.map((cuenta) => (
              <CuentaCard key={cuenta.id} cuenta={cuenta} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
