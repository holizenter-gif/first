"use client";

import { useState }             from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { Button }               from "@/components/ui/button";

interface Props {
  eventoId:     string;
  eventoTitulo: string;
  eventoSlug:   string;
  precio:       number;
}

export default function FormularioRegistroEvento({ eventoId, eventoTitulo, eventoSlug, precio }: Props) {
  const [nombre,   setNombre]   = useState("");
  const [email,    setEmail]    = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [empresa,  setEmpresa]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const esGratis = precio === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (esGratis) {
        // ── Evento gratuito: registrar directamente como confirmado ──
        const res  = await fetch("/api/eventos/registro", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            evento_id: eventoId, nombre, email, whatsapp, empresa,
            status_inicial: "confirmado",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error al registrarse");
        setConfirmado(true);

      } else {
        // ── Evento de pago: guardar pendiente → crear preferencia MP → redirigir ──
        const regRes  = await fetch("/api/eventos/registro", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            evento_id: eventoId, nombre, email, whatsapp, empresa,
            status_inicial: "pendiente",
          }),
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(regData.error ?? "Error al guardar registro");

        const prefRes  = await fetch("/api/pagos/preferencia", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            evento_id:    eventoId,
            registro_id:  regData.registro_id,
            evento_slug:  eventoSlug,
            nombre_evento: eventoTitulo,
            monto:        precio,
            nombre, email,
            empresa:      empresa || null,
          }),
        });
        const prefData = await prefRes.json();
        if (!prefRes.ok) throw new Error(prefData.error ?? "Error creando pago");

        // Redirigir a Mercado Pago
        window.location.href = prefData.init_point;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (confirmado) {
    return (
      <div className="py-6 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: "#EBF8F2" }}
        >
          <CheckCircle className="w-7 h-7" style={{ color: "#5CB996" }} />
        </div>
        <p className="font-sans font-bold text-base mb-1" style={{ color: "#0D1A0F" }}>
          ¡Registro confirmado!
        </p>
        <p className="font-sans text-xs" style={{ color: "#6B7280" }}>
          Te enviamos los detalles a {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Nombre completo *</Label>
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
      </div>
      <div>
        <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Email *</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
      </div>
      <div>
        <Label className="text-xs text-gray-500 font-sans mb-1.5 block">WhatsApp</Label>
        <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55 1234 5678" />
      </div>
      <div>
        <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Empresa (opcional)</Label>
        <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Tu empresa" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs">
          {error}
        </div>
      )}

      {!esGratis && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-blue-700 text-xs">
          Serás redirigido a Mercado Pago para completar el pago de forma segura.
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full font-sans font-bold py-4 rounded-xl text-white text-sm"
        style={{ background: "#5CB996" }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {esGratis ? "Registrando…" : "Preparando pago…"}
          </span>
        ) : esGratis ? "Registrarme gratis →" : `Pagar $${precio.toLocaleString("es-MX")} MXN →`}
      </Button>

      <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
        {esGratis ? "Recibirás confirmación por email." : "Pago seguro con Mercado Pago."}
      </p>
    </form>
  );
}
