import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CarritoDrawer from "@/components/tienda/CarritoDrawer";
import CarritoExpiracionCheck from "@/components/tienda/CarritoExpiracionCheck";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CarritoExpiracionCheck />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CarritoDrawer />
    </>
  );
}
