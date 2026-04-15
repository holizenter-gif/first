import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CarritoDrawer from "@/components/tienda/CarritoDrawer";
import CarritoExpiracionCheck from "@/components/tienda/CarritoExpiracionCheck";
import BotonCarritoMovil from "@/components/tienda/BotonCarritoMovil";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CarritoExpiracionCheck />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        <BotonCarritoMovil />
      </div>
      <WhatsAppButton />
      <CarritoDrawer />
    </>
  );
}
