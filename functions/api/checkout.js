// ============================================================================
// SIVISECRAFT.ES — Cloudflare Pages Function (Opción B: Stripe Checkout Real)
// Ruta automática en Cloudflare Pages: POST /api/checkout
// Coste: 0 €/mes (hasta 100.000 peticiones/día gratis)
// Variable de entorno requerida en Cloudflare: STRIPE_SECRET_KEY (sk_live_...)
// ============================================================================

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const stripeSecretKey = env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            return new Response(
                JSON.stringify({
                    error: "STRIPE_NOT_CONFIGURED",
                    message: "Falta configurar STRIPE_SECRET_KEY en el panel de Cloudflare Pages."
                }),
                { status: 501, headers: { "Content-Type": "application/json" } }
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

        // Construimos los parámetros form-urlencoded para la API oficial de Stripe Checkout Sessions
        const params = new URLSearchParams();
        params.append("mode", "payment");
        params.append("success_url", `${originUrl}/index.html?pago=ok&order=${encodeURIComponent(orderId)}`);
        params.append("cancel_url", `${originUrl}/catalogo.html?checkout=true`);

        if (customer?.email) {
            params.append("customer_email", customer.email);
        }

        // Guardamos toda la dirección y notas en los Metadatos del pedido y del PaymentIntent
        // para que Víctor lo vea al instante en su móvil / dashboard de Stripe
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

        // Añadimos cada producto del carrito con su precio exacto bloqueado en céntimos
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

        // Añadimos la línea del tramo de envío seleccionado
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

        // Llamada directa a la API de Stripe (sin librerías pesadas)
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
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ url: sessionData.url, sessionId: sessionData.id }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "SERVER_ERROR", message: err.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
