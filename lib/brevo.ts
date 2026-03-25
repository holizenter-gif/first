const BREVO_API_URL = "https://api.brevo.com/v3";

interface SendEmailParams {
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
}

async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!process.env.BREVO_API_KEY) {
    console.log("📧 [BREVO MOCK] falta BREVO_API_KEY — destinatario:", params.to[0].email);
    return;
  }
  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { email: process.env.BREVO_SENDER_EMAIL ?? "hola@holizenter.mx", name: process.env.BREVO_SENDER_NAME ?? "Holizenter" },
      ...params,
    }),
  });
  if (!res.ok) throw new Error(`Brevo error: ${res.status}`);
}

export async function sendQuizReport(params: {
  email: string; nombre: string; score: number;
  nivel: string; servicio_recomendado: string; quiz_type: string;
}): Promise<void> {
  const nivelLabel: Record<string, string> = { critico: "🚨 Atención Prioritaria", riesgo: "⚠️ Zona de Riesgo", bajo: "✅ Bienestar Activo" };
  const nivelColor: Record<string, string> = { critico: "#DC2626", riesgo: "#D97706", bajo: "#1B4332" };
  const color = nivelColor[params.nivel] ?? "#1B4332";
  const label = nivelLabel[params.nivel] ?? params.nivel;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.mx";

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Inter,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;width:100%">
<tr><td style="background:#1B4332;padding:32px;text-align:center">
  <h1 style="margin:0;color:#fff;font-size:24px">HOLIZENTER</h1>
  <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px">Cuerpo · Mente · Espíritu</p>
</td></tr>
<tr><td style="padding:32px 32px 16px">
  <h2 style="margin:0 0 8px;color:#1A1A1A;font-size:20px">Hola ${params.nombre},</h2>
  <p style="margin:0;color:#6B7280;font-size:15px;line-height:1.6">Aquí está tu reporte de bienestar laboral:</p>
</td></tr>
<tr><td style="padding:16px 32px">
  <div style="background:#F5F0E8;border-radius:12px;padding:24px;text-align:center">
    <div style="font-size:56px;font-weight:700;color:${color}">${params.score}%</div>
    <div style="margin-top:8px;font-size:18px;font-weight:600;color:${color}">${label}</div>
    <div style="margin-top:16px;background:#E5E7EB;border-radius:99px;height:10px;overflow:hidden">
      <div style="width:${params.score}%;height:100%;background:${color};border-radius:99px"></div>
    </div>
  </div>
</td></tr>
<tr><td style="padding:16px 32px">
  <div style="background:#1B4332;border-radius:12px;padding:20px;color:#fff">
    <p style="margin:0;font-size:15px;font-weight:600">${params.servicio_recomendado}</p>
    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.75)">Basado en tu diagnóstico, este es el siguiente paso ideal.</p>
  </div>
</td></tr>
<tr><td style="padding:16px 32px 32px;text-align:center">
  <a href="${appUrl}/agendar" style="display:inline-block;background:#D4A017;color:#fff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:99px;text-decoration:none">Agenda tu diagnóstico gratis →</a>
  <p style="margin:16px 0 0;color:#6B7280;font-size:13px">Sin costo · 60 minutos · Online</p>
</td></tr>
<tr><td style="background:#F5F0E8;padding:24px 32px;text-align:center;border-top:1px solid #E5E7EB">
  <p style="margin:0;color:#9CA3AF;font-size:12px">Holizenter · Ciudad de México · <a href="${appUrl}/privacidad" style="color:#1B4332">Aviso de privacidad</a></p>
</td></tr>
</table></td></tr></table></body></html>`;

  await sendEmail({
    to: [{ email: params.email, name: params.nombre }],
    subject: `Tu reporte de bienestar laboral — ${label} | Holizenter`,
    htmlContent: html,
  });
}
