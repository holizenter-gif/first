"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, CheckCircle } from "lucide-react";

const CIUDADES = ["Ciudad de México", "Monterrey", "Guadalajara", "Puebla", "Querétaro", "Otro"];

interface Profile {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  ocupacion?: string;
  ciudad?: string;
  empresa?: string;
  bio?: string;
}

export default function DatosPage() {
  const [profile,  setProfile]  = useState<Profile>({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; ok: boolean } | null>(null);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/mi-perfil/datos")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile ?? {}))
      .catch(() => showToast("Error al cargar tu perfil", false))
      .finally(() => setLoading(false));
  }, []);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (profile.telefono && !/^\d{10}$/.test(profile.telefono.replace(/\s/g, ""))) {
      errs.telefono = "El teléfono debe tener 10 dígitos";
    }
    if (profile.bio && profile.bio.length > 500) {
      errs.bio = "Máximo 500 caracteres";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [profile]);

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res  = await fetch("/api/mi-perfil/datos", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      showToast("Perfil actualizado correctamente", true);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Error al guardar", false);
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof Profile) => ({
    value:    profile[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setProfile((p) => ({ ...p, [key]: e.target.value })),
  });

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5CB996]/40 bg-white";
  const labelCls = "block text-xs font-sans font-medium text-gray-500 mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5CB996" }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-sans font-medium"
          style={{ background: toast.ok ? "#EBF8F2" : "#FEE2E2", color: toast.ok ? "#1A6840" : "#B91C1C" }}
        >
          {toast.ok && <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-sans font-semibold text-base" style={{ color: "#0D1A0F" }}>
          Datos personales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nombre</label>
            <input {...field("nombre")} placeholder="Tu nombre" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Apellido</label>
            <input {...field("apellido")} placeholder="Tu apellido" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email</label>
          <input
            value={profile.email ?? ""}
            readOnly
            className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
          />
          <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde aquí.</p>
        </div>

        <div>
          <label className={labelCls}>Teléfono</label>
          <input
            {...field("telefono")}
            placeholder="10 dígitos (ej. 5512345678)"
            maxLength={10}
            className={`${inputCls} ${errors.telefono ? "border-red-300" : ""}`}
          />
          {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ocupación</label>
            <input {...field("ocupacion")} placeholder="Tu ocupación" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Ciudad</label>
            <select {...field("ciudad")} className={inputCls}>
              <option value="">Selecciona tu ciudad</option>
              {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Empresa (opcional)</label>
          <input {...field("empresa")} placeholder="Tu empresa u organización" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Bio (opcional)</label>
          <textarea
            {...(field("bio") as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={4}
            placeholder="Cuéntanos un poco sobre ti..."
            maxLength={500}
            className={`${inputCls} resize-none ${errors.bio ? "border-red-300" : ""}`}
          />
          <div className="flex justify-between mt-1">
            {errors.bio
              ? <p className="text-xs text-red-500">{errors.bio}</p>
              : <span />}
            <p className="text-xs text-gray-400 ml-auto">{(profile.bio ?? "").length}/500</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-sans font-bold text-sm text-white transition-opacity disabled:opacity-60"
        style={{ background: "#5CB996" }}
      >
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
      </button>
    </div>
  );
}
