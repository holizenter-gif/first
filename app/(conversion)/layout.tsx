import type { ReactNode } from "react";
import Footer         from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

// /agendar has its own header — no Navbar here.
// Other conversion pages (cotizador, pagar) also benefit from a clean shell.
export default function ConversionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
