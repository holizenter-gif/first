export async function triggerQuizWebhook(data: Record<string, unknown>): Promise<void> {
  if (!process.env.MAKE_WEBHOOK_QUIZ) return;
  await fetch(process.env.MAKE_WEBHOOK_QUIZ, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
