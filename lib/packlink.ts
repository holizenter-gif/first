export async function cotizarEnvio(params: {
  pesoKg: number;
  cpDestino: string;
}): Promise<{ proveedor: string; precio: number; diasEntrega: number }[]> {
  console.log("📦 Cotizando envío para CP:", params.cpDestino);
  return [
    { proveedor: "DHL", precio: 149, diasEntrega: 2 },
    { proveedor: "FedEx", precio: 169, diasEntrega: 1 },
    { proveedor: "Estafeta", precio: 99, diasEntrega: 3 },
  ];
}
