export default function PagarPage({ params }: { params: { id: string } }) {
  return <div className="min-h-screen p-8"><h1>Pago: {params.id}</h1></div>;
}
