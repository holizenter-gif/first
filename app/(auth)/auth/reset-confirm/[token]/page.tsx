"use client";

import { useState, use }  from "react";
import { useRouter }       from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { useAuth }         from "@/hooks/useAuth";
import { validatePassword, validatePasswordMatch } from "@/lib/auth-validation";

interface Props { params: Promise<{ token: string }> }

export default function ResetConfirmPage({ params }: Props) {
  const { token }  = use(params);
  const router     = useRouter();
  const { resetPasswordConfirm, isLoading, error, setError } = useAuth();

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors,     setFieldErrors]     = useState<Record<string, string>>({});
  const [success,         setSuccess]         = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="hidden lg:flex flex-1 bg-brand-dark" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#0D1A0F" }}>Link inválido</p>
            <p className="font-sans text-gray-500 mb-6">Este link no es válido o ya fue utilizado.</p>
            <button onClick={() => router.push("/")} className="bg-brand-teal text-white rounded-full px-6 py-2.5 font-display font-semibold hover:bg-brand-teal-dark transition-colors">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    const ePwd   = validatePassword(password);
    const eMatch = validatePasswordMatch(password, confirmPassword);
    if (ePwd)   errs.password        = ePwd;
    if (eMatch) errs.confirmPassword = eMatch;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    const ok = await resetPasswordConfirm(token, password, confirmPassword);
    if (ok) setSuccess(true);
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:border-brand-teal transition-colors ${fieldErrors[field] ? "border-red-400 bg-red-50" : "border-gray-300"}`;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Hero desktop */}
      <div className="hidden lg:flex flex-1 bg-brand-dark text-white flex-col justify-center p-12">
        <p className="font-display text-4xl font-bold mb-4 leading-tight">
          Nueva contraseña
        </p>
        <p className="font-sans text-lg text-gray-300 leading-relaxed max-w-sm">
          Estás a un paso de recuperar el acceso a tu cuenta de Holizenter.
        </p>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 bg-white">
        <div className="max-w-md mx-auto w-full">

          {success ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto" style={{ color: "#5CB996" }} />
              <p className="font-display text-2xl font-bold" style={{ color: "#0D1A0F" }}>
                ¡Contraseña actualizada!
              </p>
              <p className="font-sans text-gray-500">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-brand-teal text-white rounded-full px-8 py-3 font-display font-semibold hover:bg-brand-teal-dark transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="font-display text-3xl font-bold mb-2" style={{ color: "#0D1A0F" }}>
                  Restablecer contraseña
                </p>
                <p className="font-sans text-gray-500">
                  Ingresa y confirma tu nueva contraseña
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    className={inputCls("password")}
                  />
                  {fieldErrors.password
                    ? <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                    : <p className="text-gray-400 text-xs mt-1">Mínimo 8 caracteres</p>}
                </div>

                <div>
                  <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    autoComplete="new-password"
                    className={inputCls("confirmPassword")}
                  />
                  {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
                </div>

                {error && (
                  <p className="text-red-600 text-sm font-sans bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-teal text-white rounded-full py-3 font-display font-semibold hover:bg-brand-teal-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Actualizando…</>
                    : "Actualizar contraseña"}
                </button>

                <p className="text-center">
                  <button type="button" onClick={() => router.push("/")} className="font-sans text-sm text-brand-teal underline">
                    Volver al inicio de sesión
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
