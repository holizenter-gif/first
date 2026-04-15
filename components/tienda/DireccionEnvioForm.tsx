"use client";

import { useState }             from "react";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { MapPin, AlertCircle, Loader2, Truck }  from "lucide-react";
import { validarCP }            from "@/lib/envios";
import type { DireccionEnvio }  from "@/lib/envios";
import type { TarifaEnvio }     from "@/lib/skydropx";

interface ItemRef { id: string; cantidad: number; }

interface Props {
  onChange: (d: DireccionEnvio | null, costoEnvio?: number) => void;
  items?:   ItemRef[];
}

const ESTADOS_MEXICO = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche",
  "Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango",
  "Estado de México","Guanajuato","Guerrero","Hidalgo","Jalisco","Michoacán",
  "Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
  "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco",
  "Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas",
];

export default function DireccionEnvioForm({ onChange, items = [] }: Props) {
  const [d, setD] = useState<DireccionEnvio>({
    nombre: "", calle: "", numero: "", colonia: "",
    ciudad: "", estado: "", cp: "", referencias: "",
  });
  const [cpError,      setCpError]      = useState("");
  const [tarifas,      setTarifas]      = useState<TarifaEnvio[]>([]);
  const [costoFijo,    setCostoFijo]    = useState(199);
  const [cotizando,    setCotizando]    = useState(false);
  const [tarifaElegida, setTarifaElegida] = useState<TarifaEnvio | null>(null);

  const cotizar = async (cp: string, direccion: DireccionEnvio) => {
    setCotizando(true);
    setTarifas([]);
    setTarifaElegida(null);
    try {
      const res = await fetch("/api/envios/cotizar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ cp_destino: cp, items }),
      });
      const data = await res.json();
      const tarifasOk: TarifaEnvio[] = data.tarifas ?? [];
      const fijo: number = data.costo_fijo ?? 199;
      setCostoFijo(fijo);
      setTarifas(tarifasOk);
      // Auto-select cheapest or fixed
      if (tarifasOk.length > 0) {
        const barata = tarifasOk.reduce((a, b) => a.precio < b.precio ? a : b);
        setTarifaElegida(barata);
        onChange(direccion, barata.precio);
      } else {
        onChange(direccion, fijo);
      }
    } catch {
      onChange(direccion, costoFijo);
    } finally {
      setCotizando(false);
    }
  };

  const update = (campo: keyof DireccionEnvio, valor: string) => {
    const nueva = { ...d, [campo]: valor };
    setD(nueva);

    if (campo === "cp") {
      const { valido, error } = validarCP(valor);
      setCpError(error ?? "");
      if (!valido) { onChange(null); return; }
    }

    const completa =
      nueva.nombre && nueva.calle && nueva.numero &&
      nueva.colonia && nueva.ciudad && nueva.estado &&
      nueva.cp && validarCP(nueva.cp).valido;

    if (completa) {
      cotizar(nueva.cp, nueva);
    } else {
      onChange(null);
    }
  };

  const elegirTarifa = (tarifa: TarifaEnvio) => {
    setTarifaElegida(tarifa);
    const completa =
      d.nombre && d.calle && d.numero &&
      d.colonia && d.ciudad && d.estado &&
      d.cp && validarCP(d.cp).valido;
    if (completa) onChange(d, tarifa.precio);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-brand-teal" />
        <p className="font-display font-semibold text-brand-dark text-sm">
          Dirección de envío
        </p>
      </div>

      <div>
        <Label className="text-xs text-gray-500 font-display mb-1 block">
          Nombre del destinatario *
        </Label>
        <Input value={d.nombre} onChange={(e) => update("nombre", e.target.value)}
          placeholder="Nombre completo de quien recibe" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Label className="text-xs text-gray-500 font-display mb-1 block">Calle *</Label>
          <Input value={d.calle} onChange={(e) => update("calle", e.target.value)}
            placeholder="Nombre de la calle" />
        </div>
        <div>
          <Label className="text-xs text-gray-500 font-display mb-1 block">Número *</Label>
          <Input value={d.numero} onChange={(e) => update("numero", e.target.value)}
            placeholder="123" />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-500 font-display mb-1 block">Colonia *</Label>
        <Input value={d.colonia} onChange={(e) => update("colonia", e.target.value)}
          placeholder="Colonia o fraccionamiento" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-500 font-display mb-1 block">Ciudad *</Label>
          <Input value={d.ciudad} onChange={(e) => update("ciudad", e.target.value)}
            placeholder="Ciudad o municipio" />
        </div>
        <div>
          <Label className="text-xs text-gray-500 font-display mb-1 block">
            Código postal *
          </Label>
          <Input value={d.cp} onChange={(e) => update("cp", e.target.value)}
            placeholder="03240" maxLength={5} />
          {cpError && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {cpError}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-500 font-display mb-1 block">Estado *</Label>
        <select
          value={d.estado}
          onChange={(e) => update("estado", e.target.value)}
          className="w-full text-sm border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white"
        >
          <option value="">Selecciona tu estado</option>
          {ESTADOS_MEXICO.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      <div>
        <Label className="text-xs text-gray-500 font-display mb-1 block">
          Referencias (opcional)
        </Label>
        <Input value={d.referencias} onChange={(e) => update("referencias", e.target.value)}
          placeholder="Entre calles, color de fachada, etc." />
      </div>

      {/* Opciones de envío */}
      {cotizando && (
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-teal" />
          Cotizando opciones de envío…
        </div>
      )}

      {!cotizando && tarifas.length > 0 && (
        <div className="pt-2 space-y-2">
          <p className="text-xs font-display font-semibold text-gray-600 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Opciones de envío
          </p>
          {tarifas.map((tarifa) => (
            <label
              key={tarifa.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all"
              style={{
                borderColor: tarifaElegida?.id === tarifa.id ? "#5CB996" : "#E5E7EB",
                background:  tarifaElegida?.id === tarifa.id ? "#EBF7F2" : "#fff",
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tarifa_envio"
                  checked={tarifaElegida?.id === tarifa.id}
                  onChange={() => elegirTarifa(tarifa)}
                  className="accent-[#5CB996]"
                />
                <div>
                  <p className="text-xs font-display font-semibold text-gray-700">
                    {tarifa.proveedor}
                    <span className="font-normal text-gray-400 ml-1">— {tarifa.servicio}</span>
                  </p>
                  {tarifa.dias > 0 && (
                    <p className="text-xs text-gray-400">{tarifa.dias} día{tarifa.dias !== 1 ? "s" : ""} hábiles</p>
                  )}
                </div>
              </div>
              <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>
                ${tarifa.precio.toLocaleString("es-MX")} MXN
              </span>
            </label>
          ))}
        </div>
      )}

      {!cotizando && tarifas.length === 0 && costoFijo > 0 && d.cp && validarCP(d.cp).valido && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs">
          <span className="font-display text-gray-500 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Envío estándar
          </span>
          <span className="font-display font-bold text-sm" style={{ color: "#0D1A0F" }}>
            ${costoFijo.toLocaleString("es-MX")} MXN
          </span>
        </div>
      )}
    </div>
  );
}
