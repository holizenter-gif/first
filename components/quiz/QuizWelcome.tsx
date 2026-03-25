"use client";
import { Clock, Users, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizWelcomeProps { onStart: () => void; }

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="inline-block bg-[#1B4332] text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            Holizenter · Bienestar Holístico Empresarial
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1B4332] leading-tight mb-4">
            ¿Cuál es el nivel de<br />
            <span className="text-[#D4A017]">burnout laboral</span><br />
            de tu equipo?
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
            Responde 10 preguntas y recibe un diagnóstico personalizado con recomendaciones específicas para tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock,     value: "4 min", label: "para completar" },
            { icon: BarChart3, value: "100%",  label: "gratuito" },
            { icon: Users,     value: "+500",  label: "empresas evaluadas" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <Icon className="w-5 h-5 text-[#1B4332] mx-auto mb-2" />
              <div className="font-bold text-[#1B4332] text-lg">{value}</div>
              <div className="text-gray-500 text-xs">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <p className="font-medium text-gray-800 mb-4 text-sm">Al finalizar recibirás:</p>
          <div className="space-y-3">
            {[
              "Tu nivel de burnout con puntuación exacta",
              "Diagnóstico por dimensiones: clima, rotación y liderazgo",
              "Servicio recomendado según tu resultado",
              "Reporte completo en tu email en menos de 60 segundos",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={onStart} className="bg-[#D4A017] hover:bg-[#A67C0F] text-white font-semibold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            Comenzar diagnóstico gratis →
          </Button>
          <p className="text-gray-400 text-xs mt-4">Sin registro previo · Tus datos están protegidos · LFPDPPP</p>
        </div>
      </div>
    </div>
  );
}
