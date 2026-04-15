const COOKIE_NAME = "hlz_lead";
const COOKIE_DAYS = 365;

export interface LeadCookieData {
  email:                 string;
  nombre:                string;
  empresa:               string;
  timestamp:             number;
  quiz_id:               string;
  quizzes_completados?:  string[];
}

function getCookieValue(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookieValue(value: string) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/** Returns true if this is a new lead (cookie not set), and sets the cookie. */
export function registerLead(email: string): boolean {
  const existing = getCookieValue();
  if (existing) return false;
  setCookieValue(email);
  return true;
}

/** Returns the stored lead email, or null if not set. */
export function getStoredLead(): string | null {
  return getCookieValue();
}

/** Returns true if the lead cookie is already set. */
export function isReturningLead(): boolean {
  return getCookieValue() !== null;
}

/** Returns the full cookie object (new JSON format), or null. */
export function getLeadCookie(): LeadCookieData | null {
  const raw = getCookieValue();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.email) return parsed as LeadCookieData;
    return null;
  } catch {
    return null; // legacy plain-email format → treat as no structured cookie
  }
}

/** Stores full lead data in cookie (JSON format). */
export function setLeadCookie(data: Omit<LeadCookieData, "quizzes_completados">) {
  const existing = getLeadCookie();
  const quizzes_completados = existing?.quizzes_completados ?? [];
  const merged: LeadCookieData = { ...data, quizzes_completados };
  setCookieValue(JSON.stringify(merged));
}

/** Appends a quiz id to the completed list inside the cookie. */
export function addQuizCompletado(quiz_id: string) {
  const cookie = getLeadCookie();
  if (!cookie) return;
  const completados = cookie.quizzes_completados ?? [];
  if (completados.includes(quiz_id)) return;
  cookie.quizzes_completados = [...completados, quiz_id];
  setCookieValue(JSON.stringify(cookie));
}

/** Returns true if the cookie records this quiz as completed. */
export function hasCompletedQuiz(quiz_id: string): boolean {
  return getLeadCookie()?.quizzes_completados?.includes(quiz_id) ?? false;
}
