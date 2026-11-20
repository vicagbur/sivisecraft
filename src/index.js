// ============================================================================
// SIVISECRAFT — Cloudflare Worker con Static Assets + Stripe Checkout API
// Ruta: POST /api/checkout
// Variable de entorno requerida en Cloudflare: STRIPE_SECRET_KEY
// ============================================================================

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // API Endpoint para Stripe Checkout
        if (url.pathname === "/api/checkout") {
            if (request.method === "OPTIONS") {
                return new Response(null, {
                    status: 204,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    }
                });
            }

            if (request.method !== "POST") {
                return new Response(JSON.stringify({ error: "Method not allowed" }), {
                    status: 405,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return handleCheckout(request, env);
        }

        // Si no es un endpoint de API, servir los archivos estáticos desde ./web
        return env.ASSETS.fetch(request);
    }
};

async function handleCheckout(request, env) {
    try {
        const stripeSecretKey = env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            return new Response(
                JSON.stringify({
                    error: "STRIPE_NOT_CONFIGURED",
                    message: "Falta configurar STRIPE_SECRET_KEY en las Variables de Entorno de Cloudflare.",
                    availableEnvKeys: Object.keys(env || {})
                }),
                {
                    status: 501,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            );
        }

        const body = await request.json();
        const {
            orderId,
            customer,
            shippingTierLabel,
            shippingCost,
            items,
            originUrl
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return new Response(
                JSON.stringify({ error: "Carrito vacío" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const baseUrl = originUrl || new URL(request.url).origin;

        // Construir parámetros form-urlencoded para la API oficial de Stripe Checkout Sessions
        const params = new URLSearchParams();
        params.append("mode", "payment");
        params.append("success_url", `${baseUrl}/index.html?pago=ok&order=${encodeURIComponent(orderId || "SC")}`);
        params.append("cancel_url", `${baseUrl}/catalogo.html?checkout=true`);

        if (customer?.email) {
            params.append("customer_email", customer.email);
        }

        // Metadatos para que aparezcan en el panel de Stripe de SiviseCraft
        const summaryItems = items.map(i => `${i.qty}x ${i.name}${i.meta ? ` [${i.meta}]` : ""}`).join(" | ").slice(0, 490);

        const metadata = {
            pedido_id: orderId || "SC-WEB",
            cliente_nombre: customer?.name || "",
            cliente_telefono: customer?.phone || "",
            direccion_entrega: `${customer?.address || ""}, ${customer?.zip || ""} ${customer?.city || ""}`,
            modalidad_envio: shippingTierLabel || "",
            notas_taller: customer?.notes || "Sin notas",
            resumen_articulos: summaryItems
        };

        Object.entries(metadata).forEach(([k, v]) => {
            params.append(`metadata[${k}]`, String(v).slice(0, 500));
            params.append(`payment_intent_data[metadata][${k}]`, String(v).slice(0, 500));
        });

        // Añadir cada producto del carrito
        items.forEach((item, index) => {
            const unitAmountCents = Math.round(Number(item.price) * 100);
            params.append(`line_items[${index}][price_data][currency]`, "eur");
            params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmountCents));
            params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            if (item.meta) {
                params.append(`line_items[${index}][price_data][product_data][description]`, item.meta);
            }
            params.append(`line_items[${index}][quantity]`, String(item.qty));
        });

        // Añadir el envío
        const shippingIndex = items.length;
        const shippingCents = Math.round(Number(shippingCost || 0) * 100);
        params.append(`line_items[${shippingIndex}][price_data][currency]`, "eur");
        params.append(`line_items[${shippingIndex}][price_data][unit_amount]`, String(shippingCents));
        params.append(
            `line_items[${shippingIndex}][price_data][product_data][name]`,
            shippingCents === 0 ? `Envío GRATIS — ${shippingTierLabel}` : `Gastos de Envío — ${shippingTierLabel}`
        );
        params.append(
            `line_items[${shippingIndex}][price_data][product_data][description]`,
            `Destino: ${customer?.address || ""}, ${customer?.zip || ""} ${customer?.city || ""}`
        );
        params.append(`line_items[${shippingIndex}][quantity]`, "1");

        // Llamada a la API oficial de Stripe
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
                    message: sessionData?.error?.message || "Error creando sesión en Stripe"
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({ url: sessionData.url, sessionId: sessionData.id }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "SERVER_ERROR", message: err.message }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
    }
}
