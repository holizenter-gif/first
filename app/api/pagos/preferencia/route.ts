import { NextRequest, NextResponse } from "next/server";
import { createClient }     from "@/lib/supabase/server";
import { crearPreferencia } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      servicio, personas, modalidad, monto,
      nombre, empresa, email, whatsapp,
    } = body;

    if (!monto || !nombre || !email) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Crear registro de pago pendiente
    const { data: pago, error: pagoError } = await supabase
      .from("pagos")
      .insert({
        monto:           Math.round(monto),
        moneda:          "MXN",
        metodo:          "mercado_pago",
        status:          "pendiente",
        concepto:        `${servicio} · ${personas} personas · ${modalidad}`,
        nombre_cliente:  nombre,
        email_cliente:   email,
        empresa_cliente: empresa,
      })
      .select()
      .single();

    if (pagoError || !pago) {
      console.error("Error creando pago:", pagoError);
      return NextResponse.json({ error: "Error creando registro de pago" }, { status: 500 });
    }

    // 2. Crear preferencia en Mercado Pago
    const preferencia = await crearPreferencia({
      titulo:        `Holizenter · ${servicio}`,
      descripcion:   `${servicio} para ${personas} personas · ${modalidad} · ${empresa}`,
      monto:         Math.round(monto),
      externalRef:   pago.id,
      nombreCliente: nombre,
      emailCliente:  email,
    });

    // 3. Guardar preference_id
    await supabase
      .from("pagos")
      .update({ mp_preference_id: preferencia.id })
      .eq("id", pago.id);

    return NextResponse.json({
      success:            true,
      pago_id:            pago.id,
      preference_id:      preferencia.id,
      init_point:         preferencia.init_point,
      sandbox_init_point: preferencia.sandbox_init_point,
    });

  } catch (error) {
    console.error("Error creando preferencia MP:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
