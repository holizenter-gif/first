import type { ReactNode } from "react";
import PortalSidebar from "@/components/portal/PortalSidebar";

export default function PortalAppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
