"use client";

import { useState }   from "react";
import { Loader2, X, CheckCircle } from "lucide-react";
import { useAuth }    from "@/hooks/useAuth";
import { validateEmail } from "@/lib/auth-validation";

interface Props {
  isOpen:       boolean;
  onClose:      () => void;
  onLoginClick: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose, onLoginClick }: Props) {
  const { resetPassword, isLoading, error, setError } = useAuth();
  const [email,   setEmail]   = useState("");
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError("");
    const ok = await resetPassword(email);
    if (ok) setSuccess(true);
  };

  const handleClose = () => {
    setEmail(""); setEmailError(""); setError(""); setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 p-1 text-white/70 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Hero */}
        <div className="bg-brand-dark text-white px-8 py-7">
          <p className="font-display text-2xl font-bold mb-1">Recuperar contraseña</p>
          <p className="font-sans text-sm text-gray-300">Te enviaremos un link de acceso a tu email</p>
        </div>

        <div className="px-8 py-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 mx-auto" style={{ color: "#5CB996" }} />
              <p className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>
                Email enviado
              </p>
              <p className="font-sans text-sm text-gray-500">
                Si el email existe en Holizenter, recibirás un link para recuperar tu contraseña. Revisa también tu carpeta de spam.
              </p>
              <button
                onClick={() => { handleClose(); onLoginClick(); }}
                className="mt-4 font-sans text-sm font-medium text-brand-teal underline"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <p className="font-sans text-sm text-gray-600">
                Ingresa el email de tu cuenta. Te enviaremos un link para restablecer tu contraseña.
              </p>

              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:border-brand-teal transition-colors ${emailError ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              {error && (
                <p className="text-red-600 text-sm font-sans bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-teal text-white rounded-full py-3 font-display font-semibold hover:bg-brand-teal-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</> : "Enviar link de recuperación"}
              </button>

              <p className="text-center">
                <button type="button" onClick={() => { handleClose(); onLoginClick(); }} className="font-sans text-sm text-brand-teal underline">
                  Volver al inicio de sesión
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
