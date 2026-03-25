import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white">
      {/* CTA strip */}
      <div className="bg-[#D4A017] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">¿Lista tu empresa para transformarse?</h3>
            <p className="text-white/85 mt-1 text-sm">Comienza con un diagnóstico gratuito — sin compromisos.</p>
          </div>
          <Link
            href="/quiz/burnout"
            className="shrink-0 px-8 py-3.5 bg-white text-[#1B4332] font-bold rounded-lg hover:bg-[#F5F0E8] transition-colors text-sm"
          >
            Hacer Diagnóstico Gratis →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-3xl font-bold mb-2">Holizenter</h2>
            <p className="text-white/50 text-sm mb-4">Cuerpo · Mente · Espíritu</p>
            <p className="text-white/60 text-sm leading-relaxed">
              Bienestar holístico para empresas en México. Cumplimiento NOM-035 garantizado.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://instagram.com/holizenter" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://linkedin.com/company/holizenter" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold mb-5 text-white/70 uppercase text-xs tracking-widest">Servicios</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/servicios/talleres" className="hover:text-white transition-colors">Talleres Grupales</Link></li>
              <li><Link href="/servicios/sensibilizacion" className="hover:text-white transition-colors">Sensibilización AD</Link></li>
              <li><Link href="/servicios/integracion" className="hover:text-white transition-colors">Integración de Equipos</Link></li>
              <li><Link href="/servicios/diagnostico" className="hover:text-white transition-colors">Diagnóstico NOM-035</Link></li>
              <li><Link href="/tienda" className="hover:text-white transition-colors">Tienda Wellness</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-5 text-white/70 uppercase text-xs tracking-widest">Empresa</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/directorio" className="hover:text-white transition-colors">Directorio de Expertos</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/nom-035" className="hover:text-white transition-colors">NOM-035</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto + Legal */}
          <div>
            <h4 className="font-semibold mb-5 text-white/70 uppercase text-xs tracking-widest">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/60 mb-6">
              <li>
                <a href="mailto:hola@holizenter.mx" className="hover:text-white transition-colors">
                  hola@holizenter.mx
                </a>
              </li>
              <li>Ciudad de México, México</li>
            </ul>
            <h4 className="font-semibold mb-3 text-white/70 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-white/35 text-xs">
          <p>© 2026 Holizenter. Todos los derechos reservados.</p>
          <p>NOM-035 · Cumplimiento Garantizado · Ciudad de México</p>
        </div>
      </div>
    </footer>
  );
}
