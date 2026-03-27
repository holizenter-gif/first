"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/lib/store/carrito";
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

type Paso = 1 | 2 | 3;

interface DatosComprador {
  nombre: string;
  email: string;
  whatsapp: string;
}

const PASOS = ["Tus datos", "Resumen", "Pago"];

function PasoIndicador({ paso }: { paso: Paso }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {PASOS.map((label, i) => {
        const num = (i + 1) as Paso;
        const activo = num === paso;
        const completado = num < paso;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold transition-all"
              style={{
                background: completado ? "#5CB996" : activo ? "#0D1A0F" : "#E5E7EB",
                color: completado || activo ? "#fff" : "#9CA3AF",
              }}
            >
              {completado ? <Check className="w-4 h-4" /> : num}
            </div>
            <span
              className="text-sm font-display font-medium hidden sm:block"
              style={{ color: activo ? "#0D1A0F" : "#9CA3AF" }}
            >
              {label}
            </span>
            {i < PASOS.length - 1 && (
              <div className="w-8 sm:w-16 h-px mx-2" style={{ background: "#E5E7EB" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vaciarCarrito, tieneProductosFisicos } = useCarrito();
  const [paso, setPaso] = useState<Paso>(1);
  const [datos, setDatos] = useState<DatosComprador>({ nombre: "", email: "", whatsapp: "" });
  const [errors, setErrors] = useState<Partial<DatosComprador>>({});
  const [loading, setLoading] = useState(false);
  const [preferenceUrl, setPreferenceUrl] = useState<string | null>(null);
  const [errorPago, setErrorPago] = useState<string | null>(null);

  const costoEnvio = tieneProductosFisicos() ? 150 : 0;
  const total = subtotal() + costoEnvio;

  // ── Paso 1: validar datos ──────────────────────────────────
  const validarDatos = () => {
    const e: Partial<DatosComprador> = {};
    if (!datos.nombre.trim()) e.nombre = "Requerido";
    if (!datos.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email))
      e.email = "Email inválido";
    if (!datos.whatsapp.trim() || datos.whatsapp.replace(/\D/g, "").length < 10)
      e.whatsapp = "Número inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const irPaso2 = () => {
    if (validarDatos()) setPaso(2);
  };

  // ── Paso 3: crear preferencia MP ─────────────────────────
  const crearPreferencia = async () => {
    setLoading(true);
    setErrorPago(null);
    try {
      const res = await fetch("/api/tienda/orden/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            producto_id: i.producto.id,
            nombre:      i.producto.nombre,
            tipo:        i.producto.categoria,
            precio:      i.producto.precio,
            cantidad:    i.cantidad,
            imagen_url:  i.producto.imagen_url,
          })),
          subtotal: subtotal(),
          costo_envio: costoEnvio,
          total,
          email_comprador:  datos.email,
          nombre_comprador: datos.nombre,
          whatsapp:         datos.whatsapp,
        }),
      });
      const json = await res.json();
      if (json.init_point) {
        setPreferenceUrl(json.init_point);
        vaciarCarrito();
        window.location.href = json.init_point;
      } else {
        setErrorPago("No se pudo generar el pago. Intenta de nuevo o contáctanos.");
      }
    } catch {
      setErrorPago("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Carrito vacío ─────────────────────────────────────────
  if (items.length === 0 && paso !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#EBF7F2" }}
        >
          <ShoppingBag className="w-8 h-8" style={{ color: "#5CB996" }} />
        </div>
        <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 font-sans mb-6">Agrega productos desde la tienda para continuar.</p>
        <Link
          href="/tienda"
          className="px-8 py-3 rounded-full font-display font-semibold text-white"
          style={{ background: "#5CB996" }}
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#F5F2EC" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-2xl" style={{ color: "#0D1A0F" }}>
            Finalizar compra
          </h1>
        </div>

        <PasoIndicador paso={paso} />

        {/* ── PASO 1: Datos ─────────────────────────────── */}
        {paso === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-display font-bold text-lg" style={{ color: "#0D1A0F" }}>
              ¿A quién le enviamos la confirmación?
            </h2>

            {(["nombre", "email", "whatsapp"] as const).map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-display font-medium mb-1.5" style={{ color: "#374151" }}>
                  {campo === "nombre" ? "Nombre completo" : campo === "email" ? "Email" : "WhatsApp (10 dígitos)"}
                </label>
                <input
                  type={campo === "email" ? "email" : campo === "whatsapp" ? "tel" : "text"}
                  value={datos[campo]}
                  onChange={(e) => setDatos({ ...datos, [campo]: e.target.value })}
                  placeholder={
                    campo === "nombre"
                      ? "Ej. Noemí Molina"
                      : campo === "email"
                      ? "correo@empresa.com"
                      : "55 1234 5678"
                  }
                  className="w-full px-4 py-3 rounded-xl border font-sans text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-teal"
                  style={{
                    borderColor: errors[campo] ? "#EF4444" : "#E5E7EB",
                  }}
                />
                {errors[campo] && (
                  <p className="text-xs text-red-500 mt-1">{errors[campo]}</p>
                )}
              </div>
            ))}

            <button
              onClick={irPaso2}
              className="w-full py-3.5 rounded-full font-display font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              style={{ background: "#5CB996" }}
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── PASO 2: Resumen ───────────────────────────── */}
        {paso === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-lg mb-4" style={{ color: "#0D1A0F" }}>
                Resumen de tu pedido
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "#EBF7F2" }}
                      >
                        {item.producto.categoria === "cursos"            && "🎓"}
                        {item.producto.categoria === "materiales"        && "📄"}
                        {item.producto.categoria === "merchandising"     && "🌿"}
                        {item.producto.categoria === "talleres_grabados" && "🎥"}
                        {item.producto.categoria === "membresia"         && "⭐"}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium" style={{ color: "#0D1A0F" }}>
                          {item.producto.nombre}
                        </p>
                        <p className="font-sans text-xs text-gray-400">x{item.cantidad}</p>
                      </div>
                    </div>
                    <span className="font-sans font-semibold text-sm" style={{ color: "#0D1A0F" }}>
                      ${(item.producto.precio * item.cantidad).toLocaleString("es-MX")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500 font-sans">
                  <span>Subtotal</span>
                  <span>${subtotal().toLocaleString("es-MX")} MXN</span>
                </div>
                {costoEnvio > 0 && (
                  <div className="flex justify-between text-sm text-gray-500 font-sans">
                    <span>Envío (CDMX)</span>
                    <span>${costoEnvio.toLocaleString("es-MX")} MXN</span>
                  </div>
                )}
                <div className="flex justify-between font-display font-bold text-base pt-1" style={{ color: "#0D1A0F" }}>
                  <span>Total</span>
                  <span>${total.toLocaleString("es-MX")} MXN</span>
                </div>
              </div>
            </div>

            {/* Datos del comprador */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-sm mb-3" style={{ color: "#0D1A0F" }}>
                Datos de contacto
              </h2>
              <p className="font-sans text-sm text-gray-600">{datos.nombre}</p>
              <p className="font-sans text-sm text-gray-600">{datos.email}</p>
              <p className="font-sans text-sm text-gray-600">{datos.whatsapp}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaso(1)}
                className="flex-1 py-3.5 rounded-full font-display font-semibold border transition-colors flex items-center justify-center gap-2"
                style={{ borderColor: "#0D1A0F", color: "#0D1A0F" }}
              >
                <ArrowLeft className="w-4 h-4" /> Editar
              </button>
              <button
                onClick={() => { setPaso(3); crearPreferencia(); }}
                className="flex-1 py-3.5 rounded-full font-display font-semibold text-white transition-colors flex items-center justify-center gap-2"
                style={{ background: "#5CB996" }}
              >
                Pagar con Mercado Pago <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Procesando ────────────────────────── */}
        {paso === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            {errorPago ? (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#FEF2F2" }}
                >
                  <span style={{ fontSize: "2rem" }}>⚠️</span>
                </div>
                <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
                  Hubo un problema
                </h2>
                <p className="font-sans text-sm text-gray-500 mb-6">{errorPago}</p>
                <button
                  onClick={() => { setPaso(2); setErrorPago(null); }}
                  className="px-6 py-3 rounded-full font-display font-semibold text-white text-sm"
                  style={{ background: "#5CB996" }}
                >
                  Intentar de nuevo
                </button>
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "#5CB996" }} />
                <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
                  Preparando tu pago…
                </h2>
                <p className="font-sans text-sm text-gray-500">
                  Serás redirigido a Mercado Pago en un momento.
                </p>
              </>
            ) : (
              <>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#EBF7F2" }}
                >
                  <Check className="w-8 h-8" style={{ color: "#5CB996" }} />
                </div>
                <h2 className="font-display font-bold text-xl mb-2" style={{ color: "#0D1A0F" }}>
                  ¡Redirigiendo!
                </h2>
                <p className="font-sans text-sm text-gray-500">
                  Si no eres redirigido automáticamente,{" "}
                  {preferenceUrl ? (
                    <a href={preferenceUrl} className="underline" style={{ color: "#5CB996" }}>
                      haz clic aquí
                    </a>
                  ) : (
                    <span>escríbenos por WhatsApp.</span>
                  )}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
