import { getProductos } from "@/lib/data/productos-server";
import TiendaClientPage from "@/components/tienda/TiendaClientPage";

export const metadata = {
  title: "Tienda — Holizenter",
  description: "Cursos digitales, materiales descargables, kits físicos y membresías para tu bienestar integral.",
};

export default async function TiendaPage() {
  const productos = await getProductos({ soloActivos: true });
  return <TiendaClientPage productos={productos} />;
}
