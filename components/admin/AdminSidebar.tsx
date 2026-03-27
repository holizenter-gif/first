"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, CreditCard, Users,
  LogOut, Menu, X, ShoppingBag, FileText,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { href: "/admin",            label: "Dashboard",    Icon: LayoutDashboard },
      { href: "/admin/citas",      label: "Citas",        Icon: Calendar        },
      { href: "/admin/pagos",      label: "Pagos",        Icon: CreditCard      },
    ],
  },
  {
    label: "Directorio",
    items: [
      { href: "/admin/directorio",    label: "Especialistas",  Icon: Users      },
      { href: "/admin/especialistas", label: "Solicitudes",    Icon: UserCheck  },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/blog",   label: "Blog",   Icon: FileText    },
      { href: "/admin/tienda", label: "Tienda", Icon: ShoppingBag },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--hl-divider)" }}>
        <p className="font-sans font-bold" style={{ fontSize: "16px", color: "var(--hl-text)" }}>
          Holizenter
        </p>
        <p className="font-sans" style={{ fontSize: "11px", color: "var(--hl-text-muted)" }}>
          Admin
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-1 text-xs font-sans font-semibold uppercase tracking-wider"
              style={{ color: "var(--hl-text-muted)" }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 font-sans font-medium transition-colors"
                    style={{
                      fontSize:   "14px",
                      borderRadius: "6px",
                      color:      active ? "#fff" : "var(--hl-text)",
                      background: active ? "var(--hl-green)" : "transparent",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--hl-divider)" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full font-sans transition-colors hover:opacity-70"
          style={{ fontSize: "14px", color: "var(--hl-text-muted)", borderRadius: "6px" }}
        >
          <LogOut size={16} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 min-h-screen sticky top-0"
        style={{
          background:   "#fff",
          borderRight:  "1px solid var(--hl-divider)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{
          background:   "#fff",
          borderBottom: "1px solid var(--hl-divider)",
        }}
      >
        <p className="font-sans font-bold" style={{ fontSize: "15px", color: "var(--hl-text)" }}>
          Holizenter Admin
        </p>
        <button onClick={() => setOpen((v) => !v)} style={{ color: "var(--hl-text)" }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30"
          onClick={() => setOpen(false)}
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div
            className="w-52 h-full"
            style={{ background: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
