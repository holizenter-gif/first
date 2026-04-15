import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { calcularPaqueteTotal, cotizarEnvio } from "@/lib/skydropx";

const COSTO_FIJO_FALLBACK = 199;

export async function POST(req: NextRequest) {
  try {
    const { cp_destino, items } = await req.json() as {
      cp_destino: string;
      items:      { id: string; cantidad: number }[];
    };

    if (!cp_destino || !/^\d{5}$/.test(cp_destino)) {
      return NextResponse.json({ error: "CP inválido" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ tarifas: [], costo_fijo: COSTO_FIJO_FALLBACK });
    }

    // Intentar obtener dimensiones desde DB (columnas opcionales, pueden no existir aún)
    let productosDims: {
      id: string; peso_gramos?: number | null;
      largo_cm?: number | null; ancho_cm?: number | null; alto_cm?: number | null;
    }[] = [];

    try {
      const supabase = await createClient();
      const ids = items.map((i) => i.id);
      const { data } = await supabase
        .from("productos")
        .select("id, peso_gramos, largo_cm, ancho_cm, alto_cm")
        .in("id", ids);
      if (data) productosDims = data;
    } catch {
      // DB lookup opcional — se continúa con defaults
    }

    const itemsConDims = items.map((item) => {
      const dims = productosDims.find((p) => p.id === item.id);
      return {
        cantidad:     item.cantidad,
        peso_gramos:  dims?.peso_gramos  ?? null,
        largo_cm:     dims?.largo_cm     ?? null,
        ancho_cm:     dims?.ancho_cm     ?? null,
        alto_cm:      dims?.alto_cm      ?? null,
      };
    });

    const paquete = calcularPaqueteTotal(itemsConDims);
    const tarifas = await cotizarEnvio(cp_destino, paquete);

    return NextResponse.json({ tarifas, costo_fijo: COSTO_FIJO_FALLBACK });
  } catch (err) {
    // Si Skydropx falla, devolver tarifa fija para no bloquear checkout
    console.error("[cotizar-envio]", err);
    return NextResponse.json({ tarifas: [], costo_fijo: COSTO_FIJO_FALLBACK });
  }
}
