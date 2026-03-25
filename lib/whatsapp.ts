export async function sendWhatsAppNotification(params: { to: string; message: string }): Promise<void> {
  const { EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE_NAME } = process.env;
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
    console.log("💬 [WA MOCK] Para:", params.to, "| Mensaje:", params.message);
    return;
  }
  const numero = params.to.replace(/\D/g, "");
  const res = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE_NAME}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_API_KEY },
    body: JSON.stringify({ number: numero, text: params.message }),
  });
  if (!res.ok) console.error("Error Evolution API:", await res.text());
}
