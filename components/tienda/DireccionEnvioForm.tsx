"use client";

import { useState }             from "react";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { MapPin, AlertCircle }  from "lucide-react";
import { validarCP }            from "@/lib/envios";
import type { DireccionEnvio }  from "@/lib/envios";

interface Props { onChange: (d: DireccionEnvio | null) => void; }

const ESTADOS_MEXICO = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche",
  "Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango",
  "Estado de México","Guanajuato","Guerrero","Hidalgo","Jalisco","Michoacán",
  "Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
  "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco",
  "Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas",
];

export default function DireccionEnvioForm({ onChange }: Props) {
  const [d, setD] = useState<DireccionEnvio>({
    nombre: "", calle: "", numero: "", colonia: "",
    ciudad: "", estado: "", cp: "", referencias: "",
  });
  const [cpError, setCpError] = useState("");

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

    onChange(completa ? nueva : null);
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
    </div>
  );
}
