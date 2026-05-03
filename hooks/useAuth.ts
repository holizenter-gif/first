"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState("");

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al iniciar sesión");
      router.push("/mi-perfil");
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión. Intenta de nuevo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: {
    nombre: string; apellido: string; email: string; password: string; confirm_password: string;
  }) => {
    setIsLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear cuenta");

      // Auto-login: crear sesión inmediatamente para no perder al usuario en el flujo
      const loginRes = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: payload.email, password: payload.password }),
      });
      if (loginRes.ok) {
        router.push("/mi-perfil/tareas");
      } else {
        // Si el auto-login falla, enviar al login con email pre-cargado via query
        router.push(`/auth/login?email=${encodeURIComponent(payload.email)}`);
      }
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear cuenta. Intenta de nuevo");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al enviar email");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordConfirm = async (token: string, password: string, confirm_password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/reset-confirm", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password, confirm_password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al actualizar contraseña");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar contraseña");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, signup, logout, resetPassword, resetPasswordConfirm, isLoading, error, setError };
}
