"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

const schema = z.object({
  nombre:            z.string().min(2, "Escribe tu nombre completo"),
  empresa:           z.string().min(2, "Escribe el nombre de tu empresa"),
  email:             z.string().email("Escribe un email válido"),
  whatsapp:          z.string().min(10, "Escribe tu número de WhatsApp (10 dígitos)").max(15),
  acepta_privacidad: z.boolean().refine((v) => v === true, { message: "Debes aceptar el aviso de privacidad" }),
});
type FormData = z.infer<typeof schema>;

interface LeadCaptureFormProps {
  quizType: string; partialScore: number; onSubmit: (data: FormData) => Promise<void>; isLoading?: boolean;
}

export default function LeadCaptureForm({ partialScore, onSubmit, isLoading }: LeadCaptureFormProps) {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const loading = isLoading || isSubmitting;

  const onFormSubmit = async (data: FormData) => {
    setServerError("");
    try { await onSubmit(data); } catch { setServerError("Ocurrió un error. Intenta de nuevo."); }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-brand-dark text-white text-sm font-display font-medium px-4 py-2 rounded-full mb-4">
            <span className="text-lg">🎯</span> Tu diagnóstico está listo
          </div>
          <h2 className="font-display text-3xl font-bold text-brand-dark mb-3">¿Dónde enviamos<br />tu reporte?</h2>
          <p className="text-gray-600">Completa tus datos para ver el resultado completo y recibir tu reporte personalizado al instante.</p>
        </div>
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-[#1B4332]">{partialScore}%</span>
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">Score calculado</p>
            <p className="text-gray-500 text-xs">Completa tus datos para ver el análisis completo</p>
          </div>
          <div className="ml-auto"><Lock className="w-5 h-5 text-gray-400" /></div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-1.5 block">Nombre completo</Label>
              <Input id="nombre" placeholder="Tu nombre" {...register("nombre")} className={errors.nombre ? "border-red-400" : ""} />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <Label htmlFor="empresa" className="text-sm font-medium text-gray-700 mb-1.5 block">Empresa</Label>
              <Input id="empresa" placeholder="Nombre de tu empresa" {...register("empresa")} className={errors.empresa ? "border-red-400" : ""} />
              {errors.empresa && <p className="text-red-500 text-xs mt-1">{errors.empresa.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">Email corporativo</Label>
            <Input id="email" type="email" placeholder="tu@empresa.com" {...register("email")} className={errors.email ? "border-red-400" : ""} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp</Label>
            <Input id="whatsapp" type="tel" placeholder="55 1234 5678" {...register("whatsapp")} className={errors.whatsapp ? "border-red-400" : ""} />
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="privacidad" {...register("acepta_privacidad")} className="mt-1 w-4 h-4 accent-brand-teal" />
            <label htmlFor="privacidad" className="text-xs text-gray-500 leading-relaxed">
              Acepto el <a href="/privacidad" target="_blank" className="text-[#1B4332] underline">aviso de privacidad</a> y autorizo el uso de mis datos para recibir información de Holizenter.
            </label>
          </div>
          {errors.acepta_privacidad && <p className="text-red-500 text-xs">{errors.acepta_privacidad.message}</p>}
          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold py-6 rounded-xl text-base">
            {loading ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Analizando tus respuestas...</span> : "Ver mi resultado completo →"}
          </Button>
          <p className="text-center text-xs text-gray-400">🔒 Tus datos están protegidos · No spam · LFPDPPP</p>
        </form>
      </div>
    </div>
  );
}
