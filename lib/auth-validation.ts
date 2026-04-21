const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]{2,50}$/i;

export function validateEmail(email: string): string | null {
  if (!email.trim())         return "El email es requerido";
  if (!EMAIL_RE.test(email)) return "Email inválido";
  return null;
}

export function validatePassword(pwd: string): string | null {
  if (!pwd)          return "La contraseña es requerida";
  if (pwd.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  return null;
}

export function validatePasswordMatch(pwd: string, confirm: string): string | null {
  if (pwd !== confirm) return "Las contraseñas no coinciden";
  return null;
}

export function validateName(name: string, label = "Nombre"): string | null {
  if (!name.trim())         return `${label} es requerido`;
  if (!NAME_RE.test(name.trim())) return `${label} solo puede contener letras y espacios (2-50 caracteres)`;
  return null;
}
