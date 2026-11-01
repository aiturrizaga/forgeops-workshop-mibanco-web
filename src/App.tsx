import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router';
import { oidcConfig } from './features/auth/oidcConfig';
import { SesionProvider } from './features/auth/SesionProvider';
import { SaldosProvider } from './features/cuentas/SaldosProvider';
import { esReintentable } from './services/api/errors';
import { AppRoutes } from './routes/AppRoutes';
import { variablesFaltantes } from './config/env';
import { Aviso } from './components/Aviso';
import { Logo } from './components/Logo';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Hasta 2 reintentos solo para errores de red o 5xx (nunca 401/403/404)
      retry: (intentos, error) => esReintentable(error) && intentos < 2,
    },
  },
});

export function App() {
  if (variablesFaltantes.length > 0) {
    // Fuera del router: el logo va sin enlace
    return (
      <div className="px-4 pt-8">
        <Logo className="mx-auto h-12" />
        <Aviso titulo="Configuración incompleta" tipo="error">
          <p>Faltan variables de entorno: {variablesFaltantes.join(', ')}. Revisa .env.example.</p>
        </Aviso>
      </div>
    );
  }

  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SesionProvider>
            <SaldosProvider>
              <AppRoutes />
            </SaldosProvider>
          </SesionProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}
