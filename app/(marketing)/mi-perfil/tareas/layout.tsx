"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SUBTABS = [
  { href: "/mi-perfil/tareas",          label: "Hoy"      },
  { href: "/mi-perfil/tareas/historial", label: "Historial" },
  { href: "/mi-perfil/tareas/progreso",  label: "Progreso"  },
];

export default function TareasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
        {SUBTABS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-lg font-sans font-medium text-sm transition-colors"
              style={{
                background: active ? "#0D1A0F" : "transparent",
                color:      active ? "#FFFFFF" : "#6B7280",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
