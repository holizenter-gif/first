"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/brand/Logo";
import BotonCarrito from "@/components/tienda/BotonCarrito";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const SERVICIOS = [
  { label: "Talleres Grupales",              href: "/servicios/talleres",       desc: "Experiencias vivenciales para equipos" },
  { label: "Sensibilización Alta Dirección", href: "/servicios/sensibilizacion", desc: "Sesiones ejecutivas de liderazgo consciente" },
  { label: "Integración de Equipos",         href: "/servicios/integracion",    desc: "Team building holístico" },
  { label: "Diagnóstico Organizacional",     href: "/servicios/diagnostico",    desc: "Evaluación profunda NOM-035" },
  { label: "NOM-035",                        href: "/nom-035",                  desc: "Cumplimiento normativo laboral" },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [submenuOpen,  setSubmenuOpen]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [user,         setUser]         = useState<User | null | undefined>(undefined);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setMobileOpen(false);
    router.push("/");
    router.refresh();
    setLogoutLoading(false);
  };

  const solid = scrolled || mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        solid
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-brand-dark"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Logo variant={solid ? "color" : "blanco"} size="sm" href="/" priority />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <li className="relative">
            <button
              onClick={() => setSubmenuOpen(!submenuOpen)}
              className={`flex items-center gap-1 font-display transition-colors ${solid ? "text-gray-700 hover:text-brand-teal" : "text-white/90 hover:text-white"}`}
            >
              Servicios <ChevronDown size={14} className={`transition-transform ${submenuOpen ? "rotate-180" : ""}`} />
            </button>
            {submenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSubmenuOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  {SERVICIOS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-3 hover:bg-brand-teal-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      <p className="font-display font-semibold text-brand-dark text-sm">{s.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{s.desc}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </li>
          {[
            { label: "Tienda",     href: "/tienda"     },
            { label: "Directorio", href: "/directorio" },
            { label: "Eventos",    href: "/eventos"    },
            { label: "InsightLab", href: "/blog"       },
            { label: "Nosotros",   href: "/nosotros"   },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`font-display transition-colors ${solid ? "text-gray-700 hover:text-brand-teal" : "text-white/90 hover:text-white"}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <BotonCarrito solid={solid} />
          {/* Auth-aware buttons */}
          {user === undefined ? (
            <div className="w-28 h-8" />
          ) : user ? (
            <>
              <Link
                href="/mi-perfil"
                className={`px-4 py-2 text-sm font-display font-semibold rounded-full border transition-colors ${solid ? "border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white" : "border-white/70 text-white/90 hover:border-white hover:text-white"}`}
              >
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-5 py-2.5 bg-brand-teal text-white text-sm font-display font-semibold rounded-full hover:bg-brand-teal-dark transition-colors shadow-sm shadow-brand-teal/20 disabled:opacity-60"
              >
                {logoutLoading ? "..." : "Cerrar sesión"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`px-4 py-2 text-sm font-display font-semibold rounded-full border transition-colors ${solid ? "border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white" : "border-white/70 text-white/90 hover:border-white hover:text-white"}`}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/agendar"
                className="px-5 py-2.5 bg-brand-teal text-white text-sm font-display font-semibold rounded-full hover:bg-brand-teal-dark transition-colors shadow-sm shadow-brand-teal/20"
              >
                Diagnóstico gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className={`md:hidden p-2 rounded-lg transition-colors ${solid ? "text-brand-dark" : "text-white"}`}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <Logo variant="color" size="sm" href="" />
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                <p className="text-xs font-display font-semibold text-gray-400 uppercase tracking-wider mb-3">Servicios</p>
                {SERVICIOS.map((s) => (
                  <Link key={s.href} href={s.href}
                    className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal transition-colors text-sm font-display font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {s.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 mt-4 space-y-1">
                  {[
                    { label: "Tienda",     href: "/tienda"     },
                    { label: "Directorio", href: "/directorio" },
                    { label: "Eventos",    href: "/eventos"    },
                    { label: "InsightLab", href: "/blog"       },
                    { label: "Nosotros",   href: "/nosotros"   },
                    { label: "Contacto",   href: "/contacto"   },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}
                      className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-brand-teal-50 hover:text-brand-teal transition-colors text-sm font-display font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Mobile bottom — auth-aware */}
              <div className="p-6 border-t border-gray-100 space-y-3">
                {user ? (
                  <>
                    <Link href="/mi-perfil"
                      className="block w-full text-center py-2.5 border border-brand-teal text-brand-teal font-display font-semibold rounded-full hover:bg-brand-teal hover:text-white transition-colors text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="block w-full text-center py-3 bg-brand-teal text-white font-display font-semibold rounded-full hover:bg-brand-teal-dark transition-colors disabled:opacity-60"
                    >
                      {logoutLoading ? "Cerrando sesión..." : "Cerrar sesión"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login"
                      className="block w-full text-center py-2.5 border border-brand-teal text-brand-teal font-display font-semibold rounded-full hover:bg-brand-teal hover:text-white transition-colors text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link href="/agendar"
                      className="block w-full text-center py-3 bg-brand-teal text-white font-display font-semibold rounded-full hover:bg-brand-teal-dark transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Diagnóstico gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
