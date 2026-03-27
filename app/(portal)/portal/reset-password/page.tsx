"use client";

import { useState }     from "react";
import { useRouter }    from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input }        from "@/components/ui/input";
import { Button }       from "@/components/ui/button";
import Logo             from "@/components/brand/Logo";

export default function ResetPasswordPage() {
  const router      = useRouter();
  const [password,  setPassword] = useState("");
  const [confirm,   setConfirm]  = useState("");
  const [show,      setShow]     = useState(false);
  const [loading,   setLoading]  = useState(false);
  const [error,     setError]    = useState("");
  const [listo,     setListo]    = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8)  { setError("Mínimo 8 caracteres."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setListo(true);
    setTimeout(() => router.push("/portal"), 2000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0D1A0F" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo variant="blanco" size="md" href="/" className="justify-center mb-4" />
        </div>
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <h1 className="font-sans font-bold text-white text-xl mb-4">
            {listo ? "✅ Contraseña actualizada" : "Nueva contraseña"}
          </h1>
          {listo ? (
            <p className="text-sm font-sans" style={{ color: "rgba(255,255,255,0.6)" }}>
              Redirigiendo al portal…
            </p>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Input
                  type={show ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña (mín. 8 caracteres)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 pr-10"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input
                type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirmar contraseña"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                required
              />
              {error && <p className="text-red-400 text-xs font-sans">{error}</p>}
              <Button type="submit" disabled={loading}
                className="w-full text-white font-sans font-semibold py-5 rounded-xl"
                style={{ background: "#5CB996" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
