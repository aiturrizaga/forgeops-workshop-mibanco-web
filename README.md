# MiBanco demo · Frontend (React + Vite)

SPA de banca genérica que inicia sesión en **Access Management** (OIDC Authorization Code +
PKCE) y consulta el API de cuentas a través de **PingGateway**.

La documentación de despliegue, configuración de AM, pruebas y diagnóstico está en el
repositorio hermano: `forgeops-workshop-backend/docs/`.

## Stack

- React 19 + TypeScript + Vite
- `react-oidc-context` / `oidc-client-ts`: login con PKCE, sin formularios propios
- React Router: rutas públicas (`/`, `/callback`) y protegidas (`/cuentas`, `/cuentas/:cuentaId`)
- TanStack Query: caché, estados de carga y error, y reintentos (solo red o 5xx)
- Tailwind CSS v4 (plugin `@tailwindcss/vite`): el tema, con el color `marca` y los
  colores `cargo` y `abono`, está en `src/styles/global.css` (`@theme`); no hay
  `tailwind.config.js`
- ESLint + Prettier (con `prettier-plugin-tailwindcss`, que ordena las clases)

**Estado:** la sesión viene de `useAuth()` (tokens en `sessionStorage`), los datos del
servidor de TanStack Query, y el filtro de movimientos es estado local. No hace falta Redux:
no hay estado global de cliente que compartir.

## Estructura

```
src/
  config/env.ts               variables VITE_* y validación
  services/api/               httpClient (Bearer, 401, errores de red) y errores
  features/auth/              configuración OIDC, RequireAuth, callback, sesión vencida, hooks
  features/cuentas/           tipos, api, hooks de TanStack Query, componentes y páginas
  components/                 Layout, Spinner, Aviso, ErrorMessage y ui.ts (clases Tailwind comunes)
  styles/global.css           @import 'tailwindcss' y tema (@theme)
  pages/                      inicio y 404
  routes/AppRoutes.tsx
```

**Sesión vencida:** cuando el API responde 401, `httpClient` emite un evento.
`SesionProvider` borra el usuario y la caché y muestra «Tu sesión venció» con un botón para
volver a ingresar. No redirige solo, para evitar un bucle si IG rechaza todos los tokens.

## Configuración

Copia `.env.example` a `.env` para desarrollo. Para la imagen, pasa las variables como
`--build-arg`: Vite las incrusta **en tiempo de build**, así que cambiar una exige
reconstruir. No contienen secretos.

```bash
npm ci
npm run dev        # http://localhost:5173 (registra http://localhost:5173/callback en AM)
npm run lint
npm run format
npm run build
```

## Docker y Kubernetes

- `Dockerfile` multi-stage: build con node y servido con `nginx-unprivileged` en el puerto
  8080, con fallback a `index.html`.
- `k8s/mibanco-web.yaml`: Deployment, Service e Ingress (clase `nginx`) para
  `mibanco.arvislab.com`, con certificado de `letsencrypt-prod`, en el namespace `lab`.

Comandos de build y despliegue: `forgeops-workshop-backend/docs/DESPLIEGUE.md`, pasos 4 y 7.
