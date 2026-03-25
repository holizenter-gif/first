export default function ProfesionalPage({ params }: { params: { slug: string } }) {
  return <div className="min-h-screen p-8"><h1>Profesional: {params.slug}</h1></div>;
}
