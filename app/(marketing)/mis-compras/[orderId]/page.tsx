export default function OrdenPage({ params }: { params: { orderId: string } }) {
  return <div className="min-h-screen p-8"><h1>Orden: {params.orderId}</h1></div>;
}
