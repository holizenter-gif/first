export interface ConfigEnvio {
  costo_estandar:      number;
  umbral_gratis:       number;
  envio_gratis_activo: boolean;
}

export interface DireccionEnvio {
  nombre:       string;
  calle:        string;
  numero:       string;
  colonia:      string;
  ciudad:       string;
  estado:       string;
  cp:           string;
  referencias?: string;
}

export interface ItemCarritoEnvio {
  id:       string;
  nombre:   string;
  precio:   number;
  cantidad: number;
  digital:  boolean;
  imagen:   string | null;
}

export interface ResultadoEnvio {
  requiere_envio:      boolean;
  costo:               number;
  gratis:              boolean;
  razon_gratis?:       string;
  total_fisicos:       number;
  falta_para_gratis?:  number;
}

export const CONFIG_ENVIO_DEFAULT: ConfigEnvio = {
  costo_estandar:      199,
  umbral_gratis:       1000,
  envio_gratis_activo: false,
};

export function separarCarrito(items: ItemCarritoEnvio[]): {
  digitales: ItemCarritoEnvio[];
  fisicos:   ItemCarritoEnvio[];
} {
  return {
    digitales: items.filter((i) => i.digital),
    fisicos:   items.filter((i) => !i.digital),
  };
}

export function calcularEnvio(
  items:               ItemCarritoEnvio[],
  config:              ConfigEnvio,
  cupon_envio_gratis?: boolean
): ResultadoEnvio {
  const { fisicos } = separarCarrito(items);

  // Sin físicos — envío gratis siempre
  if (fisicos.length === 0) {
    return {
      requiere_envio: false,
      costo:          0,
      gratis:         true,
      razon_gratis:   "solo_digital",
      total_fisicos:  0,
    };
  }

  // Caso 11 — el total para subsidio solo cuenta físicos
  const total_fisicos = fisicos.reduce(
    (sum, i) => sum + i.precio * i.cantidad, 0
  );

  let costo = config.costo_estandar;
  let gratis = false;
  let razon_gratis: string | undefined;

  // Cupón de envío gratis
  if (cupon_envio_gratis) {
    gratis = true;
    costo = 0;
    razon_gratis = "cupon";
  }

  // Umbral gratis — solo suma productos físicos, nunca digitales
  if (!gratis && config.envio_gratis_activo && total_fisicos >= config.umbral_gratis) {
    gratis = true;
    costo = 0;
    razon_gratis = "umbral";
  }

  const falta_para_gratis =
    config.envio_gratis_activo && !gratis
      ? Math.max(0, config.umbral_gratis - total_fisicos)
      : undefined;

  return {
    requiere_envio: true,
    costo:          gratis ? 0 : costo,
    gratis,
    razon_gratis,
    total_fisicos,
    falta_para_gratis,
  };
}

export function validarCP(cp: string): { valido: boolean; error?: string } {
  if (!cp) return { valido: false };
  if (!/^\d{5}$/.test(cp.trim())) {
    return { valido: false, error: "El código postal debe tener 5 dígitos" };
  }
  const num = parseInt(cp);
  if (num < 1000 || num > 99999) {
    return { valido: false, error: "Solo realizamos envíos dentro de México" };
  }
  return { valido: true };
}
