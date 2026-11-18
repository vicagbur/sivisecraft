# SiviseCraft — Tienda Oficial (`www.sivisecraft.es`) y Ecosistema 3D

> **Propietario Técnico:** Antigravity (IA) • **Creador:** Víctor Aguado
> **Arquitectura:** 100% Código Nuestro (`HTML5 + CSS3 Taller Claro + JS Vanilla`), **Coste 0 €/mes**, sin Framer ni comisiones de plataforma.

---

## 1. Estado del Proyecto (Pomodoro 1 Completado ✅)

- [x] **Extracción de Datos Reales (`assets/etsy/` y `fotos/`):**
  - Importados todos los productos, descripciones, variantes y galerías de `EtsyListingsDownload.csv`.
  - Importadas las **12 reseñas verificadas reales** de `reviews.json` (con ID de pedido real, país y valoración).
  - Integradas las fotos reales locales de `Mandalorian & Grogu`, `Stranger Things (Welcome to Hawkins)`, `Tiny Tan BTS (con y sin nombres)`, `Minecraft`, `Miércoles (Nevermore)`, `Calendario de Adviento / Joyero Derpy (con vídeo)` y `Pichi Studio`.
- [x] **Tienda Oficial Completa en `c:\workspace\SIVISECRAFT\web\`:**
  - [index.html](file:///c:/workspace/SIVISECRAFT/web/index.html): Portada estética *Taller Claro*, escaparate interactivo 2x2, catálogo directo con selectores de variante y packs, muro de reseñas verificadas reales y cuadro de tarifas de envío.
  - [catalogo.html](file:///c:/workspace/SIVISECRAFT/web/catalogo.html): Buscador en tiempo real, filtros por colección, ordenación por precio, modal de galería multi-foto + vídeo y personalizador 3D del Rombo de Metro.
  - [data.js](file:///c:/workspace/SIVISECRAFT/web/data.js): Base de datos centralizada con las **17 referencias activas** (incluyendo *Dragon Ball BK Normal 16€ / Con Luz LED 14€*, *Stitch BK 15€*, *Mandalorian 20€*, *Stranger Things 22,50€*, *Tiny Tan 18€ / Pack 2 32€ / Pack 4 64€*, *Mario Kart 16€*, *Minecraft 15€*, *Friends 20€*, *Miércoles 18€*, *Calendario Derpy 40€/45€*, *Sonny Angels 18€*, *Lámpara Las Meninas 40€*, *Reloj Toy Story 18€*, etc.).
  - [style.css](file:///c:/workspace/SIVISECRAFT/web/style.css): Hoja de estilos *Taller Claro* optimizada para móvil y escritorio.
- [x] **Carrito Real por Tramos y Checkout Directo (Bizum 0% + Stripe):**
  - 📍 **Recogida en Madrid:** `0,00 €`
  - 📦 **Punto Pack / InPost (Península):** `3,95 €` (**GRATIS** en pedidos $\ge 45,00\text{ €}$)
  - 🚚 **Domicilio 24/48h (Península):** `4,95 €` (**GRATIS** en pedidos $\ge 45,00\text{ €}$)
  - 🌍 **Unión Europea Certificado:** `9,90 €`
  - Checkout con formulario completo de dirección, pago por **Bizum (0% comisión)** o **Tarjeta (Stripe)** y botón de confirmación directa por **WhatsApp**.

---

## 2. Cómo configurar tu teléfono real de Bizum / WhatsApp

Abre [data.js](file:///c:/workspace/SIVISECRAFT/web/data.js#L5-L18) y en las primeras líneas (`STORE_CONFIG`) pon tu número real en:
- `bizumPhone`: Tu móvil para recibir Bizum.
- `whatsappNumber`: Tu móvil con prefijo `34` (ej. `"34612345678"`) para que al pulsar *"Enviar Confirmación por WhatsApp"* te llegue el recibo completo del pedido a tu móvil.

---

## 3. Guía Paso a Paso: Publicar Gratis (0 €/mes) y Conectar `sivisecraft.es`

Ya he dejado el repositorio Git inicializado, limpio (con `.gitignore` para no subir los `.zip` gigantes de fotos en bruto), con el archivo [CNAME](file:///c:/workspace/SIVISECRAFT/web/CNAME) (`www.sivisecraft.es`) y el despliegue automático [deploy.yml](file:///c:/workspace/SIVISECRAFT/.github/workflows/deploy.yml) preparado.

### Paso 1: Subir el repositorio a tu cuenta de GitHub
1. Entra en [github.com/new](https://github.com/new) y crea un repositorio llamado **`sivisecraft`** (sin marcar *"Add a README"*).
2. En PowerShell (o pídemelo a mí cuando tengas la URL del repo), ejecuta:
   ```powershell
   cd c:\workspace\SIVISECRAFT
   git remote add origin https://github.com/TU_USUARIO/sivisecraft.git
   git push -u origin main
   ```

### Paso 2: Activar el Hosting Gratuito en GitHub Pages
1. En tu repositorio de GitHub, entra en **Settings** (pestaña superior) $\rightarrow$ **Pages** (menú izquierdo).
2. En **Build and deployment $\rightarrow$ Source**, selecciona **GitHub Actions**.
3. En menos de 1 minuto, la acción que he dejado en `.github/workflows/deploy.yml` publicará automáticamente la carpeta `web/`.
4. En esa misma pantalla (**Custom domain**), escribe **`www.sivisecraft.es`**, pulsa **Save** y marca la casilla **Enforce HTTPS** (certificado SSL gratuito).

### Paso 3: Conectar tu dominio `sivisecraft.es` (Quitar Framer y apuntar a nuestra web)
Entra en el panel DNS donde compraste el dominio **`sivisecraft.es`** (ej. DonDominio, Ionos, Arsys, GoDaddy, Namecheap o Cloudflare), **borra los registros antiguos de Framer** y deja exactamente estos registros DNS:

| Tipo | Host / Nombre | Valor / Destino | Propósito |
| :--- | :--- | :--- | :--- |
| **`A`** | `@` (o vacío) | `185.199.108.153` | Apunta `sivisecraft.es` a GitHub Pages |
| **`A`** | `@` (o vacío) | `185.199.109.153` | IP secundaria de respaldo |
| **`A`** | `@` (o vacío) | `185.199.110.153` | IP terciaria de respaldo |
| **`A`** | `@` (o vacío) | `185.199.111.153` | IP cuaternaria de respaldo |
| **`CNAME`** | `www` | `TU_USUARIO.github.io` | Apunta `www.sivisecraft.es` a tu tienda |
