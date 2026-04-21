"use client";

import { useState }      from "react";
import { useRouter }     from "next/navigation";
import Link              from "next/link";
import { Loader2 }       from "lucide-react";
import { useAuth }       from "@/hooks/useAuth";
import {
  validateEmail, validatePassword, validatePasswordMatch, validateName,
} from "@/lib/auth-validation";

export default function SignupPage() {
  const router  = useRouter();
  const { signup, isLoading } = useAuth();

  const [nombre,          setNombre]          = useState("");
  const [apellido,        setApellido]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terminos,        setTerminos]        = useState(false);
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [globalError,     setGlobalError]     = useState("");
  const [success,         setSuccess]         = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const eNombre   = validateName(nombre, "Nombre");
    const eApellido = validateName(apellido, "Apellido");
    const eEmail    = validateEmail(email);
    const ePwd      = validatePassword(password);
    const eMatch    = validatePasswordMatch(password, confirmPassword);
    if (eNombre)   errs.nombre          = eNombre;
    if (eApellido) errs.apellido        = eApellido;
    if (eEmail)    errs.email           = eEmail;
    if (ePwd)      errs.password        = ePwd;
    if (eMatch)    errs.confirmPassword = eMatch;
    if (!terminos) errs.terminos        = "Debes aceptar los términos";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;

    const ok = await signup({ nombre, apellido, email, password, confirm_password: confirmPassword });
    if (ok) {
      setSuccess(true);
    } else {
      setGlobalError("Error al crear cuenta. Intenta de nuevo.");
    }
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:border-brand-teal transition-colors ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"}`;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Hero — solo desktop */}
      <div className="hidden lg:flex flex-1 bg-brand-dark text-white flex-col justify-center p-12">
        <p className="font-display text-4xl font-bold mb-4 leading-tight">
          Tu bienestar<br />empieza aquí
        </p>
        <p className="font-sans text-lg text-gray-300 leading-relaxed max-w-sm">
          Únete a Holizenter y accede a programas de bienestar, especialistas y recursos para transformar tu vida.
        </p>
        <div className="mt-10 space-y-3">
          {["Perfil personalizado", "Historial de compras y descargas", "Gestión de citas y eventos"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#5CB996" }} />
              <p className="font-sans text-sm text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 bg-white">
        <div className="max-w-md mx-auto w-full">

          <div className="mb-8">
            <p className="font-display text-3xl font-bold mb-2" style={{ color: "#0D1A0F" }}>
              Crear cuenta
            </p>
            <p className="font-sans text-gray-500">
              Completa tus datos para comenzar
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <p className="font-display text-2xl font-bold text-brand-teal mb-2">¡Bienvenido!</p>
              <p className="font-sans text-gray-500">Tu cuenta fue creada. Redirigiendo…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Nombre *</label>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" className={inputCls("nombre")} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div>
                  <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Apellido *</label>
                  <input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Tu apellido" autoComplete="family-name" className={inputCls("apellido")} />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" className={inputCls("email")} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Contraseña *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" className={inputCls("password")} />
                {errors.password
                  ? <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  : <p className="text-gray-400 text-xs mt-1">Mínimo 8 caracteres</p>}
              </div>

              <div>
                <label className="font-sans text-sm font-semibold text-gray-800 block mb-2">Confirmar contraseña *</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" autoComplete="new-password" className={inputCls("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={terminos}
                    onChange={(e) => setTerminos(e.target.checked)}
                    className="w-5 h-5 border border-gray-300 rounded mt-0.5 accent-brand-teal flex-shrink-0"
                  />
                  <span className="font-sans text-sm text-gray-700">
                    Acepto los{" "}
                    <Link href="/terminos" target="_blank" className="text-brand-teal underline">
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" target="_blank" className="text-brand-teal underline">
                      Política de Privacidad
                    </Link>
                  </span>
                </label>
                {errors.terminos && <p className="text-red-500 text-xs mt-1">{errors.terminos}</p>}
              </div>

              {globalError && (
                <p className="text-red-600 text-sm font-sans bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
                  {globalError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !terminos}
                className="w-full bg-brand-teal text-white rounded-full py-3 font-display font-semibold hover:bg-brand-teal-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta…</> : "Crear cuenta"}
              </button>

              <p className="text-center font-sans text-sm text-gray-600 pt-2">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-brand-teal underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
