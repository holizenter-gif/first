// Make.com — Orquestador de automatizaciones Holizenter

async function triggerWebhook(url: string, data: Record<string, unknown>): Promise<void> {
  if (!url) {
    console.log("[Make MOCK] Webhook no configurado:", data);
    return;
  }
  try {
    await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    });
  } catch (error) {
    console.error("Error en webhook Make.com:", error);
  }
}

export async function triggerQuizWebhook(data: Record<string, unknown>): Promise<void> {
  await triggerWebhook(process.env.MAKE_WEBHOOK_QUIZ ?? "", data);
}

export async function triggerLeadInactivoWebhook(data: {
  lead_id: string; nombre: string; email: string; empresa: string; puntaje: number;
}): Promise<void> {
  await triggerWebhook(process.env.MAKE_WEBHOOK_LEAD ?? "", { event: "lead_inactivo_7_dias", ...data });
}

export async function triggerCitaAgendadaWebhook(data: {
  cita_id: string; nombre: string; empresa: string; email: string;
  tipo: string; fecha: string; modalidad: string;
}): Promise<void> {
  await triggerWebhook(process.env.MAKE_WEBHOOK_QUIZ ?? "", { event: "cita_agendada", ...data });
}

export async function triggerNuevoPostWebhook(data: {
  titulo: string; slug: string; descripcion: string; categoria: string; url: string;
}): Promise<void> {
  await triggerWebhook(process.env.MAKE_WEBHOOK_POST ?? "", { event: "nuevo_post_blog", ...data });
}

export async function triggerPagoAprobadoWebhook(data: {
  pago_id: string; nombre: string; email: string; empresa: string;
  servicio: string; monto: number; anticipo: number;
}): Promise<void> {
  await triggerWebhook(process.env.MAKE_WEBHOOK_PAGO ?? "", { event: "pago_aprobado", ...data });
}
