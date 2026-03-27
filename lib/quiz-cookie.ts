const COOKIE_NAME = "hlz_lead";
const COOKIE_DAYS = 365;

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
