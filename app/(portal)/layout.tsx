import type { ReactNode } from "react";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen" style={{ background: "var(--hl-beige)" }}>{children}</div>;
}
