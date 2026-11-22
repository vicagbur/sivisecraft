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

function resolveShippingCents(shippingTierLabel, subtotalCents) {
    const label = String(shippingTierLabel || "").toLowerCase();
    if (label.includes("unión europea") || label.includes("europe") || label.includes("eu")) {
        return { cents: 990, label: "🌍 Unión Europea Certificado (9,90 €)" };
    }
    if (subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
        const cleanLabel = label.includes("domicilio")
            ? "🚚 Domicilio 24/48h (Península)"
            : "📦 Punto Pack / InPost (Península)";
        return { cents: 0, label: cleanLabel };
    }
    if (label.includes("domicilio")) {
        return { cents: 495, label: "🚚 Domicilio 24/48h (Península)" };
    }
    return { cents: 395, label: "📦 Punto Pack / InPost (Península)" };
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

        // API Endpoint para Stripe Checkout
        if (url.pathname === "/api/checkout") {
            if (request.method === "OPTIONS") {
                return new Response(null, {
                    status: 204,
                    headers: {
                        ...getSecurityHeaders(corsOrigin),
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    }
                });
            }

            if (request.method !== "POST") {
                return new Response(JSON.stringify({ error: "Method not allowed" }), {
                    status: 405,
                    headers: { "Content-Type": "application/json", ...getSecurityHeaders(corsOrigin) }
                });
            }

            return handleCheckout(request, env, corsOrigin);
        }

        // Servir archivos estáticos desde ./web añadiendo cabeceras de seguridad
        const assetResp = await env.ASSETS.fetch(request);
        const hardenedResp = new Response(assetResp.body, assetResp);
        const secHeaders = getSecurityHeaders(null);
        Object.entries(secHeaders).forEach(([k, v]) => hardenedResp.headers.set(k, v));
        return hardenedResp;
    }
};

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

        const verifiedShipping = resolveShippingCents(shippingTierLabel, subtotalCents);
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
