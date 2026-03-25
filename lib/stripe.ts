import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover" as any,
});

export async function crearPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}) {
  return stripe.paymentIntents.create({
    amount: params.amount * 100,
    currency: params.currency ?? "mxn",
    metadata: params.metadata ?? {},
  });
}
