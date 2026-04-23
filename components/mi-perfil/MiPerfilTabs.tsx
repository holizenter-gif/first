"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Download, CalendarDays, Flame, Moon, Shield, Leaf } from "lucide-react";

const TABS_BIENESTAR = [
  { href: "/mi-perfil/tareas",       label: "Tareas",       Icon: Flame  },
  { href: "/mi-perfil/sueno",        label: "Sueño",        Icon: Moon   },
  { href: "/mi-perfil/resiliencia",  label: "Resiliencia",  Icon: Shield },
];

const TABS_CUENTA = [
  { href: "/mi-perfil/datos",        label: "Mis datos",    Icon: User          },
  { href: "/mi-perfil/direcciones",  label: "Direcciones",  Icon: MapPin        },
  { href: "/mi-perfil/compras",      label: "Compras",      Icon: ShoppingBag   },
  { href: "/mi-perfil/descargas",    label: "Descargas",    Icon: Download      },
  { href: "/mi-perfil/eventos",      label: "Mis eventos",  Icon: CalendarDays  },
];

const ALL_TABS = [...TABS_BIENESTAR, ...TABS_CUENTA];

export default function MiPerfilTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeTab = ALL_TABS.find((t) => pathname.startsWith(t.href));

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl mx-auto px-4">

        {/* Hero de perfil — inspirado en el boceto */}
        <div className="pt-8 pb-5">
          <div
            className="rounded-2xl px-6 py-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #2D7A5F 0%, #0D1A0F 100%)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(92,185,150,0.25)", border: "2px solid rgba(255,255,255,0.15)" }}
            >
              <Leaf className="w-6 h-6" style={{ color: "#5CB996" }} />
            </div>
            <div>
              <p className="font-sans text-xs font-medium mb-0.5"
                style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
                MI PERFIL
              </p>
              <p className="font-display font-bold text-xl text-white leading-tight">
                {activeTab?.label ?? "Cuenta"}
              </p>
            </div>
          </div>
        </div>

        {/* Grupo Bienestar */}
        <div className="mb-5">
          <p className="font-sans text-xs font-semibold mb-2.5 px-0.5"
            style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>
            BIENESTAR
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {TABS_BIENESTAR.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-semibold text-sm whitespace-nowrap transition-colors"
                  style={{
                    background: active ? "#0D1A0F" : "#FFFFFF",
                    color:      active ? "#FFFFFF" : "#6B7280",
                    border:     active ? "none"    : "1.5px solid #E5E7EB",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Grupo Mi cuenta */}
        <div className="mb-6">
          <p className="font-sans text-xs font-semibold mb-2.5 px-0.5"
            style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>
            MI CUENTA
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {TABS_CUENTA.map(({ href, label, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-semibold text-sm whitespace-nowrap transition-colors"
                  style={{
                    background: active ? "#0D1A0F" : "#FFFFFF",
                    color:      active ? "#FFFFFF" : "#6B7280",
                    border:     active ? "none"    : "1.5px solid #E5E7EB",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contenido de la sección activa */}
        <div className="pb-16">
          {children}
        </div>
      </div>
    </div>
  );
}
