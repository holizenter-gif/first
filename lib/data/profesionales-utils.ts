// Pure utility functions — safe to import in Client Components

export function getModalidadLabel(modalidad: string): string {
  const map: Record<string, string> = {
    presencial: "Presencial CDMX",
    online:     "Online",
    hibrido:    "Presencial + Online",
  };
  return map[modalidad] ?? modalidad;
}

export function formatPrecioSesion(precio: number): string {
  if (precio === 0) return "Consultar precio";
  return new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  }).format(precio) + " / sesión";
}
