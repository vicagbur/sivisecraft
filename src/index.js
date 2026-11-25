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

function resolveShippingCents(shippingTierLabel, subtotalCents, shippingTierId) {
    const id = String(shippingTierId || "").toLowerCase();
    const label = String(shippingTierLabel || "").toLowerCase();

    // Paraguay / LATAM (60,00 €)
    if (id === "paraguay" || label.includes("paraguay") || label.includes("latam")) {
        return { cents: 6000, label: "🇵🇾 Paraguay / LATAM Certificado (60,00 €)" };
    }
    // USA (25,00 €)
    if (id === "usa" || label.includes("estados unidos") || label.includes("usa") || label.includes("usps")) {
        return { cents: 2500, label: "🇺🇸 Estados Unidos (USA) Tracked (25,00 €)" };
    }
    // México (25,00 €)
    if (id === "mexico" || label.includes("méxico") || label.includes("mexico")) {
        return { cents: 2500, label: "🇲🇽 México Internacional Certificado (25,00 €)" };
    }
    // Australia (25,00 €)
    if (id === "australia" || label.includes("australia")) {
        return { cents: 2500, label: "🇦🇺 Australia Tracked Shipping (25,00 €)" };
    }
    // Finlandia (20,00 €)
    if (id === "finlandia" || label.includes("finlandia") || label.includes("finland")) {
        return { cents: 2000, label: "🇫🇮 Finlandia Certificado (20,00 €)" };
    }
    // Unión Europea (15,00 €, Gratis > 90 €)
    if (id === "ue" || label.includes("unión europea") || label.includes("europe") || label.includes("ue") || label.includes("eu")) {
        if (subtotalCents >= 9000) {
            return { cents: 0, label: "🇪🇺 Unión Europea Certificado (GRATIS >90€)" };
        }
        return { cents: 1500, label: "🇪🇺 Unión Europea Certificado (15,00 €)" };
    }
    // España a Domicilio con Correos (6,00 €, Gratis > 45 €)
    if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
        return { cents: 0, label: "🚚 Envío a Domicilio con Correos (GRATIS >45€)" };
    }
    return { cents: 600, label: "🚚 Envío a Domicilio con Correos (España)" };
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

        // Atajo amigable a /admin -> /admin.html
        if (url.pathname === "/admin") {
            const redirectUrl = new URL("/admin.html", request.url);
            redirectUrl.search = url.search;
            return Response.redirect(redirectUrl.toString(), 302);
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

        // API Endpoint para Stripe Checkout
        if (url.pathname === "/api/checkout") {
            if (request.method === "OPTIONS") return handleOptions(corsOrigin);

            if (request.method !== "POST") return methodNotAllowed(corsOrigin);

            return handleCheckout(request, env, corsOrigin);
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

async function handleCheckout(request, env, corsOrigin) {
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

        const verifiedShipping = resolveShippingCents(shippingTierLabel, subtotalCents, shippingTierId);
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
        await db.exec(`
            CREATE TABLE IF NOT EXISTS web_telemetry (
                session_id TEXT PRIMARY KEY,
                visitor_hash TEXT NOT NULL,
                path TEXT NOT NULL DEFAULT '/',
                referrer TEXT DEFAULT 'Directo / WhatsApp',
                device_type TEXT DEFAULT 'mobile',
                duration_sec INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_telemetry_visitor ON web_telemetry(visitor_hash);
            CREATE INDEX IF NOT EXISTS idx_telemetry_created ON web_telemetry(created_at);

            CREATE TABLE IF NOT EXISTS analytics_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_name TEXT NOT NULL,
                event_target TEXT DEFAULT '',
                created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
            CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at);
        `);
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
