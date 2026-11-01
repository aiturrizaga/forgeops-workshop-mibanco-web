import { Route, Routes } from 'react-router';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { CallbackPage } from '../features/auth/CallbackPage';
import { RequireAuth } from '../features/auth/RequireAuth';
import { CuentasPage } from '../features/cuentas/pages/CuentasPage';
import { CuentaDetallePage } from '../features/cuentas/pages/CuentaDetallePage';

/** Rutas públicas (/, /callback) y protegidas (/cuentas, /cuentas/:cuentaId). */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="callback" element={<CallbackPage />} />
        <Route element={<RequireAuth />}>
          <Route path="cuentas" element={<CuentasPage />} />
          <Route path="cuentas/:cuentaId" element={<CuentaDetallePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
