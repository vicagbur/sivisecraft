// ============================================================================
// SIVISECRAFT — Cloudflare Worker Hardened (Static Assets + Stripe Checkout API)
// Ruta: POST /api/checkout
// Seguridad:
//   - Validación autoritativa de precios y envíos en servidor (Anti-Tampering)
//   - Validación estricta de Origin / CORS y URLs de retorno (Anti Open-Redirect)
//   - Cabeceras HTTP de seguridad (HSTS, X-Frame-Options, nosniff, Referrer-Policy)
//   - Validación de cantidades y sanitización de errores en producción
// ============================================================================

const ALLOWED_ORIGINS = new Set([
    "https://www.sivisecraft.es",
    "https://sivisecraft.es",
    "http://localhost:8787",
    "http://127.0.0.1:8787",
    "http://localhost:8080",
    "http://127.0.0.1:8080"
]);

const FREE_SHIPPING_THRESHOLD_CENTS = 4500; // 45,00 €

// Catálogo autoritativo de precios en céntimos (EUR) — sincronizado con web/data.js
const AUTHORITATIVE_CATALOG = {
    exp_tinytan_7: {
        name: "Expositor Colección Tiny Tan McDonald's (7 Figuras)",
        baseCents: 1800,
        resolveVariantCents: (meta) => {
            const m = String(meta || "").toLowerCase();
            if (m.includes("pack ahorro 2") || m.includes("32,00") || m.includes("pack x2")) return 3200;
            return 1800;
        }
    },
    exp_dragon_ball: { name: "Expositor Dragon Ball Burger King con Luz LED", baseCents: 1600 },
    exp_mandalorian: { name: "Expositor The Mandalorian & Grogu (Star Wars)", baseCents: 2000 },
    exp_stranger_things: { name: "Expositor Stranger Things 'Welcome to Hawkins' McDonald's", baseCents: 2250 },
    exp_stitch: { name: "Expositor Stitch Burger King", baseCents: 1500 },
    adviento_derpy: {
        name: "Calendario de Adviento / Joyero Derpy (K-Pop Demon Hunters)",
        baseCents: 4000,
        resolveVariantCents: (meta) => {
            const m = String(meta || "").toLowerCase();
            if (m.includes("24 sorpresas") || m.includes("45,00")) return 4500;
            return 4000;
        }
    },
    exp_mariokart: { name: "Expositor Colección Completa Mario Kart McDonald's (10 Coches)", baseCents: 1600 },
    exp_friends: { name: "Expositor Muñecos de Friends McDonald's (Puerta de Mónica)", baseCents: 2000 },
    exp_minecraft: { name: "Expositor Colección Minecraft McDonald's (6 Figuras)", baseCents: 1500 },
    exp_miercoles: { name: "Expositor Miércoles (Wednesday Addams • Ataúd Nevermore)", baseCents: 1800 },
    exp_tinytan_ind: { name: "Expositor Individual Tiny Tan BTS McDonald's", baseCents: 600 },
    lampara_meninas: { name: "Lámpara Litofanía 'Las Meninas' de Velázquez (25x25 cm LED)", baseCents: 4000 },
    reloj_toystory: { name: "Reloj de Pared Inspirado en Toy Story (Habitación de Andy)", baseCents: 1800 }
};

function getSecurityHeaders(corsOrigin) {
    const headers = {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    };
    if (corsOrigin) {
        headers["Access-Control-Allow-Origin"] = corsOrigin;
        headers["Vary"] = "Origin";
    }
    return headers;
}

function resolveAllowedOrigin(request) {
    const origin = request.headers.get("Origin");
    if (!origin) return null;
    if (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".workers.dev") || origin.endsWith(".pages.dev")) {
        return origin;
    }
    return null;
}

function resolveSafeBaseUrl(request) {
    const reqOrigin = new URL(request.url).origin;
    if (ALLOWED_ORIGINS.has(reqOrigin) || reqOrigin.endsWith(".workers.dev") || reqOrigin.endsWith(".pages.dev")) {
        return reqOrigin;
    }
    return "https://www.sivisecraft.es";
}

const COUNTRY_TO_TIER = {
    ES: "espana",
    DE: "ue", AT: "ue", BE: "ue", DK: "ue", FR: "ue", GR: "ue", IE: "ue",
    IT: "ue", LU: "ue", NL: "ue", PL: "ue", PT: "ue", CZ: "ue", RO: "ue",
    SE: "ue", EU_OTHER: "ue",
    FI: "finlandia",
    US: "usa",
    MX: "mexico",
    AU: "australia",
    PY: "paraguay",
    LATAM_OTHER: "paraguay"
};

function resolveShippingCents(shippingTierLabel, subtotalCents, shippingTierId, countryCode) {
    const code = String(countryCode || "").toUpperCase();
    const mappedTier = COUNTRY_TO_TIER[code] || "";
    const id = (mappedTier || String(shippingTierId || "")).toLowerCase();
    const label = String(shippingTierLabel || "").toLowerCase();

    // Paraguay / LATAM (60,00 €)
    if (id === "paraguay" || (!mappedTier && (label.includes("paraguay") || label.includes("latam")))) {
        return { cents: 6000, label: "🇵🇾 Paraguay / LATAM Certificado (60,00 €)", tierId: "paraguay" };
    }
    // USA (25,00 €)
    if (id === "usa" || (!mappedTier && (label.includes("estados unidos") || label.includes("usa") || label.includes("usps")))) {
        return { cents: 2500, label: "🇺🇸 Estados Unidos (USA) Tracked (25,00 €)", tierId: "usa" };
    }
    // México (25,00 €)
    if (id === "mexico" || (!mappedTier && (label.includes("méxico") || label.includes("mexico")))) {
        return { cents: 2500, label: "🇲🇽 México Internacional Certificado (25,00 €)", tierId: "mexico" };
    }
    // Australia (25,00 €)
    if (id === "australia" || (!mappedTier && label.includes("australia"))) {
        return { cents: 2500, label: "🇦🇺 Australia Tracked Shipping (25,00 €)", tierId: "australia" };
    }
    // Finlandia (20,00 €)
    if (id === "finlandia" || (!mappedTier && (label.includes("finlandia") || label.includes("finland")))) {
        return { cents: 2000, label: "🇫🇮 Finlandia Certificado (20,00 €)", tierId: "finlandia" };
    }
    // Unión Europea (15,00 €, Gratis > 90 €)
    if (id === "ue" || (!mappedTier && (label.includes("unión europea") || label.includes("europe") || label.includes("ue") || label.includes("eu")))) {
        if (subtotalCents >= 9000) {
            return { cents: 0, label: "🇪🇺 Unión Europea Certificado (GRATIS >90€)", tierId: "ue" };
        }
        return { cents: 1500, label: "🇪🇺 Unión Europea Certificado (15,00 €)", tierId: "ue" };
    }
    // España a Domicilio con Correos (6,00 €, Gratis > 45 €)
    if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
        return { cents: 0, label: "🚚 Envío a Domicilio con Correos (GRATIS >45€)", tierId: "espana" };
    }
    return { cents: 600, label: "🚚 Envío a Domicilio con Correos (España)", tierId: "espana" };
}

function lookupCatalogProduct(item) {
    if (item?.id && AUTHORITATIVE_CATALOG[item.id]) {
        return AUTHORITATIVE_CATALOG[item.id];
    }
    // Fallback por nombre exacto si algún cliente antiguo no envía id
    const targetName = String(item?.name || "").trim().toLowerCase();
    for (const prod of Object.values(AUTHORITATIVE_CATALOG)) {
        if (prod.name.toLowerCase() === targetName) return prod;
    }
    return null;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const corsOrigin = resolveAllowedOrigin(request);

        // Atajo directo a /admin -> sirve admin.html con cabeceras de noindex y no-store
        if (url.pathname === "/admin" || url.pathname === "/admin.html") {
            const assetReq = new Request(new URL("/admin.html", request.url), request);
            const assetResp = await env.ASSETS.fetch(assetReq);
            const hardenedResp = new Response(assetResp.body, assetResp);
            const secHeaders = getSecurityHeaders(null);
            Object.entries(secHeaders).forEach(([k, v]) => hardenedResp.headers.set(k, v));
            hardenedResp.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
            hardenedResp.headers.set("X-Robots-Tag", "noindex, nofollow");
            return hardenedResp;
        }

        // Endpoint de Telemetría sin cookies (Holding Analytics)
        if (url.pathname === "/api/telemetry") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);
            if (request.method !== "POST") return methodNotAllowed(corsOrigin);
            return handleTelemetry(request, env, corsOrigin);
        }

        // Endpoint de Eventos y Embudo (Holding Analytics)
        if (url.pathname === "/api/events") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);
            if (request.method !== "POST") return methodNotAllowed(corsOrigin);
            return handleEvents(request, env, corsOrigin);
        }

        // Panel de Control / Stats JSON (Protegido por ADMIN_KEY)
        if (url.pathname === "/api/admin/stats") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);
            return handleAdminStats(request, env, url, corsOrigin);
        }

        // Actualizar estado de un pedido desde /admin (Protegido por ADMIN_KEY)
        if (url.pathname === "/api/admin/order-status") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);
            if (request.method !== "POST") return methodNotAllowed(corsOrigin);
            return handleAdminOrderStatus(request, env, url, corsOrigin);
        }

        // Registro de pedidos directos (Bizum) + Notificaciones automáticas
        if (url.pathname === "/api/orders") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);
            if (request.method !== "POST") return methodNotAllowed(corsOrigin);
            return handleCreateOrder(request, env, ctx, corsOrigin);
        }

        // Webhook oficial de Stripe (confirmación automática de pagos + correos/push)
        if (url.pathname === "/api/stripe-webhook") {
            if (request.method !== "POST") return methodNotAllowed(null);
            return handleStripeWebhook(request, env, ctx);
        }

        // API Endpoint para Stripe Checkout
        if (url.pathname === "/api/checkout") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);

            if (request.method !== "POST") return methodNotAllowed(corsOrigin);

            return handleCheckout(request, env, ctx, corsOrigin);
        }

        // Servir archivos estáticos desde ./web añadiendo cabeceras de seguridad
        const assetResp = await env.ASSETS.fetch(request);
        const hardenedResp = new Response(assetResp.body, assetResp);
        const secHeaders = getSecurityHeaders(null);
        Object.entries(secHeaders).forEach(([k, v]) => hardenedResp.headers.set(k, v));

        // Si es la página de admin, asegurar noindex y no-store
        if (url.pathname.includes("admin")) {
            hardenedResp.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
            hardenedResp.headers.set("X-Robots-Tag", "noindex, nofollow");
        }

        return hardenedResp;
    }
};

function handleOptions(corsOrigin) {
    return new Response(null, {
        status: 204,
        headers: {
            ...getSecurityHeaders(corsOrigin),
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key"
        }
    });
}

function methodNotAllowed(corsOrigin) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) }
    });
}

async function handleCheckout(request, env, ctx, corsOrigin) {
    const jsonHeaders = { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) };

    try {
        const stripeSecretKey = env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            return new Response(
                JSON.stringify({
                    error: "STRIPE_NOT_CONFIGURED",
                    message: "Pasarela de pago temporalmente no disponible."
                }),
                { status: 503, headers: jsonHeaders }
            );
        }

        const body = await request.json();
        const {
            orderId,
            customer,
            countryCode,
            shippingTierLabel,
            shippingTierId,
            items
        } = body || {};

        if (!items || !Array.isArray(items) || items.length === 0 || items.length > 30) {
            return new Response(
                JSON.stringify({ error: "INVALID_CART", message: "Carrito vacío o inválido." }),
                { status: 400, headers: jsonHeaders }
            );
        }

        // Validación autoritativa de cada artículo contra el catálogo del servidor
        const verifiedItems = [];
        let subtotalCents = 0;

        for (const item of items) {
            const product = lookupCatalogProduct(item);
            if (!product) {
                return new Response(
                    JSON.stringify({ error: "UNKNOWN_PRODUCT", message: "Uno de los artículos del carrito no existe en el catálogo oficial." }),
                    { status: 400, headers: jsonHeaders }
                );
            }

            const qty = Number(item.qty);
            if (!Number.isInteger(qty) || qty < 1 || qty > 25) {
                return new Response(
                    JSON.stringify({ error: "INVALID_QUANTITY", message: "Cantidad de producto no válida (1 a 25 uds)." }),
                    { status: 400, headers: jsonHeaders }
                );
            }

            const unitAmountCents = product.resolveVariantCents
                ? product.resolveVariantCents(item.meta)
                : product.baseCents;

            subtotalCents += unitAmountCents * qty;
            verifiedItems.push({
                name: product.name,
                meta: String(item.meta || "").slice(0, 200),
                qty,
                unitAmountCents
            });
        }

        const verifiedShipping = resolveShippingCents(shippingTierLabel, subtotalCents, shippingTierId, countryCode || customer?.countryCode);
        const safeBaseUrl = resolveSafeBaseUrl(request);
        const safeOrderId = String(orderId || "SC-WEB").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "SC-WEB";

        // Construir parámetros form-urlencoded para la API oficial de Stripe Checkout Sessions
        const params = new URLSearchParams();
        params.append("mode", "payment");
        params.append("success_url", `${safeBaseUrl}/index.html?pago=ok&order=${encodeURIComponent(safeOrderId)}`);
        params.append("cancel_url", `${safeBaseUrl}/catalogo.html?checkout=true`);

        if (customer?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(customer.email))) {
            params.append("customer_email", String(customer.email).trim().slice(0, 120));
        }

        const summaryItems = verifiedItems
            .map(i => `${i.qty}x ${i.name}${i.meta ? ` [${i.meta}]` : ""}`)
            .join(" | ")
            .slice(0, 490);

        const metadata = {
            pedido_id: safeOrderId,
            cliente_nombre: String(customer?.name || "").slice(0, 120),
            cliente_telefono: String(customer?.phone || "").slice(0, 30),
            direccion_entrega: `${String(customer?.address || "")}, ${String(customer?.zip || "")} ${String(customer?.city || "")}`.slice(0, 250),
            modalidad_envio: verifiedShipping.label,
            notas_taller: String(customer?.notes || "Sin notas").slice(0, 250),
            resumen_articulos: summaryItems
        };

        Object.entries(metadata).forEach(([k, v]) => {
            params.append(`metadata[${k}]`, v);
            params.append(`payment_intent_data[metadata][${k}]`, v);
        });

        verifiedItems.forEach((item, index) => {
            params.append(`line_items[${index}][price_data][currency]`, "eur");
            params.append(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmountCents));
            params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            if (item.meta) {
                params.append(`line_items[${index}][price_data][product_data][description]`, item.meta);
            }
            params.append(`line_items[${index}][quantity]`, String(item.qty));
        });

        // Añadir el envío validado por el servidor
        const shippingIndex = verifiedItems.length;
        params.append(`line_items[${shippingIndex}][price_data][currency]`, "eur");
        params.append(`line_items[${shippingIndex}][price_data][unit_amount]`, String(verifiedShipping.cents));
        params.append(
            `line_items[${shippingIndex}][price_data][product_data][name]`,
            verifiedShipping.cents === 0 ? `Envío GRATIS — ${verifiedShipping.label}` : `Gastos de Envío — ${verifiedShipping.label}`
        );
        params.append(
            `line_items[${shippingIndex}][price_data][product_data][description]`,
            `Destino: ${metadata.direccion_entrega}`
        );
        params.append(`line_items[${shippingIndex}][quantity]`, "1");

        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${stripeSecretKey}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const sessionData = await stripeResponse.json();

        if (!stripeResponse.ok) {
            return new Response(
                JSON.stringify({
                    error: "STRIPE_API_ERROR",
                    message: "No se pudo iniciar la sesión de pago. Inténtalo de nuevo o usa Bizum."
                }),
                { status: 502, headers: jsonHeaders }
            );
        }

        // Registrar pedido pendiente de Stripe en D1 para que el webhook lo confirme automáticamente
        const orderRecord = {
            order_id: safeOrderId,
            status: "PENDIENTE_STRIPE",
            payment_method: "stripe",
            customer_name: String(customer?.name || "").slice(0, 120),
            customer_email: String(customer?.email || "").slice(0, 120),
            customer_phone: String(customer?.phone || "").slice(0, 40),
            country_code: String(countryCode || customer?.countryCode || "ES").toUpperCase().slice(0, 16),
            shipping_label: verifiedShipping.label,
            address: `${customer?.address || ""}, ${customer?.zip || ""} ${customer?.city || ""}`.trim().slice(0, 260),
            notes: String(customer?.notes || "").slice(0, 300),
            items_json: JSON.stringify(verifiedItems),
            subtotal_cents: subtotalCents,
            shipping_cents: verifiedShipping.cents,
            total_cents: subtotalCents + verifiedShipping.cents,
            stripe_session_id: String(sessionData.id || ""),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        if (ctx && typeof ctx.waitUntil === "function") {
            ctx.waitUntil(persistOrderRecord(env, orderRecord).catch(console.error));
        } else {
            await persistOrderRecord(env, orderRecord).catch(() => {});
        }

        return new Response(
            JSON.stringify({ url: sessionData.url, sessionId: sessionData.id }),
            { status: 200, headers: jsonHeaders }
        );
    } catch (_err) {
        return new Response(
            JSON.stringify({ error: "SERVER_ERROR", message: "Error procesando la solicitud de pago." }),
            { status: 500, headers: jsonHeaders }
        );
    }
}

// ============================================================================
// HOLDING ANALYTICS & TELEMETRÍA SIN COOKIES (0 €/mes · 100% RGPD)
// Fórmula Plausible: visitor_hash = SHA256(SALT + IP + UserAgent)[:16]
// ============================================================================

// Memoria efímera para fallback cuando Cloudflare D1 no está configurado aún
if (!globalThis.__HOLDING_TELEMETRY__) {
    globalThis.__HOLDING_TELEMETRY__ = {
        sessions: new Map(),
        events: []
    };
}

function recordInMemoryTelemetry(record) {
    const mem = globalThis.__HOLDING_TELEMETRY__;
    const existing = mem.sessions.get(record.session_id);
    if (existing) {
        existing.duration_sec = Math.max(existing.duration_sec, record.duration_sec);
        existing.updated_at = record.updated_at;
    } else {
        if (mem.sessions.size > 2000) {
            const firstKey = mem.sessions.keys().next().value;
            mem.sessions.delete(firstKey);
        }
        mem.sessions.set(record.session_id, { ...record });
    }
}

function recordInMemoryEvent(ev) {
    const mem = globalThis.__HOLDING_TELEMETRY__;
    if (mem.events.length > 5000) mem.events.shift();
    mem.events.push(ev);
}

let _tablesEnsured = false;
async function ensureTables(db) {
    if (_tablesEnsured || !db) return;
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS web_telemetry (
                session_id TEXT PRIMARY KEY,
                visitor_hash TEXT NOT NULL,
                path TEXT NOT NULL DEFAULT '/',
                referrer TEXT DEFAULT 'Directo / WhatsApp',
                device_type TEXT DEFAULT 'mobile',
                duration_sec INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `).run();

        await db.prepare(`CREATE INDEX IF NOT EXISTS idx_telemetry_visitor ON web_telemetry(visitor_hash)`).run();
        await db.prepare(`CREATE INDEX IF NOT EXISTS idx_telemetry_created ON web_telemetry(created_at)`).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_name TEXT NOT NULL,
                event_target TEXT DEFAULT '',
                created_at TEXT NOT NULL
            )
        `).run();

        await db.prepare(`CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name)`).run();
        await db.prepare(`CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at)`).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id TEXT PRIMARY KEY,
                status TEXT NOT NULL DEFAULT 'PENDIENTE_BIZUM',
                payment_method TEXT NOT NULL,
                customer_name TEXT NOT NULL,
                customer_email TEXT NOT NULL,
                customer_phone TEXT DEFAULT '',
                country_code TEXT DEFAULT 'ES',
                shipping_label TEXT DEFAULT '',
                address TEXT DEFAULT '',
                notes TEXT DEFAULT '',
                items_json TEXT NOT NULL,
                subtotal_cents INTEGER NOT NULL DEFAULT 0,
                shipping_cents INTEGER NOT NULL DEFAULT 0,
                total_cents INTEGER NOT NULL DEFAULT 0,
                stripe_session_id TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        `).run();

        await db.prepare(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)`).run();

        _tablesEnsured = true;
    } catch (err) {
        console.error("D1 ensureTables error:", err);
    }
}

async function calculateVisitorHash(request, env) {
    const salt = env.TELEMETRY_SALT || "sivisecraft-holding-telemetry-salt-2026";
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "127.0.0.1";
    const ua = request.headers.get("user-agent") || "unknown";
    const data = new TextEncoder().encode(salt + ":" + ip + ":" + ua);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    const hex = hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 16);
}

function detectDeviceType(ua) {
    const s = String(ua || "").toLowerCase();
    if (/android|iphone|ipad|mobile|ipod|blackberry|iemobile|opera mini/i.test(s)) {
        return "mobile";
    }
    return "desktop";
}

function cleanReferrer(ref) {
    if (!ref) return "Directo / WhatsApp";
    const s = String(ref).toLowerCase();
    if (s.includes("tarjeta")) return "Tarjeta QR Paquete";
    if (s.includes("wallapop")) return "Wallapop";
    if (s.includes("vinted")) return "Vinted";
    if (s.includes("etsy")) return "Etsy";
    if (s.includes("instagram")) return "Instagram";
    if (s.includes("tiktok")) return "TikTok";
    if (s.includes("google")) return "Google";
    if (s.includes("facebook") || s.includes("fb")) return "Facebook";
    if (s.includes("whatsapp") || s.includes("wa.me")) return "Directo / WhatsApp";
    try {
        const u = new URL(ref);
        return u.hostname.replace(/^www\./, "");
    } catch {
        return s.slice(0, 50);
    }
}

async function handleTelemetry(request, env, corsOrigin) {
    const jsonHeaders = { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) };
    try {
        const body = await request.json().catch(() => ({}));
        const { session_id, path, referrer, duration_sec } = body || {};
        if (!session_id || typeof session_id !== "string" || session_id.length > 64) {
            return new Response(JSON.stringify({ ok: false, error: "INVALID_SESSION" }), { status: 400, headers: jsonHeaders });
        }
        const ua = request.headers.get("user-agent") || "";
        const visitor_hash = await calculateVisitorHash(request, env);
        const device_type = detectDeviceType(ua);
        const cleanRef = cleanReferrer(referrer);
        const cleanPath = String(path || "/").slice(0, 160);
        const duration = Math.min(3600, Math.max(0, parseInt(duration_sec, 10) || 0));
        const now = new Date().toISOString();

        if (env.DB) {
            await ensureTables(env.DB);
            await env.DB.prepare(`
                INSERT INTO web_telemetry (session_id, visitor_hash, path, referrer, device_type, duration_sec, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    duration_sec = MAX(web_telemetry.duration_sec, excluded.duration_sec),
                    updated_at = excluded.updated_at
            `).bind(session_id, visitor_hash, cleanPath, cleanRef, device_type, duration, now, now).run();
        } else {
            recordInMemoryTelemetry({ session_id, visitor_hash, path: cleanPath, referrer: cleanRef, device_type, duration_sec: duration, created_at: now, updated_at: now });
        }

        return new Response(JSON.stringify({ ok: true, stored: Boolean(env.DB) }), { status: 200, headers: jsonHeaders });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: jsonHeaders });
    }
}

async function handleEvents(request, env, corsOrigin) {
    const jsonHeaders = { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) };
    try {
        const body = await request.json().catch(() => ({}));
        const { event_name, event_target } = body || {};
        if (!event_name || typeof event_name !== "string" || event_name.length > 64) {
            return new Response(JSON.stringify({ ok: false, error: "INVALID_EVENT" }), { status: 400, headers: jsonHeaders });
        }
        const cleanName = event_name.trim().slice(0, 64);
        const cleanTarget = String(event_target || "").trim().slice(0, 128);
        const now = new Date().toISOString();

        if (env.DB) {
            await ensureTables(env.DB);
            await env.DB.prepare(`
                INSERT INTO analytics_events (event_name, event_target, created_at)
                VALUES (?, ?, ?)
            `).bind(cleanName, cleanTarget, now).run();
        } else {
            recordInMemoryEvent({ event_name: cleanName, event_target: cleanTarget, created_at: now });
        }

        return new Response(JSON.stringify({ ok: true, stored: Boolean(env.DB) }), { status: 200, headers: jsonHeaders });
    } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: jsonHeaders });
    }
}

async function handleAdminStats(request, env, url, corsOrigin) {
    const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        ...getSecurityHeaders(corsOrigin)
    };

    const adminKey = env.ADMIN_KEY || "sivise2026";
    const providedKey = request.headers.get("X-Admin-Key") || url.searchParams.get("key");
    if (!providedKey || providedKey !== adminKey) {
        return new Response(JSON.stringify({ ok: false, error: "UNAUTHORIZED" }), { status: 401, headers: jsonHeaders });
    }

    if (env.DB) {
        await ensureTables(env.DB);
        try {
            const [
                totalPvRow,
                uniqVisRow,
                todayPvRow,
                todayUniqRow,
                returningRow,
                avgDurRow,
                byDeviceRows,
                bySourceRows,
                landingViewsRow,
                catalogViewsRow,
                detailViewsRow,
                cartAddRow,
                checkoutOpenRow,
                ordersRow,
                topProductsRows
            ] = await Promise.all([
                env.DB.prepare("SELECT COUNT(*) as c FROM web_telemetry").first(),
                env.DB.prepare("SELECT COUNT(DISTINCT visitor_hash) as c FROM web_telemetry").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM web_telemetry WHERE created_at >= date('now')").first(),
                env.DB.prepare("SELECT COUNT(DISTINCT visitor_hash) as c FROM web_telemetry WHERE created_at >= date('now')").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM (SELECT visitor_hash FROM web_telemetry GROUP BY visitor_hash HAVING COUNT(*) > 1)").first(),
                env.DB.prepare("SELECT ROUND(AVG(duration_sec)) as c FROM web_telemetry WHERE duration_sec > 0").first(),
                env.DB.prepare("SELECT device_type, COUNT(*) as count FROM web_telemetry GROUP BY device_type").all(),
                env.DB.prepare("SELECT referrer, COUNT(*) as count FROM web_telemetry GROUP BY referrer ORDER BY count DESC LIMIT 8").all(),
                env.DB.prepare("SELECT COUNT(*) as c FROM web_telemetry WHERE path = '/' OR path = '/index.html'").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM web_telemetry WHERE path LIKE '%catalogo%'").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event_name = 'view_product'").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event_name = 'add_to_cart'").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event_name = 'open_checkout'").first(),
                env.DB.prepare("SELECT COUNT(*) as c FROM analytics_events WHERE event_name = 'order_submitted'").first(),
                env.DB.prepare("SELECT event_target as name, COUNT(*) as count FROM analytics_events WHERE event_name IN ('view_product', 'add_to_cart') AND event_target != '' GROUP BY event_target ORDER BY count DESC LIMIT 6").all()
            ]);

            let recentOrders = [];
            try {
                const ordersRes = await env.DB.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 25").all();
                recentOrders = (ordersRes?.results || []).map(o => ({
                    ...o,
                    items: (() => { try { return JSON.parse(o.items_json || "[]"); } catch { return []; } })()
                }));
            } catch (_e) {}

            const totalVisitors = uniqVisRow?.c || 0;
            const returningVisitors = returningRow?.c || 0;
            const retentionPct = totalVisitors > 0 ? Math.round((returningVisitors / totalVisitors) * 1000) / 10 : 0;

            const byDevice = {};
            (byDeviceRows?.results || []).forEach(r => { byDevice[r.device_type] = r.count; });

            const bySource = {};
            (bySourceRows?.results || []).forEach(r => { bySource[r.referrer] = r.count; });

            return new Response(JSON.stringify({
                ok: true,
                project: "sivisecraft",
                storage: "d1",
                notifications_config: {
                    resend: Boolean(env.RESEND_API_KEY),
                    owner_email: Boolean(env.OWNER_EMAIL),
                    ntfy: Boolean(env.NTFY_TOPIC),
                    telegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
                    stripe_webhook: Boolean(env.STRIPE_WEBHOOK_SECRET)
                },
                recent_orders: recentOrders,
                traffic: {
                    total_pageviews: totalPvRow?.c || 0,
                    unique_visitors: totalVisitors,
                    today_pageviews: todayPvRow?.c || 0,
                    today_unique_visitors: todayUniqRow?.c || 0,
                    returning_visitors: returningVisitors,
                    retention_rate_pct: retentionPct,
                    avg_duration_sec: avgDurRow?.c || 0,
                    by_device: byDevice,
                    by_source: bySource,
                    funnel: {
                        landing_views: landingViewsRow?.c || 0,
                        catalog_views: catalogViewsRow?.c || 0,
                        detail_views: detailViewsRow?.c || 0,
                        cart_adds: cartAddRow?.c || 0,
                        checkout_opens: checkoutOpenRow?.c || 0,
                        orders_submitted: ordersRow?.c || 0
                    },
                    top_products: topProductsRows?.results || []
                }
            }), { status: 200, headers: jsonHeaders });
        } catch (err) {
            console.error("D1 query error, falling back to memory:", err);
        }
    }

    // In-memory fallback
    const mem = globalThis.__HOLDING_TELEMETRY__;
    const sessions = Array.from(mem.sessions.values());
    const events = mem.events;
    const nowIsoDate = new Date().toISOString().slice(0, 10);

    const totalPageviews = sessions.length;
    const uniqueHashes = new Set(sessions.map(s => s.visitor_hash));
    const uniqueVisitors = uniqueHashes.size;

    const todaySessions = sessions.filter(s => s.created_at.startsWith(nowIsoDate));
    const todayPageviews = todaySessions.length;
    const todayUniqueVisitors = new Set(todaySessions.map(s => s.visitor_hash)).size;

    const hashCounts = {};
    sessions.forEach(s => { hashCounts[s.visitor_hash] = (hashCounts[s.visitor_hash] || 0) + 1; });
    const returningVisitors = Object.values(hashCounts).filter(c => c > 1).length;
    const retentionPct = uniqueVisitors > 0 ? Math.round((returningVisitors / uniqueVisitors) * 1000) / 10 : 0;

    const validDurations = sessions.map(s => s.duration_sec).filter(d => d > 0);
    const avgDuration = validDurations.length > 0 ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length) : 0;

    const byDevice = { mobile: 0, desktop: 0 };
    sessions.forEach(s => { byDevice[s.device_type] = (byDevice[s.device_type] || 0) + 1; });

    const bySource = {};
    sessions.forEach(s => { bySource[s.referrer] = (bySource[s.referrer] || 0) + 1; });

    const funnel = {
        landing_views: sessions.filter(s => s.path === "/" || s.path === "/index.html").length,
        catalog_views: sessions.filter(s => s.path.includes("catalogo")).length,
        detail_views: events.filter(e => e.event_name === "view_product").length,
        cart_adds: events.filter(e => e.event_name === "add_to_cart").length,
        checkout_opens: events.filter(e => e.event_name === "open_checkout").length,
        orders_submitted: events.filter(e => e.event_name === "order_submitted").length
    };

    const prodCounts = {};
    events.filter(e => (e.event_name === "view_product" || e.event_name === "add_to_cart") && e.event_target).forEach(e => {
        prodCounts[e.event_target] = (prodCounts[e.event_target] || 0) + 1;
    });
    const topProducts = Object.entries(prodCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);

    return new Response(JSON.stringify({
        ok: true,
        project: "sivisecraft",
        storage: "in_memory (pendiente enlazar D1)",
        notifications_config: {
            resend: Boolean(env.RESEND_API_KEY),
            owner_email: Boolean(env.OWNER_EMAIL),
            ntfy: Boolean(env.NTFY_TOPIC),
            telegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
            stripe_webhook: Boolean(env.STRIPE_WEBHOOK_SECRET)
        },
        recent_orders: [],
        traffic: {
            total_pageviews: totalPageviews,
            unique_visitors: uniqueVisitors,
            today_pageviews: todayPageviews,
            today_unique_visitors: todayUniqueVisitors,
            returning_visitors: returningVisitors,
            retention_rate_pct: retentionPct,
            avg_duration_sec: avgDuration,
            by_device: byDevice,
            by_source: bySource,
            funnel,
            top_products: topProducts
        }
    }), { status: 200, headers: jsonHeaders });
}

// ============================================================================
// PERSISTENCIA DE PEDIDOS (D1) + WEBHOOK STRIPE + HOLDING NOTIFICATIONS ENGINE
// Skill: holding-notifications (Resend + ntfy.sh + Telegram · 0 €/mes)
// ============================================================================

function formatEurFromCents(cents) {
    return (Number(cents || 0) / 100).toFixed(2).replace(".", ",") + " €";
}

async function persistOrderRecord(env, order) {
    if (!env.DB) return false;
    await ensureTables(env.DB);
    await env.DB.prepare(`
        INSERT INTO orders (
            order_id, status, payment_method, customer_name, customer_email, customer_phone,
            country_code, shipping_label, address, notes, items_json,
            subtotal_cents, shipping_cents, total_cents, stripe_session_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(order_id) DO UPDATE SET
            status = excluded.status,
            stripe_session_id = CASE WHEN excluded.stripe_session_id != '' THEN excluded.stripe_session_id ELSE orders.stripe_session_id END,
            updated_at = excluded.updated_at
    `).bind(
        order.order_id,
        order.status,
        order.payment_method,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.country_code,
        order.shipping_label,
        order.address,
        order.notes,
        order.items_json,
        order.subtotal_cents,
        order.shipping_cents,
        order.total_cents,
        order.stripe_session_id || "",
        order.created_at,
        order.updated_at
    ).run();
    return true;
}

async function sendResendEmail(env, { to, subject, html, replyTo }) {
    if (!env.RESEND_API_KEY || !to) return { ok: false, skipped: "no_resend_key" };
    const from = env.NOTIFY_FROM_EMAIL || "SiviseCraft <pedidos@sivisecraft.es>";
    const payload = {
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
    };
    if (replyTo) payload.reply_to = replyTo;

    const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        console.error("Resend API error:", resp.status, txt);
        return { ok: false, status: resp.status };
    }
    return { ok: true };
}

async function sendNtfyAlert(env, { title, message, priority = "high", tags = "shopping_cart", clickUrl }) {
    if (!env.NTFY_TOPIC) return { ok: false, skipped: "no_ntfy_topic" };
    const base = (env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/+$/, "");
    const headers = {
        "Title": title || "Nuevo Pedido SiviseCraft",
        "Priority": priority,
        "Tags": tags
    };
    if (clickUrl) headers["Click"] = clickUrl;

    const resp = await fetch(`${base}/${encodeURIComponent(env.NTFY_TOPIC)}`, {
        method: "POST",
        headers,
        body: message
    });
    return { ok: resp.ok, status: resp.status };
}

async function sendTelegramAlert(env, htmlText) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        return { ok: false, skipped: "no_telegram_config" };
    }
    const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: htmlText,
            parse_mode: "HTML",
            disable_web_page_preview: true
        })
    });
    return { ok: resp.ok, status: resp.status };
}

function buildOrderEmailsAndPush(order, verifiedItems, isPaidStripe) {
    const totalStr = formatEurFromCents(order.total_cents);
    const subStr = formatEurFromCents(order.subtotal_cents);
    const shipStr = order.shipping_cents === 0 ? "GRATIS (0,00 €)" : formatEurFromCents(order.shipping_cents);
    const itemsHtml = verifiedItems.map(i => `
        <tr>
            <td style="padding:8px 0; border-bottom:1px solid #e2e8f0;">
                <strong>${i.qty}x ${i.name}</strong>${i.meta ? `<br><span style="font-size:12px; color:#64748b;">${i.meta}</span>` : ""}
            </td>
            <td style="padding:8px 0; border-bottom:1px solid #e2e8f0; text-align:right; font-weight:700;">
                ${formatEurFromCents(i.unitAmountCents * i.qty)}
            </td>
        </tr>
    `).join("");

    const bizumBanner = !isPaidStripe ? `
        <div style="background:#fef2f2; border:1.5px solid #f87171; color:#991b1b; padding:14px; border-radius:10px; margin:16px 0; font-size:14px;">
            <strong>⚠️ AVISO IMPORTANTE (PAGO POR BIZUM):</strong><br>
            Este pedido <strong>no se fabricará ni se enviará hasta la confirmación del pago por Bizum</strong> de <strong>${totalStr}</strong> al móvil <strong>681 01 59 83</strong> indicando en el concepto: <strong>${order.order_id}</strong>.
        </div>
    ` : `
        <div style="background:#ecfdf5; border:1.5px solid #34d399; color:#065f46; padding:14px; border-radius:10px; margin:16px 0; font-size:14px;">
            <strong>✅ PAGO CONFIRMADO POR STRIPE:</strong><br>
            Hemos recibido tu pago correctamente. Tu pedido ya está en nuestra cola de impresión 3D en Madrid.
        </div>
    `;

    const customerHtml = `
        <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:0 auto; color:#0f172a; background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; overflow:hidden;">
            <div style="background:#0f172a; color:#ffffff; padding:22px 24px;">
                <h1 style="margin:0; font-size:20px;">Sivise<span style="color:#ec4899;">Craft</span> · Pedido ${order.order_id}</h1>
                <p style="margin:6px 0 0; font-size:13px; color:#cbd5e1;">Taller Digital de Impresión 3D en Madrid</p>
            </div>
            <div style="padding:24px;">
                <p style="margin-top:0;">¡Hola <strong>${order.customer_name}</strong>!</p>
                <p>Gracias por confiar en SiviseCraft. Aquí tienes el resumen oficial de tu pedido:</p>
                ${bizumBanner}
                <table style="width:100%; border-collapse:collapse; margin:14px 0; font-size:14px;">
                    ${itemsHtml}
                    <tr>
                        <td style="padding:8px 0; color:#64748b;">Subtotal</td>
                        <td style="padding:8px 0; text-align:right;">${subStr}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px 0; color:#64748b;">Envío (${order.shipping_label})</td>
                        <td style="padding:8px 0; text-align:right;">${shipStr}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; font-size:16px; font-weight:800;">TOTAL</td>
                        <td style="padding:10px 0; text-align:right; font-size:16px; font-weight:800; color:#0d9488;">${totalStr}</td>
                    </tr>
                </table>
                <div style="background:#f8fafc; padding:12px 14px; border-radius:10px; font-size:13px; color:#334155;">
                    <strong>Dirección de entrega:</strong><br>
                    ${order.address}<br>
                    Tel: ${order.customer_phone}${order.notes ? `<br><strong>Notas:</strong> ${order.notes}` : ""}
                </div>
                <p style="font-size:12px; color:#64748b; margin-top:20px;">
                    ¿Alguna duda? Responde a este correo o escríbenos por WhatsApp al 681 01 59 83.
                </p>
            </div>
        </div>
    `;

    const statusBadge = isPaidStripe ? "✅ PAGADO (STRIPE)" : "⏳ PENDIENTE DE BIZUM";
    const ownerHtml = `
        <div style="font-family:Inter,Arial,sans-serif; max-width:600px; margin:0 auto; color:#0f172a;">
            <h2>🛒 Nuevo Pedido ${order.order_id} — ${statusBadge}</h2>
            <p><strong>Cliente:</strong> ${order.customer_name} (${order.customer_email} · ${order.customer_phone})</p>
            <p><strong>País / Envío:</strong> ${order.country_code} — ${order.shipping_label} (${shipStr})</p>
            <p><strong>Dirección:</strong> ${order.address}</p>
            ${order.notes ? `<p><strong>Notas:</strong> ${order.notes}</p>` : ""}
            <table style="width:100%; border-collapse:collapse; margin:12px 0;">
                ${itemsHtml}
            </table>
            <h3>Total: ${totalStr}</h3>
            <p><a href="https://www.sivisecraft.es/admin">Abrir Panel /admin de SiviseCraft &rarr;</a></p>
        </div>
    `;

    const itemsText = verifiedItems.map(i => `• ${i.qty}x ${i.name}${i.meta ? ` (${i.meta})` : ""}`).join("\n");
    const pushTitle = isPaidStripe
        ? `💰 Pedido PAGADO ${order.order_id} (${totalStr})`
        : `📱 Nuevo Pedido BIZUM ${order.order_id} (${totalStr})`;
    const pushBody = `Estado: ${statusBadge}\nCliente: ${order.customer_name} (${order.customer_phone})\nPaís: ${order.country_code} | ${order.address}\n\n${itemsText}`;

    return {
        customerSubject: isPaidStripe
            ? `✅ Confirmación de pago y pedido ${order.order_id} — SiviseCraft`
            : `📱 Pedido ${order.order_id} registrado (Pendiente de Bizum) — SiviseCraft`,
        customerHtml,
        ownerSubject: `[SiviseCraft] ${statusBadge} ${order.order_id} — ${totalStr} (${order.customer_name})`,
        ownerHtml,
        pushTitle,
        pushBody,
        pushTags: isPaidStripe ? "moneybag,white_check_mark" : "iphone,hourglass"
    };
}

async function dispatchOrderNotifications(env, order, verifiedItems, isPaidStripe) {
    const content = buildOrderEmailsAndPush(order, verifiedItems, isPaidStripe);
    const tasks = [];

    if (order.customer_email) {
        tasks.push(sendResendEmail(env, {
            to: order.customer_email,
            subject: content.customerSubject,
            html: content.customerHtml,
            replyTo: env.OWNER_EMAIL || undefined
        }));
    }
    if (env.OWNER_EMAIL) {
        tasks.push(sendResendEmail(env, {
            to: env.OWNER_EMAIL,
            subject: content.ownerSubject,
            html: content.ownerHtml,
            replyTo: order.customer_email || undefined
        }));
    }
    if (env.NTFY_TOPIC) {
        tasks.push(sendNtfyAlert(env, {
            title: content.pushTitle,
            message: content.pushBody,
            tags: content.pushTags,
            clickUrl: "https://www.sivisecraft.es/admin"
        }));
    }
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
        tasks.push(sendTelegramAlert(env, `<b>${content.pushTitle}</b>\n\n${content.pushBody}\n\n🔗 https://www.sivisecraft.es/admin`));
    }
    return Promise.allSettled(tasks);
}

async function handleCreateOrder(request, env, ctx, corsOrigin) {
    const jsonHeaders = { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) };
    try {
        const body = await request.json();
        const { orderId, customer, countryCode, shippingTierLabel, shippingTierId, items } = body || {};

        if (!items || !Array.isArray(items) || items.length === 0 || items.length > 30) {
            return new Response(JSON.stringify({ ok: false, error: "INVALID_CART" }), { status: 400, headers: jsonHeaders });
        }

        const verifiedItems = [];
        let subtotalCents = 0;
        for (const item of items) {
            const product = lookupCatalogProduct(item);
            if (!product) {
                return new Response(JSON.stringify({ ok: false, error: "UNKNOWN_PRODUCT" }), { status: 400, headers: jsonHeaders });
            }
            const qty = Number(item.qty);
            if (!Number.isInteger(qty) || qty < 1 || qty > 25) {
                return new Response(JSON.stringify({ ok: false, error: "INVALID_QUANTITY" }), { status: 400, headers: jsonHeaders });
            }
            const unitAmountCents = product.resolveVariantCents ? product.resolveVariantCents(item.meta) : product.baseCents;
            subtotalCents += unitAmountCents * qty;
            verifiedItems.push({ name: product.name, meta: String(item.meta || "").slice(0, 200), qty, unitAmountCents });
        }

        const verifiedShipping = resolveShippingCents(shippingTierLabel, subtotalCents, shippingTierId, countryCode || customer?.countryCode);
        const safeOrderId = String(orderId || ("SC-" + Math.floor(10000 + Math.random() * 90000))).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
        const now = new Date().toISOString();

        const orderRecord = {
            order_id: safeOrderId,
            status: "PENDIENTE_BIZUM",
            payment_method: "bizum",
            customer_name: String(customer?.name || "").slice(0, 120),
            customer_email: String(customer?.email || "").slice(0, 120),
            customer_phone: String(customer?.phone || "").slice(0, 40),
            country_code: String(countryCode || customer?.countryCode || "ES").toUpperCase().slice(0, 16),
            shipping_label: verifiedShipping.label,
            address: `${customer?.address || ""}, ${customer?.zip || ""} ${customer?.city || ""}`.trim().slice(0, 260),
            notes: String(customer?.notes || "").slice(0, 300),
            items_json: JSON.stringify(verifiedItems),
            subtotal_cents: subtotalCents,
            shipping_cents: verifiedShipping.cents,
            total_cents: subtotalCents + verifiedShipping.cents,
            stripe_session_id: "",
            created_at: now,
            updated_at: now
        };

        await persistOrderRecord(env, orderRecord);

        const notifyTask = dispatchOrderNotifications(env, orderRecord, verifiedItems, false).catch(console.error);
        if (ctx && typeof ctx.waitUntil === "function") {
            ctx.waitUntil(notifyTask);
        } else {
            await notifyTask;
        }

        return new Response(JSON.stringify({ ok: true, orderId: safeOrderId, stored: Boolean(env.DB) }), { status: 200, headers: jsonHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: jsonHeaders });
    }
}

async function verifyStripeWebhookSignature(payloadText, sigHeader, secret) {
    if (!sigHeader || !secret) return false;
    const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=")));
    const timestamp = parts.t;
    const expectedSig = parts.v1;
    if (!timestamp || !expectedSig) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payloadText}`));
    const computedHex = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
    return computedHex === expectedSig;
}

async function handleStripeWebhook(request, env, ctx) {
    const rawBody = await request.text();
    const sigHeader = request.headers.get("Stripe-Signature");

    if (env.STRIPE_WEBHOOK_SECRET) {
        const valid = await verifyStripeWebhookSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
        if (!valid) {
            return new Response(JSON.stringify({ ok: false, error: "INVALID_SIGNATURE" }), { status: 400 });
        }
    }

    let event;
    try {
        event = JSON.parse(rawBody);
    } catch {
        return new Response(JSON.stringify({ ok: false, error: "INVALID_JSON" }), { status: 400 });
    }

    if (event?.type === "checkout.session.completed") {
        const session = event.data?.object || {};
        const orderId = session.metadata?.order_id || "";
        const now = new Date().toISOString();

        if (env.DB && orderId) {
            await ensureTables(env.DB);
            const existing = await env.DB.prepare("SELECT * FROM orders WHERE order_id = ?").bind(orderId).first();
            if (existing) {
                await env.DB.prepare("UPDATE orders SET status = 'PAGADO_STRIPE', updated_at = ? WHERE order_id = ?").bind(now, orderId).run();
                const verifiedItems = (() => { try { return JSON.parse(existing.items_json || "[]"); } catch { return []; } })();
                const updatedOrder = { ...existing, status: "PAGADO_STRIPE", updated_at: now };
                const notifyTask = dispatchOrderNotifications(env, updatedOrder, verifiedItems, true).catch(console.error);
                if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(notifyTask);
            }
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}

async function handleAdminOrderStatus(request, env, url, corsOrigin) {
    const jsonHeaders = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        ...getSecurityHeaders(corsOrigin)
    };
    const adminKey = env.ADMIN_KEY || "sivise2026";
    const providedKey = request.headers.get("X-Admin-Key") || url.searchParams.get("key");
    if (!providedKey || providedKey !== adminKey) {
        return new Response(JSON.stringify({ ok: false, error: "UNAUTHORIZED" }), { status: 401, headers: jsonHeaders });
    }

    try {
        const { order_id, status } = await request.json();
        const allowedStatuses = new Set(["PENDIENTE_BIZUM", "PAGADO_BIZUM", "PAGADO_STRIPE", "EN_IMPRESION", "ENVIADO", "CANCELADO"]);
        if (!order_id || !allowedStatuses.has(status)) {
            return new Response(JSON.stringify({ ok: false, error: "INVALID_PARAMS" }), { status: 400, headers: jsonHeaders });
        }
        if (env.DB) {
            await ensureTables(env.DB);
            await env.DB.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE order_id = ?")
                .bind(status, new Date().toISOString(), order_id).run();
        }
        return new Response(JSON.stringify({ ok: true, order_id, status }), { status: 200, headers: jsonHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: jsonHeaders });
    }
}
