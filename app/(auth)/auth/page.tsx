"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    router.replace(redirect);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--hl-beige)" }}
    >
      <div
        className="w-full max-w-sm p-8"
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          borderTop: "3px solid var(--hl-green)",
        }}
      >
        <div className="mb-8 text-center">
          <p className="font-sans font-bold" style={{ fontSize: "22px", color: "var(--hl-text)" }}>
            Holizenter
          </p>
          <p className="font-sans mt-1" style={{ fontSize: "13px", color: "var(--hl-text-muted)" }}>
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans font-semibold block mb-1.5" style={{ fontSize: "13px", color: "var(--hl-text)" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full font-sans px-3 py-2.5 outline-none"
              style={{
                border: "1.5px solid var(--hl-divider)",
                borderRadius: "4px",
                fontSize: "14px",
                color: "var(--hl-text)",
              }}
              placeholder="admin@holizenter.com"
            />
          </div>

          <div>
            <label className="font-sans font-semibold block mb-1.5" style={{ fontSize: "13px", color: "var(--hl-text)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full font-sans px-3 py-2.5 outline-none"
              style={{
                border: "1.5px solid var(--hl-divider)",
                borderRadius: "4px",
                fontSize: "14px",
                color: "var(--hl-text)",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-sans" style={{ fontSize: "13px", color: "#C0392B" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-sans font-semibold py-3 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background: "var(--hl-green)",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
