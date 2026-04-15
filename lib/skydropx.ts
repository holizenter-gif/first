export interface TarifaEnvio {
  id:        string;
  proveedor: string;
  servicio:  string;
  dias:      number;
  precio:    number;
}

export interface PaqueteInfo {
  peso_kg:  number;
  largo_cm: number;
  ancho_cm: number;
  alto_cm:  number;
}

const BASE_URL   = "https://api.skydropx.com/v1";
const ORIGEN_CP  = process.env.SKYDROPX_CP_ORIGEN ?? "06700"; // CDMX default

/** Suma el paquete total de los productos físicos. Uses DB dimensions when available; falls back to safe defaults. */
export function calcularPaqueteTotal(
  items: { peso_gramos?: number | null; largo_cm?: number | null; ancho_cm?: number | null; alto_cm?: number | null; cantidad: number }[]
): PaqueteInfo {
  let pesoTotal = 0;
  let largoMax  = 0;
  let anchoMax  = 0;
  let altoAcum  = 0;

  for (const item of items) {
    const peso = (item.peso_gramos ?? 300) * item.cantidad;
    pesoTotal += peso;
    largoMax   = Math.max(largoMax, item.largo_cm ?? 20);
    anchoMax   = Math.max(anchoMax, item.ancho_cm ?? 15);
    altoAcum  += (item.alto_cm ?? 5) * item.cantidad;
  }

  return {
    peso_kg:  Math.max(0.1, pesoTotal / 1000),
    largo_cm: Math.max(10, largoMax),
    ancho_cm: Math.max(10, anchoMax),
    alto_cm:  Math.max(5, altoAcum),
  };
}

/** Llama a Skydropx v1/rates y devuelve las tarifas disponibles. */
export async function cotizarEnvio(
  cp_destino: string,
  paquete:    PaqueteInfo
): Promise<TarifaEnvio[]> {
  const apiKey = process.env.SKYDROPX_API_KEY;
  if (!apiKey) throw new Error("SKYDROPX_API_KEY no configurada");

  const res = await fetch(`${BASE_URL}/rates`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Token token=${apiKey}`,
    },
    body: JSON.stringify({
      zipcode_from: ORIGEN_CP,
      zipcode_to:   cp_destino,
      parcel: {
        distance_unit: "cm",
        mass_unit:     "kg",
        weight:        paquete.peso_kg,
        height:        paquete.alto_cm,
        width:         paquete.ancho_cm,
        length:        paquete.largo_cm,
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Skydropx ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const data: Record<string, unknown>[] = json.data ?? [];

  return data
    .map((item) => {
      const attrs = (item.attributes ?? {}) as Record<string, unknown>;
      return {
        id:        String(item.id ?? ""),
        proveedor: String(attrs.provider            ?? ""),
        servicio:  String(attrs.service_level_name  ?? ""),
        dias:      Number(attrs.days                ?? 0),
        precio:    parseFloat(String(attrs.total_pricing ?? "0")),
      } satisfies TarifaEnvio;
    })
    .filter((t) => t.precio > 0);
}
