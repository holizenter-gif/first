declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export const analytics = {
  // Quiz lifecycle
  quizStart:    (quiz_type: string) => push("quiz_start",    { quiz_type }),
  quizComplete: (quiz_type: string, score: number, nivel: string) =>
    push("quiz_complete", { quiz_type, score, nivel }),

  // Lead capture
  leadSubmit:   (quiz_type: string, is_new_lead: boolean) =>
    push("lead_submit", { quiz_type, is_new_lead }),
  leadDuplicate:(quiz_type: string) => push("lead_duplicate", { quiz_type }),

  // Quiz navigation
  quizQuestion: (quiz_type: string, question_index: number) =>
    push("quiz_question", { quiz_type, question_index }),
  quizAbandoned:(quiz_type: string, question_index: number) =>
    push("quiz_abandoned", { quiz_type, question_index }),
  quizResumed:  (quiz_type: string) => push("quiz_resumed", { quiz_type }),

  // Result actions
  resultAgendar:(quiz_type: string, nivel: string) =>
    push("result_agendar", { quiz_type, nivel }),
  resultShare:  (quiz_type: string) => push("result_share", { quiz_type }),

  // E-commerce
  cartAdd:      (product_id: string, product_name: string, price: number) =>
    push("cart_add", { product_id, product_name, price }),
  cartRemove:   (product_id: string) => push("cart_remove", { product_id }),
  checkoutBegin:(total: number, items_count: number) =>
    push("checkout_begin", { total, items_count }),
  purchaseComplete:(order_id: string, total: number) =>
    push("purchase_complete", { order_id, total }),
};
