"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Download, CalendarDays, Flame } from "lucide-react";

const TABS = [
  { href: "/mi-perfil/datos",       label: "Mis datos",    Icon: User          },
  { href: "/mi-perfil/direcciones", label: "Direcciones",  Icon: MapPin        },
  { href: "/mi-perfil/compras",     label: "Compras",      Icon: ShoppingBag   },
  { href: "/mi-perfil/descargas",   label: "Descargas",    Icon: Download      },
  { href: "/mi-perfil/eventos",     label: "Mis eventos",  Icon: CalendarDays  },
  { href: "/mi-perfil/tareas",      label: "Tareas",       Icon: Flame         },
];

export default function MiPerfilTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: "#F5F2EC" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-sans font-bold text-2xl mb-6" style={{ color: "#0D1A0F" }}>
          Mi perfil
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-x-auto">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans font-medium text-sm whitespace-nowrap transition-colors flex-1 justify-center"
                style={{
                  background: active ? "#5CB996" : "transparent",
                  color:      active ? "#fff"    : "#6B7280",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}
