# DESIGN.md — Identidad visual Mibanco (web + App)

Guía para que Claude Code aplique la identidad visual de Mibanco a una web en **React + Tailwind CSS**.
Fuente principal: https://www.mibanco.com.pe/ y https://www.mibanco.com.pe/app-mibanco (revisadas el 31/10/2026).

---

## 0. Estado de verificación (leer primero)

No todos los tokens se pudieron leer del CSS en vivo. Cada valor de este documento lleva una etiqueta:

| Etiqueta             | Significado                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| ✅ **Verificado**    | Confirmado en el sitio oficial o en fuentes públicas del logo.                                          |
| 🟡 **Derivado**      | Calculado a partir de un valor verificado (escalas, variantes accesibles).                              |
| 🔴 **Por confirmar** | Estimación razonable. Claude Code debe confirmarlo con el script del paso 0.1 antes de darlo por bueno. |

### 0.1 Tarea obligatoria para Claude Code: extraer los tokens reales

Antes de tocar componentes, ejecuta este script y **actualiza las secciones 3, 4 y 6** con los valores reales. Si un valor real difiere del de este documento, gana el valor real.

```bash
npm i -D playwright && npx playwright install chromium
node scripts/extract-mibanco-tokens.mjs > mibanco-tokens.json
```

```js
// scripts/extract-mibanco-tokens.mjs
import { chromium } from 'playwright';

const URLS = ['https://www.mibanco.com.pe/', 'https://www.mibanco.com.pe/app-mibanco'];
const browser = await chromium.launch();
const out = {};

for (const url of URLS) {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    out[`${url}@${width}`] = await page.evaluate(() => {
      const pick = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        return {
          text: el.textContent.trim().slice(0, 40),
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          color: s.color,
          background: s.backgroundColor,
          backgroundImage: s.backgroundImage,
          borderRadius: s.borderRadius,
          border: s.border,
          boxShadow: s.boxShadow,
          padding: s.padding,
          height: s.height,
        };
      };
      const all = (sel) => [...document.querySelectorAll(sel)].slice(0, 6).map(pick);

      // Colores más usados en todo el DOM
      const counts = {};
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        for (const c of [s.color, s.backgroundColor, s.borderTopColor]) {
          if (c && c !== 'rgba(0, 0, 0, 0)') counts[c] = (counts[c] || 0) + 1;
        }
      }
      const topColors = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30);

      // Variables CSS declaradas en :root
      const rootVars = {};
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText === ':root') {
              for (const prop of rule.style)
                if (prop.startsWith('--'))
                  rootVars[prop] = rule.style.getPropertyValue(prop).trim();
            }
          }
        } catch {
          /* hojas cross-origin */
        }
      }

      return {
        fontsLoaded: [...document.fonts].map(
          (f) => `${f.family} ${f.weight} ${f.style} ${f.status}`,
        ),
        body: pick(document.body),
        h1: all('h1'),
        h2: all('h2'),
        h3: all('h3'),
        p: all('p'),
        header: pick(document.querySelector('header')),
        buttons: all('a[href*="solicita"], a[href*="ahorros"], button'),
        inputs: all('input'),
        cards: all('[class*="card"]'),
        footer: pick(document.querySelector('footer')),
        topColors,
        rootVars,
      };
    });
    await page.close();
  }
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
```

Con el resultado:

1. Reemplaza la paleta 🔴 de la sección 3 por los colores dominantes reales (top de `topColors` y `rootVars`).
2. Identifica la familia tipográfica real en `fontsLoaded` / `body.fontFamily` y aplica la regla de la sección 4.2.
3. Ajusta radios, sombras, alturas de botón e inputs de la sección 6.
4. Toma capturas a 375 px y 1440 px (`page.screenshot`) y compáralas con tu implementación.

### 0.2 Resultado de la extracción (01/11/2026) ✅

Se ejecutó la misma lógica del script 0.1 directamente en el navegador sobre
`https://www.mibanco.com.pe/` (1440 px), sin instalar Playwright en el proyecto. El sitio
usa Bootstrap con variables propias `--bs-mibanco-*` y `--bs-primary-*`. **Estos valores
reemplazan a los 🔴 y 🟡 anteriores**; las secciones 3, 4, 6 y 9 ya están actualizadas.

| Dato                                                  | Valor real                                                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Fuente de cuerpo, H2, botones y menú                  | **Lato** 400 / 700 / 900                                                                                            |
| Fuente del H1 del hero                                | **Brevia** 700 (58 px)                                                                                              |
| Verde primario (`--bs-primary` = `mibanco-green-500`) | `#009330`                                                                                                           |
| Verde del logo (`--bs-mibanco-green`)                 | `#71B74C`                                                                                                           |
| Amarillo (`--bs-secondary` = `mibanco-yellow`)        | `#FFCE00`                                                                                                           |
| Texto principal                                       | `#1C1C1F`                                                                                                           |
| Texto secundario                                      | `#656D78` / `#434A54`                                                                                               |
| Bordes                                                | `#E6E9ED` (cards), `#AAB2BD` (inputs), `#CCD1D9`                                                                    |
| Superficie gris (footer, ítems de menú)               | `#F6F8FA`                                                                                                           |
| Error                                                 | `#CF2A34`                                                                                                           |
| Header                                                | blanco, 64 px, sin sombra; logo de 48 px de alto                                                                    |
| Botón primario                                        | píldora (`border-radius: 800px`), relleno `#009330`, texto blanco Lato 700 16 px, padding 16×32 px (~56 px de alto) |
| Botón secundario                                      | píldora, borde 1.6 px `#008029`, texto `#008029`                                                                    |
| Tarjeta de acceso rápido                              | radio 24 px, borde 1.6 px `#E6E9ED`, padding 32×24 px                                                               |
| Card del hero (DNI)                                   | radio 24 px, fondo blanco                                                                                           |
| Input                                                 | 56 px de alto, borde `#AAB2BD`, radio 12 px                                                                         |
| Footer                                                | fondo claro `#F6F8FA` (no verde oscuro)                                                                             |

---

## 1. Esencia de marca

| Aspecto         | Definición                                                                                                                               | Estado                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Quién es        | "El banco de la microempresa en Perú". Créditos para negocio, ahorro, seguros y servicios para emprendedores.                            | ✅                                               |
| Respaldo        | Grupo Credicorp (logo de Credicorp en el footer).                                                                                        | ✅                                               |
| Concepto actual | **"Tu valentía tiene un banco"**. Se usa en el H1 del hero y como franja/marquee repetida antes del footer.                              | ✅                                               |
| Prueba social   | "+814 mil clientes ya crecieron con su préstamo", con testimonios de emprendedores reales (nombre, foto, negocio e ícono de verificado). | ✅                                               |
| Personalidad    | Cercana, optimista, orgullosa del emprendedor peruano, práctica. No aspiracional ni corporativa-fría.                                    | ✅ (inferida del copy y la historia de campañas) |
| App             | "App Mibanco", +1M de afiliados. Promesa: "Las operaciones que realizas en agencia, ahora desde tu celular".                             | ✅                                               |

**Regla de diseño derivada:** el protagonista visual es la persona emprendedora real y su negocio (fotografía), no ilustraciones abstractas ni gráficos financieros decorativos.

---

## 2. Logo

- Wordmark "Mibanco" en verde con acento amarillo. ✅
- El archivo oficial es un SVG servido desde el CDN de Modyo del banco. **No lo redibujes ni lo recrees en código**: usa el asset oficial entregado por el cliente en `/src/assets/brand/logo-mibanco.svg`. Si no lo tienes, deja un placeholder con el texto "Mibanco" y un `TODO`.
  - ✅ **Implementado:** el cliente entregó `public/logo-mibanco.svg` (103×52, verde `#009330` y amarillo `#FFCE00`) y `public/favicon.ico`. El componente `src/components/Logo.tsx` lo muestra en el header (48 px, enlaza al inicio), en la tarjeta de ingreso del inicio, en el footer y en la pantalla de configuración incompleta. Siempre sobre fondo claro.
- Altura de referencia en el header del sitio: el CDN lo sirve escalado a **80 px de alto máximo (2x)** → ~40 px renderizado. ✅ (parámetro `h=80` del CDN)
- Logo histórico (1998–2015) usaba Futura Extra Bold. **No es el logo actual**; no usar como referencia. ✅
- Área de protección: deja al menos la altura de la "M" alrededor del logo. 🟡
- Sobre fondo verde oscuro (footer): usar versión en blanco/monocromática si el cliente la provee. 🔴

> Nota legal: la marca Mibanco y su logo son propiedad de Mibanco – Banco de la Microempresa S.A. Este sistema es adecuado para un proyecto del propio banco o autorizado por él.

---

## 3. Color

### 3.1 Colores de marca

| Token                  | HEX       | Uso                                                                     | Estado                                           |
| ---------------------- | --------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| `green-500` (primario) | `#009330` | Color de identidad del sitio: íconos, bloques destacados, texto grande. | ✅ CSS del sitio                                 |
| `logo-green`           | `#71B74C` | Verde del wordmark. Solo para elementos gráficos, no para texto.        | ✅ CSS del sitio                                 |
| `yellow-500`           | `#FFCE00` | Acento: badges de tasa, resaltados, foco.                               | ✅ CSS del sitio                                 |
| `green-600`            | `#008029` | **Botones con texto blanco**, links y texto verde sobre blanco.         | ✅ CSS del sitio (lo usa en el botón secundario) |
| `green-900`            | `#003310` | Superficies oscuras con texto blanco (banda del marquee).               | ✅ CSS del sitio                                 |
| `green-50`             | `#D0F7DE` | Fondos suaves, chips, estados seleccionados.                            | ✅ CSS del sitio                                 |
| `yellow-50`            | `#FFFAE5` | Fondo de avisos o promociones suaves.                                   | ✅ CSS del sitio                                 |

> Los valores anteriores (`#00A651` y `#FFF200`) venían de un análisis del logo histórico
> y **no** coinciden con el CSS actual del sitio.

### 3.2 Reglas de contraste (WCAG 2.1 AA) — obligatorias

- **Blanco sobre `#009330` ≈ 4.0:1** → no llega a 4.5:1 para texto normal (el sitio lo usa
  igual en sus botones). En este proyecto los botones con texto blanco usan `#008029`
  (blanco sobre él ≈ 5.1:1) y `#006421` en hover.
- **Blanco sobre `#003310`** → contraste alto, apto para cualquier texto.
- **Amarillo `#FFCE00` nunca como color de texto sobre blanco** (contraste ≈ 1.5:1). El
  amarillo siempre lleva texto oscuro encima (`ink` o `green-900`).
- Texto verde sobre blanco: usa `#008029`, nunca `#009330`, para texto menor a 24 px.

### 3.3 Escala para Tailwind

```
green:  25 #ECF7F0 | 50 #D0F7DE | 100 #CCEAD6 | 200 #70C28B | 400 #33A95A
        500 #009330 (primario) | 600 #008029 | 700 #006421 | 800 #003310 | 900 #003310
yellow: 25 #FFFDF3 | 50 #FFFAE5 | 100 #FFF6CC | 200 #FFE580 | 300 #FFE266 | 400 #FFD833
        500 #FFCE00 (marca) | 600 #E5B800 | 700 #CCA500 | 800 #665200 | 900 #332A00
```

✅ Escalas tomadas de `--bs-primary-*` y `--bs-secondary-*` del sitio (en el sitio, 800 y
900 del verde tienen el mismo valor).

### 3.4 Neutros y semánticos

| Token         | HEX                               | Uso                                                | Estado              |
| ------------- | --------------------------------- | -------------------------------------------------- | ------------------- |
| `white`       | `#FFFFFF`                         | Fondo principal                                    | ✅                  |
| `surface`     | `#F6F8FA`                         | Fondo de secciones alternas, footer, ítems de menú | ✅                  |
| `line`        | `#E6E9ED`                         | Bordes de cards, divisores                         | ✅                  |
| `line-strong` | `#AAB2BD`                         | Bordes de inputs                                   | ✅                  |
| `muted`       | `#656D78`                         | Texto secundario, descripciones de menú            | ✅                  |
| `ink`         | `#1C1C1F`                         | Texto principal y titulares                        | ✅                  |
| `success`     | usar `green-600`                  | Confirmaciones ("¡Y listo!")                       | 🟡                  |
| `warning`     | `#B45309` texto / `#FEF3C7` fondo | Alertas                                            | 🟡                  |
| `danger`      | `#CF2A34` texto / `#FDECEA` fondo | Errores, cargos, SOS tarjeta                       | ✅ texto / 🟡 fondo |
| `info`        | `#1D5FA8` texto / `#E8F0FA` fondo | Información, seguridad                             | 🟡                  |

Proporción visual: ~70 % blanco/neutros, ~20 % verde, ≤ 10 % amarillo. El amarillo es un acento, nunca un fondo de página completa.

---

## 4. Tipografía

### 4.1 Lo verificado

- No fue posible leer la familia tipográfica desde el CSS en esta revisión. 🔴
- Lo que sí se observa en la jerarquía: H1 corto y emocional, H2 de sección como pregunta ("¿Por dónde empezamos?") o con cifra en negrita ("**+814 mil clientes** ya crecieron…"), y descripciones de una línea bajo cada ítem de menú. ✅

### 4.2 Regla de decisión para Claude Code

1. Ejecuta el script del paso 0.1 y lee `fontsLoaded` y `body.fontFamily`.
2. Si la familia es **de Google Fonts** (licencia abierta) → instálala con `@fontsource/<familia>` o Google Fonts y úsala tal cual.
3. Si es **propietaria o con licencia comercial** → no la descargues del CDN del banco. Pide los archivos `.woff2` al cliente y colócalos en `/public/fonts/`. Mientras tanto usa un sustituto según su estilo:
   - Geométrica/redondeada → `Nunito Sans` o `Plus Jakarta Sans`
   - Humanista → `Source Sans 3`
   - Grotesca neutra → `Inter`
4. Documenta la decisión en este archivo (sección 4.4).

### 4.3 Escala tipográfica (provisional, 🔴 ajustar con la extracción)

| Rol                 | Mobile | Desktop | Peso | Line-height | Clase Tailwind |
| ------------------- | ------ | ------- | ---- | ----------- | -------------- |
| Display / H1 hero   | 32 px  | 52 px   | 800  | 1.1         | `text-display` |
| H2 sección          | 26 px  | 36 px   | 700  | 1.2         | `text-h2`      |
| H3 card / bloque    | 20 px  | 24 px   | 700  | 1.3         | `text-h3`      |
| Lead / subtítulo    | 17 px  | 20 px   | 400  | 1.5         | `text-lead`    |
| Body                | 16 px  | 16 px   | 400  | 1.5         | `text-base`    |
| Small / descripción | 14 px  | 14 px   | 400  | 1.45        | `text-sm`      |
| Legal               | 12 px  | 12 px   | 400  | 1.4         | `text-xs`      |
| Botón               | 16 px  | 16 px   | 700  | 1           | —              |

Reglas:

- Una sola familia para todo (titulares y cuerpo), diferenciada por peso.
- Sentence case en todo: botones, menús, títulos. Nada en MAYÚSCULAS sostenidas.
- Cifras destacadas (montos, %, cantidad de clientes) en el peso más alto, en `neutral-900` o `green-700`.

### 4.4 Decisión final

- **Cuerpo, títulos y botones:** familia real = **Lato** (400, 700, 900); licencia = SIL
  Open Font License (Google Fonts); implementación = paquete `@fontsource/lato`, importado
  en `src/styles/global.css`. No se descarga nada del CDN del banco.
- **H1 del hero:** familia real = **Brevia** (700); licencia = comercial; implementación =
  mientras el cliente no entregue los `.woff2`, se usa **Lato 900** como sustituto. Cuando
  lleguen, colócalos en `/public/fonts/`, declara `@font-face` y define `--font-display`.

---

## 5. Voz y copy

| Regla                           | Ejemplo real del sitio/app                                                               | Estado |
| ------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| Tutea siempre                   | "Obtén créditos y beneficios para seguir creciendo"                                      | ✅     |
| Peruanismos cercanos            | "Efectivo Altoque", "Regístrate altoque", "obtén la descarga al toque"                   | ✅     |
| Beneficio primero, en una línea | "Usa solo lo que necesites y paga por lo que uses"                                       | ✅     |
| Cierre celebratorio en flujos   | "¡Y listo! Ya puedes compartir tu comprobante de pago"                                   | ✅     |
| Empatía con el dolor real       | "Estás aquí porque ya no quieres hacer colas"                                            | ✅     |
| CTAs con verbo de acción        | "Solicitar préstamo", "Abrir cuenta", "Conocer más", "Ver tutorial", "Abrir App Mibanco" | ✅     |
| Links "ver todo"                | "Ir a todos los Préstamos", "Ir a toda la Ayuda"                                         | ✅     |

Formatos:

- Moneda: `S/15,000` y `S/200,000` (sin espacio tras "S/", coma de miles). ✅
- Tasas: `4.5% TREA` (punto decimal). ✅
- Teléfono: `(01) 319-9999`. ✅
- Pasos de tutoriales: "Paso 1", "Paso 2"… (es una secuencia real, numerar es correcto). ✅

---

## 6. Componentes (patrones observados en la web)

### 6.1 Header

✅ Estructura: logo a la izquierda · nav (Inicio, Productos, Promociones, Aprendizaje, Ayuda) · buscador · dos CTAs a la derecha.

- CTA secundario: **"Abrir cuenta"** (outline o ghost verde).
- CTA primario: **"Solicitar préstamo"** (relleno verde `green-700`, texto blanco).
- En mobile, el menú pasa a drawer con navegación por niveles ("Volver a Productos") y los dos CTAs fijos abajo.
- 🔴 Header blanco, sticky, con sombra sutil al hacer scroll.

### 6.2 Mega menú "Productos"

✅ Cuatro categorías (Préstamos, Cuentas, Seguros, Servicios). Por categoría:

- Lista de productos: **nombre** (semibold) + **descripción de una línea** (`text-sm neutral-500`). Ej.: "Crédito Mujer — Para impulsar a más mujeres".
- Tarjeta promocional a la derecha con imagen (versión mobile y desktop), titular, subtítulo y link "Conocer más".
- Link al pie: "Ir a todos los …".

### 6.3 Buscador

✅ Overlay con "Accesos rápidos" (Todos los préstamos, Todas las cuentas, Contactar mi asesor, Centro de ayuda), bloque "¿En qué podemos ayudar?" y teléfono de contacto.

### 6.4 Hero

✅ Fotografía de emprendedor/a real (versión mobile 768×1024 y desktop), H1 "Tu valentía tiene un banco, Mibanco", subtítulo y una **card de captura de DNI** superpuesta:

- Titular: "Ingresa tu DNI y descubre lo que tenemos para ti".
- Input DNI (8 dígitos, `inputmode="numeric"`) + botón primario.
- Texto legal bajo el botón con link a políticas de privacidad.
- Paso 2 en modal: "¡Ya casi! confirmemos tu identidad" → tabs "DNI Azul" / "DNI electrónico" con imagen que indica dónde está el dígito verificador.

### 6.5 Accesos rápidos "¿Por dónde empezamos?"

✅ Grid de 4 acciones (2×2 en mobile, 4 en fila en desktop):
"Abrir cuenta de ahorro" (con badge amarillo "Hasta 4.5% TREA"), "Solicitar un préstamo", "Ubicar una agencia", "Descubre Mibanco por WhatsApp".
Cada acción: ícono + texto + toda la tarjeta clickeable.

### 6.6 Testimonios

✅ H2 con cifra en negrita. Carrusel de citas: texto entre comillas, foto circular, ícono de verificado, nombre y negocio ("Cevicheria 'El Rocoto'").

### 6.7 Marquee de marca

✅ Franja horizontal con "Tu valentía tiene un banco" repetido en bucle antes del footer. 🟡 Fondo `green-900` o `green-500` con texto grande. Respetar `prefers-reduced-motion` (detener animación).

### 6.8 Footer

✅ Columnas: Nosotros · Documentos de interés · Ayuda · Contáctanos · Síguenos (Facebook, Instagram, TikTok, LinkedIn, YouTube) · Descarga la App (QR + link).
Sellos: Credicorp, SOS Tarjeta, Sistema de denuncias, Libro de reclamaciones (obligatorio en Perú).
Línea legal final: © año, razón social, RUC y dirección.
✅ Fondo claro `#F6F8FA` con texto `ink` (verificado en el sitio; no es verde oscuro).

### 6.9 Tokens de forma (✅ extraídos del sitio)

| Token         | Valor                               | Uso                                       |
| ------------- | ----------------------------------- | ----------------------------------------- |
| `radius-sm`   | 8 px                                | ítems de menú, chips                      |
| `radius-md`   | 12 px                               | inputs                                    |
| `radius-lg`   | 24 px                               | cards, card del hero, modales             |
| `radius-full` | 9999 px                             | botones (píldora), badges                 |
| Borde de card | 1.6 px `#E6E9ED`, sin sombra        | cards de acceso rápido                    |
| `shadow-card` | `0 4px 16px rgb(0 51 16 / 0.08)` 🟡 | solo para cards elevadas sobre fondo gris |
| Altura botón  | ~56 px (padding 16×32 px)           | —                                         |
| Altura input  | 56 px                               | —                                         |

---

## 7. App Mibanco (identidad móvil)

✅ Verificado en la página oficial de la app y en las fichas de tiendas:

- Acciones principales en home: **Enviar a contacto**, **Pagar con QR**, **Transferir dinero**, **Cambiar dólares**.
- Funciones: consultar saldos y movimientos, transferir a cuentas propias, de terceros y a otros bancos (sin comisión hasta S/15,000), transferir a celular (Yape, Plin), pagar servicios, solicitar y pagar préstamos, desembolso de Efectivo Altoque, ubicar agencias.
- Seguridad: confirmación con **Token Digital** o código por correo; registro con DNI + tarjeta + clave + SMS.
- Pantallas descritas públicamente: lista de cuentas con saldos en soles, formulario de transferencia con selector de cuenta origen/destino y moneda, lista de préstamos con banner de desembolso inmediato.

🔴 No se pudieron inspeccionar capturas de la app en alta resolución. Si la web debe replicar la app (por ejemplo, un dashboard de cliente), aplica estos patrones y valida contra la app instalada:

- Saludo + resumen de cuentas arriba, en card con fondo verde o blanco.
- Fila de 4 accesos rápidos con ícono circular y etiqueta corta debajo.
- Flujos lineales de una decisión por pantalla, con resumen antes de confirmar y pantalla final de éxito con comprobante compartible.
- Montos grandes en el peso más alto; moneda (`S/` o `US$`) en tamaño menor al lado.

---

## 8. Iconografía e imágenes

- Fotografía: personas emprendedoras peruanas reales en su negocio, luz natural, expresión de orgullo. Evitar stock genérico de oficina. ✅ (hero y testimonios)
- Íconos: trazo lineal redondeado, un solo color (`green-700` o `neutral-900`). Recomendado: `lucide-react` mientras no haya set oficial. 🟡
- Ícono de verificado junto a testimonios reales. ✅

---

## 9. Implementación en Tailwind

### 9.1 Tailwind v4 (`src/index.css`)

> ⚠️ Este bloque es la propuesta **original**, anterior a la extracción. La implementación
> vigente, con los valores reales de la sección 0.2, está en `src/styles/global.css`.

```css
@import 'tailwindcss';

/* Fuente: reemplazar tras la extracción del paso 0.1 */
@import '@fontsource-variable/plus-jakarta-sans';

@theme {
  --font-sans: 'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif;

  --color-green-50: #e8f6ee;
  --color-green-100: #c6ead4;
  --color-green-200: #8fd5ab;
  --color-green-300: #52bf80;
  --color-green-400: #1faf62;
  --color-green-500: #00a651; /* marca */
  --color-green-600: #008f46;
  --color-green-700: #007a3d; /* botones y texto verde */
  --color-green-800: #00652f;
  --color-green-900: #00502a; /* footer / superficies oscuras */
  --color-green-950: #003a1e;

  --color-yellow-50: #fffde6;
  --color-yellow-100: #fffbcc;
  --color-yellow-200: #fff799;
  --color-yellow-300: #fff54d;
  --color-yellow-400: #fff200; /* marca */
  --color-yellow-500: #e6d900;
  --color-yellow-600: #b8ad00;

  --color-ink: #1f2422;
  --color-muted: #6b7270;
  --color-line: #e3e6e5;
  --color-surface: #f6f7f7;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --shadow-card: 0 4px 16px rgb(0 80 42 / 0.08);

  --text-display: 3.25rem;
  --text-display--line-height: 1.1;
  --text-h2: 2.25rem;
  --text-h2--line-height: 1.2;
  --text-h3: 1.5rem;
  --text-h3--line-height: 1.3;
  --text-lead: 1.25rem;
  --text-lead--line-height: 1.5;
}

@layer base {
  html {
    color: var(--color-ink);
    background: #fff;
  }
  :focus-visible {
    outline: 3px solid var(--color-yellow-400);
    outline-offset: 2px;
  }
}
```

### 9.2 Tailwind v3 (`tailwind.config.js`)

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        green: {
          50: '#E8F6EE',
          100: '#C6EAD4',
          200: '#8FD5AB',
          300: '#52BF80',
          400: '#1FAF62',
          500: '#00A651',
          600: '#008F46',
          700: '#007A3D',
          800: '#00652F',
          900: '#00502A',
          950: '#003A1E',
        },
        yellow: {
          50: '#FFFDE6',
          100: '#FFFBCC',
          200: '#FFF799',
          300: '#FFF54D',
          400: '#FFF200',
          500: '#E6D900',
          600: '#B8AD00',
        },
        ink: '#1F2422',
        muted: '#6B7270',
        line: '#E3E6E5',
        surface: '#F6F7F7',
      },
      borderRadius: { sm: '8px', md: '16px', lg: '24px' },
      boxShadow: { card: '0 4px 16px rgb(0 80 42 / 0.08)' },
    },
  },
};
```

### 9.3 Componentes base (referencia)

```jsx
// Botón primario
<a className="inline-flex h-12 items-center justify-center rounded-full bg-green-700 px-6 font-bold text-white transition-colors hover:bg-green-800 active:bg-green-900">
  Solicitar préstamo
</a>

// Botón secundario
<a className="inline-flex h-12 items-center justify-center rounded-full border-2 border-green-700 px-6 font-bold text-green-700 hover:bg-green-50">
  Abrir cuenta
</a>

// Badge de tasa
<span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold text-ink">Hasta 4.5% TREA</span>

// Input DNI
<label className="block text-sm font-semibold text-ink">
  DNI
  <input inputMode="numeric" maxLength={8} pattern="\d{8}"
    className="mt-1 h-14 w-full rounded-sm border border-line px-4 text-base focus:border-green-700 focus:ring-2 focus:ring-green-700/20" />
</label>
```

---

## 10. Checklist para Claude Code

- [ ] Ejecutar el script 0.1 y actualizar tokens 🔴 con valores reales.
- [ ] Resolver la fuente (sección 4.2) y registrar la decisión en 4.4.
- [ ] Usar el logo SVG oficial; no recrearlo.
- [ ] Botones con texto blanco en `green-700`, nunca en `green-500`.
- [ ] Amarillo solo como acento y siempre con texto oscuro encima.
- [ ] Copy en tuteo, sentence case, beneficio primero, formato `S/15,000`.
- [ ] Header con los dos CTAs ("Abrir cuenta" / "Solicitar préstamo").
- [ ] Footer con Libro de reclamaciones y línea legal.
- [ ] Foco visible, áreas táctiles ≥ 44 px, `prefers-reduced-motion` en el marquee y carruseles.
- [ ] Comparar capturas a 375 px y 1440 px contra el sitio oficial.
