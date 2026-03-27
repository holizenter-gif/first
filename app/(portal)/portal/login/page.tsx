"use client";

import { useState }     from "react";
import { useRouter }    from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button }       from "@/components/ui/button";
import { Input }        from "@/components/ui/input";
import { Label }        from "@/components/ui/label";
import Logo             from "@/components/brand/Logo";
import Link             from "next/link";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    const rol = data.user?.user_metadata?.rol;
    if (rol === "especialista_pendiente") {
      setError("Tu solicitud aún está siendo revisada. Te avisaremos cuando sea aprobada.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    if (rol !== "especialista") {
      setError("Esta área es exclusiva para especialistas del directorio.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push("/portal");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  { redirectTo: `${window.location.origin}/portal` },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0D1A0F" }}
    >
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Logo variant="blanco" size="md" href="/" className="justify-center mb-6" />
          <p className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
            Portal de especialistas
          </p>
        </div>

        <div
          className="rounded-2xl p-6 border"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <h1 className="font-sans font-bold text-white text-xl mb-1">Iniciar sesión</h1>
          <p className="text-sm mb-6 font-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
            Acceso exclusivo para especialistas
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-xs font-sans mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                Email
              </Label>
              <Input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#5CB996]"
              />
            </div>
            <div>
              <Label className="text-xs font-sans mb-1.5 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#5CB996] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm font-sans">{error}</p>}

            <Button
              type="submit" disabled={loading}
              className="w-full text-white font-sans font-semibold py-5 rounded-xl"
              style={{ background: "#5CB996" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar al portal"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <RecuperarContrasena email={email} />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs font-sans" style={{ color: "rgba(255,255,255,0.3)" }}>o</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 transition-colors font-sans font-medium text-sm text-white hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Entrar con Google
          </button>

          <p className="text-xs text-center mt-4 font-sans" style={{ color: "rgba(255,255,255,0.3)" }}>
            ¿Quieres unirte al directorio?{" "}
            <Link href="/formacion#unirse" className="hover:underline" style={{ color: "#5CB996" }}>
              Solicitar ingreso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RecuperarContrasena({ email }: { email: string }) {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) { alert("Ingresa tu email primero"); return; }
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setEnviado(true);
    setLoading(false);
  };

  return enviado ? (
    <p className="text-xs font-sans" style={{ color: "#5CB996" }}>✓ Email de recuperación enviado</p>
  ) : (
    <button
      onClick={handleReset}
      disabled={loading}
      className="text-xs font-sans transition-colors hover:opacity-80"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {loading ? "Enviando..." : "¿Olvidaste tu contraseña?"}
    </button>
  );
}
