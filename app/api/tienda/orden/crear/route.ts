import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import type { OrdenItem } from "@/lib/supabase/types";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      subtotal,
      costo_envio,
      total,
      email_comprador,
      nombre_comprador,
      whatsapp,
    } = body as {
      items:             OrdenItem[];
      subtotal:          number;
      costo_envio:       number;
      total:             number;
      email_comprador:   string;
      nombre_comprador:  string;
      whatsapp:          string;
    };

    // 1. Guardar orden en Supabase con estado pendiente
    const supabase = await createClient();
    const { data: orden, error: dbError } = await supabase
      .from("ordenes")
      .insert({
        email_comprador,
        nombre_comprador,
        items,
        subtotal,
        costo_envio,
        total,
        moneda: "MXN",
        estado: "pendiente",
        metodo_pago: "mercado_pago",
        notas: whatsapp ? `WhatsApp: ${whatsapp}` : undefined,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      // Continuar aunque falle el guardado — el pago sigue siendo posible
    }

    // 2. Crear preferencia de Mercado Pago
    const preference = new Preference(mp);
    const mpResponse = await preference.create({
      body: {
        items: items.map((item) => ({
          id:          item.producto_id,
          title:       item.nombre,
          quantity:    item.cantidad,
          unit_price:  item.precio,
          currency_id: "MXN",
        })),
        payer: {
          name:  nombre_comprador,
          email: email_comprador,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/mis-compras?status=success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/checkout?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/mis-compras?status=pending`,
        },
        auto_return:     "approved",
        external_reference: orden?.id ?? `tmp-${Date.now()}`,
        statement_descriptor: "HOLIZENTER",
        shipments: costo_envio > 0 ? { cost: costo_envio, mode: "not_specified" } : undefined,
      },
    });

    // 3. Actualizar orden con mp_preference_id si se guardó
    if (orden?.id && mpResponse.id) {
      await supabase
        .from("ordenes")
        .update({ pago_id: mpResponse.id })
        .eq("id", orden.id);
    }

    return NextResponse.json({
      orden_id:   orden?.id,
      init_point: mpResponse.init_point,
    });
  } catch (err) {
    console.error("Error creando orden:", err);
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
  }
}
