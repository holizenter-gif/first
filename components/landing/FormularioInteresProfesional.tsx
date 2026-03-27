"use client";

import { useState }                   from "react";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Input }                      from "@/components/ui/input";
import { Label }                      from "@/components/ui/label";
import { Button }                     from "@/components/ui/button";

export default function FormularioInteresProfesional() {
  const [nombre,        setNombre]        = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [especialidad,  setEspecialidad]  = useState("");
  const [experiencia,   setExperiencia]   = useState("");
  const [certificaciones, setCerts]       = useState("");
  const [bio,           setBio]           = useState("");
  const [motivacion,    setMotivacion]    = useState("");
  const [whatsapp,      setWhatsapp]      = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [enviado,       setEnviado]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/especialistas/solicitud", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre, email, password, especialidad,
          experiencia_anos: Number(experiencia) || 0,
          certificaciones, bio, motivacion, whatsapp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnviado(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error enviando solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: "var(--hl-divider)" }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#EBF7F2", border: "2px solid #2D5A3D" }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: "#2D5A3D" }} />
        </div>
        <h3 className="font-sans font-bold text-xl mb-2" style={{ color: "var(--hl-text)" }}>
          ¡Solicitud recibida!
        </h3>
        <p className="font-sans text-sm" style={{ color: "var(--hl-text-muted)" }}>
          Te enviamos un email de confirmación. Revisaremos tu solicitud
          en los próximos 3-5 días hábiles.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "var(--hl-divider)" }}>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Nombre completo *</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
          </div>
          <div>
            <Label className="text-xs text-gray-500 font-sans mb-1.5 block">WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55 1234 5678" />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Email *</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          <p className="text-xs text-gray-400 mt-1">Este email será tu usuario para acceder al portal</p>
        </div>

        <div>
          <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Contraseña *</Label>
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Guárdala — la usarás para entrar a tu portal</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Especialidad principal *</Label>
            <Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej: Psicología clínica" required />
          </div>
          <div>
            <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Años de experiencia</Label>
            <Input type="number" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} placeholder="0" min="0" />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Certificaciones principales</Label>
          <Input value={certificaciones} onChange={(e) => setCerts(e.target.value)} placeholder="Ej: MBSR Brown University, Psicología Somática…" />
          <p className="text-xs text-gray-400 mt-1">Separa con comas si tienes varias</p>
        </div>

        <div>
          <Label className="text-xs text-gray-500 font-sans mb-1.5 block">Bio corta</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Cuéntanos quién eres y cómo trabajas (2-3 líneas)"
            className="w-full text-sm border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] resize-none"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-500 font-sans mb-1.5 block">¿Por qué quieres unirte a Holizenter?</Label>
          <textarea
            value={motivacion}
            onChange={(e) => setMotivacion(e.target.value)}
            rows={3}
            placeholder="Cuéntanos qué te atrae de formar parte del directorio…"
            className="w-full text-sm border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#5CB996] resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full font-sans font-bold py-5 rounded-xl text-white"
          style={{ background: "var(--hl-green)" }}
        >
          {loading
            ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</span>
            : "Enviar solicitud →"}
        </Button>

        <p className="text-center text-xs text-gray-400">
          Al enviar aceptas que Holizenter revise tu información.
          Recibirás respuesta en 3-5 días hábiles.
        </p>
      </form>
    </div>
  );
}
