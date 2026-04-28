"use client";

import { useState }         from "react";
import { Loader2, X }       from "lucide-react";
import { useAuth }          from "@/hooks/useAuth";
import { validateEmail, validatePassword } from "@/lib/auth-validation";

interface Props {
  isOpen:          boolean;
  onClose:         () => void;
  onSignupClick:   () => void;
  onResetClick:    () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSignupClick, onResetClick, onLoginSuccess }: Props) {
  const { login, isLoading, error, setError } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success,  setSuccess]  = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailErr = validateEmail(email);
    const pwdErr   = validatePassword(password);
    if (emailErr) errs.email    = emailErr;
    if (pwdErr)   errs.password = pwdErr;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    const ok = await login(email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => { if (onLoginSuccess) onLoginSuccess(); else onClose(); }, 800);
    }
  };

  const handleClose = () => {
    setEmail(""); setPassword(""); setFieldErrors({}); setError(""); setSuccess(false);
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:border-brand-teal transition-colors ${
      fieldErrors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero header */}
        <div className="bg-brand-dark text-white px-8 py-7">
          <p className="font-display text-2xl font-bold mb-1">Bienvenido de vuelta</p>
          <p className="font-sans text-sm text-gray-300">Inicia sesión en tu cuenta Holizenter</p>
        </div>

        <div className="px-8 py-6">
          {success ? (
            <div className="text-center py-6">
              <p className="font-display font-bold text-xl text-brand-teal mb-1">¡Bienvenido!</p>
              <p className="font-sans text-sm text-gray-500">Redirigiendo a tu perfil…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputCls("email")}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputCls("password")}
                />
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onResetClick}
                  className="font-sans text-xs font-medium hover:underline"
                  style={{ color: "#6D8339" }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-sans text-center bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-teal text-white rounded-full py-3 font-display font-semibold hover:bg-brand-teal-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión…</> : "Iniciar sesión"}
              </button>

              <p className="text-center font-sans text-sm text-gray-600 pt-2">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={onSignupClick} className="text-brand-teal underline font-medium">
                  Regístrate
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
