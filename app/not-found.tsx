import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | Holizenter",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#F5F2EC" }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "#EBF7F2" }}
      >
        <span style={{ fontSize: "2rem" }}>🌿</span>
      </div>

      <h1
        className="font-display font-bold text-5xl mb-3"
        style={{ color: "#0D1A0F" }}
      >
        404
      </h1>
      <p
        className="font-display font-semibold text-xl mb-2"
        style={{ color: "#0D1A0F" }}
      >
        Esta página no existe
      </p>
      <p className="font-sans text-base text-gray-500 mb-8 max-w-md">
        Puede que el enlace haya cambiado o que la página haya sido eliminada.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-full font-sans font-semibold text-white text-sm transition-opacity hover:opacity-90"
          style={{ background: "#5CB996" }}
        >
          Ir al inicio
        </Link>
        <Link
          href="/directorio"
          className="px-6 py-3 rounded-full font-sans font-semibold text-sm border transition-colors"
          style={{ borderColor: "#5CB996", color: "#5CB996" }}
        >
          Ver especialistas
        </Link>
      </div>
    </div>
  );
}
