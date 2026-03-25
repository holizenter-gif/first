"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SERVICIOS = [
  { label: "Talleres Grupales", href: "/servicios/talleres", desc: "Experiencias vivenciales para equipos" },
  { label: "Sensibilización Alta Dirección", href: "/servicios/sensibilizacion", desc: "Sesiones ejecutivas de liderazgo consciente" },
  { label: "Integración de Equipos", href: "/servicios/integracion", desc: "Team building holístico" },
  { label: "Diagnóstico Organizacional", href: "/servicios/diagnostico", desc: "Evaluación profunda NOM-035" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidBg = scrolled || mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        solidBg
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className={`font-serif text-2xl font-bold transition-colors ${solidBg ? "text-[#1B4332]" : "text-white"}`}>
          Holizenter
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* Servicios with submenu */}
          <li className="relative">
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              onBlur={() => setTimeout(() => setSubmenuOpen(false), 150)}
              className={`flex items-center gap-1 transition-colors ${solidBg ? "text-gray-700 hover:text-[#1B4332]" : "text-white/90 hover:text-white"}`}
            >
              Servicios <ChevronDown size={14} className={`transition-transform ${submenuOpen ? "rotate-180" : ""}`} />
            </button>
            {submenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {SERVICIOS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-5 py-3.5 hover:bg-[#F5F0E8] transition-colors group"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    <p className="font-medium text-[#1B4332] group-hover:text-[#D4A017] transition-colors text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </li>
          <li>
            <Link href="/directorio" className={`transition-colors ${solidBg ? "text-gray-700 hover:text-[#1B4332]" : "text-white/90 hover:text-white"}`}>
              Directorio
            </Link>
          </li>
          <li>
            <Link href="/blog" className={`transition-colors ${solidBg ? "text-gray-700 hover:text-[#1B4332]" : "text-white/90 hover:text-white"}`}>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/nosotros" className={`transition-colors ${solidBg ? "text-gray-700 hover:text-[#1B4332]" : "text-white/90 hover:text-white"}`}>
              Nosotros
            </Link>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contacto"
            className={`text-sm font-medium transition-colors ${solidBg ? "text-gray-600 hover:text-[#1B4332]" : "text-white/80 hover:text-white"}`}
          >
            Contacto
          </Link>
          <Link
            href="/quiz/burnout"
            className="px-5 py-2.5 bg-[#D4A017] text-white text-sm font-semibold rounded-lg hover:bg-[#A67C0F] transition-colors shadow-md"
          >
            Diagnóstico Gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className={`md:hidden p-2 rounded-lg transition-colors ${solidBg ? "text-[#1B4332]" : "text-white"}`}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#1B4332]">Holizenter</span>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Servicios</p>
                {SERVICIOS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-[#F5F0E8] hover:text-[#1B4332] transition-colors text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {s.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 mt-4 space-y-1">
                  {[{ label: "Directorio", href: "/directorio" }, { label: "Blog", href: "/blog" }, { label: "Nosotros", href: "/nosotros" }, { label: "Contacto", href: "/contacto" }].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-[#F5F0E8] hover:text-[#1B4332] transition-colors text-sm font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="p-6 border-t border-gray-100">
                <Link
                  href="/quiz/burnout"
                  className="block w-full text-center py-3 bg-[#D4A017] text-white font-semibold rounded-lg hover:bg-[#A67C0F] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Diagnóstico Gratis
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
