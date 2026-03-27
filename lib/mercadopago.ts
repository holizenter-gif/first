import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN ?? "TEST-placeholder",
});

export interface CrearPreferenciaParams {
  titulo:         string;
  descripcion:    string;
  monto:          number;
  cantidad?:      number;
  externalRef:    string;
  nombreCliente:  string;
  emailCliente:   string;
  backUrls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
}

export async function crearPreferencia(params: CrearPreferenciaParams) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.com";
  const preference = new Preference(client);

  return preference.create({
    body: {
      items: [
        {
          id:          params.externalRef,
          title:       params.titulo,
          description: params.descripcion,
          quantity:    params.cantidad ?? 1,
          unit_price:  params.monto,
          currency_id: "MXN",
        },
      ],
      payer: {
        name:  params.nombreCliente,
        email: params.emailCliente,
      },
      back_urls: {
        success: params.backUrls?.success ?? `${base}/pagar/gracias?status=approved`,
        failure: params.backUrls?.failure ?? `${base}/pagar/gracias?status=rejected`,
        pending: params.backUrls?.pending ?? `${base}/pagar/gracias?status=pending`,
      },
      auto_return:          "approved",
      external_reference:   params.externalRef,
      notification_url:     `${base}/api/pagos/webhook`,
      statement_descriptor: "HOLIZENTER",
    },
  });
}

export async function obtenerPago(paymentId: string) {
  const payment = new Payment(client);
  return payment.get({ id: Number(paymentId) });
}
