import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-[#1B4332] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#D4A017] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#D4A017]/20 text-[#D4A017] text-xs font-semibold rounded-full tracking-wider uppercase mb-6">
              Bienestar Holístico Empresarial
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              El Poder de <br />
              <span className="text-[#D4A017]">tu Bienestar</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              Diagnóstico laboral gratuito, talleres vivenciales y sensibilización de alta dirección. Transformamos el bienestar de tu empresa desde Cuerpo, Mente y Espíritu.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/quiz/burnout"
                className="px-8 py-4 bg-[#D4A017] text-white font-bold rounded-xl hover:bg-[#A67C0F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Diagnóstico Gratis →
              </Link>
              <Link
                href="/servicios"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/10 transition-all text-center"
              >
                Ver Servicios
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["bg-[#2D6A4F]", "bg-[#D4A017]", "bg-[#1B4332]", "bg-[#A67C0F]"].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-[#1B4332] flex items-center justify-center text-white text-xs font-bold`}>
                    {["AR", "JM", "CL", "+"][i]}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm">
                <span className="text-white font-semibold">+500 empresas</span> ya confían en Holizenter
              </p>
            </div>
          </div>

          {/* Right: stats card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
              <h3 className="font-serif text-lg font-semibold text-white mb-6">Diagnóstico Rápido</h3>
              <div className="space-y-5">
                {[
                  { icon: "🔥", label: "Nivel de burnout en tu empresa", value: "¿Sabes cuál es?" },
                  { icon: "📊", label: "Cumplimiento NOM-035", value: "¿Estás al día?" },
                  { icon: "💡", label: "Plan de acción personalizado", value: "En 4 minutos" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white/60 text-xs">{item.label}</p>
                      <p className="text-white font-semibold text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/quiz/burnout"
                className="mt-8 block w-full text-center py-3.5 bg-[#D4A017] text-white font-bold rounded-xl hover:bg-[#A67C0F] transition-colors text-sm"
              >
                Comenzar Diagnóstico Gratis
              </Link>
              <p className="text-center text-white/40 text-xs mt-3">100% gratuito · Sin registros previos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F5F0E8"/>
        </svg>
      </div>
    </section>
  );
}
