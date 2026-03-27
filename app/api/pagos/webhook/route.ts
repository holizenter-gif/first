import { NextRequest, NextResponse } from "next/server";
import { createClient }         from "@/lib/supabase/server";
import { obtenerPago }          from "@/lib/mercadopago";
import { sendPagoConfirmacion } from "@/lib/brevo";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body           = await req.json();
    const { type, data } = body;

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    const supabase    = await createClient();
    const pagoMP      = await obtenerPago(String(data.id));
    const externalRef = pagoMP.external_reference;
    const statusMP    = pagoMP.status;

    if (!externalRef) {
      return NextResponse.json({ received: true });
    }

    const statusMap: Record<string, string> = {
      approved:   "aprobado",
      rejected:   "rechazado",
      pending:    "en_proceso",
      in_process: "en_proceso",
      refunded:   "reembolsado",
    };
    const nuevoStatus = statusMap[statusMP ?? ""] ?? "en_proceso";

    const { data: pago } = await supabase
      .from("pagos")
      .update({
        status:        nuevoStatus,
        mp_payment_id: String(data.id),
      })
      .eq("id", externalRef)
      .select()
      .single();

    if (nuevoStatus === "aprobado" && pago) {
      if (pago.email_cliente) {
        generarDescargas(supabase, pago.id, pago.email_cliente).catch(console.error);
      }

      Promise.allSettled([
        pago.email_cliente && pago.nombre_cliente
          ? sendPagoConfirmacion({
              email:    pago.email_cliente,
              nombre:   pago.nombre_cliente,
              empresa:  pago.empresa_cliente ?? "",
              monto:    pago.monto,
              concepto: pago.concepto ?? "",
            })
          : Promise.resolve(),
        sendWhatsAppNotification({
          to:      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
          message: `💳 Pago aprobado: ${pago.nombre_cliente} de ${pago.empresa_cliente} — $${pago.monto} MXN — ${pago.concepto}`,
        }),
      ]).catch(console.error);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Error en webhook MP:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Webhook activo" });
}

async function generarDescargas(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ordenId:  string,
  email:    string
) {
  const { data: orden } = await supabase
    .from("ordenes")
    .select("productos")
    .eq("id", ordenId)
    .single();

  if (!orden?.productos) return;

  const items = orden.productos as { id: string; cantidad: number }[];

  for (const item of items) {
    const { data: producto } = await supabase
      .from("productos")
      .select("id, digital, archivo_url, max_descargas, dias_acceso")
      .eq("id", item.id)
      .single();

    if (!producto?.digital || !producto?.archivo_url) continue;

    const { data: existe } = await supabase
      .from("descargas")
      .select("id")
      .eq("orden_id", ordenId)
      .eq("producto_id", producto.id)
      .single();

    if (existe) continue;

    const expiraEn = new Date();
    expiraEn.setDate(expiraEn.getDate() + (producto.dias_acceso ?? 365));

    await supabase.from("descargas").insert({
      orden_id:            ordenId,
      producto_id:         producto.id,
      email,
      max_descargas:       producto.max_descargas ?? 3,
      descargas_realizadas: 0,
      expira_en:           expiraEn.toISOString(),
    });
  }
}
