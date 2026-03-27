"use client";

import Link                           from "next/link";
import { usePathname, useRouter }     from "next/navigation";
import {
  LayoutDashboard, Calendar, Clock, BarChart2, User, LogOut, Menu, X,
} from "lucide-react";
import { useState }                   from "react";
import { createClient }               from "@/lib/supabase/client";
import Logo                           from "@/components/brand/Logo";

const NAV = [
  { href: "/portal",               icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/portal/citas",         icon: Calendar,        label: "Mis citas"      },
  { href: "/portal/disponibilidad",icon: Clock,           label: "Disponibilidad" },
  { href: "/portal/metricas",      icon: BarChart2,       label: "Métricas"       },
  { href: "/portal/perfil",        icon: User,            label: "Mi perfil"      },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0D1A0F" }}>
      <div className="px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Logo variant="blanco" size="xs" />
        <p className="text-xs mt-1 font-sans" style={{ color: "rgba(255,255,255,0.3)" }}>
          Portal Especialista
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all"
              style={
                active
                  ? { background: "#5CB996", color: "#fff" }
                  : { color: "rgba(255,255,255,0.6)" }
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-sans transition-all hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function PortalSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: "#0D1A0F", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Logo variant="blanco" size="xs" />
        <button onClick={() => setOpen((v) => !v)} style={{ color: "rgba(255,255,255,0.6)" }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="w-56 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
