export default function QuizResultadoPage({ params }: { params: { id: string } }) {
  return <div className="min-h-screen p-8"><h1>Resultado Quiz: {params.id}</h1></div>;
}
