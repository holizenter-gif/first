export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-green">404</h1>
        <p className="mt-4 text-lg text-gray-600">Página no encontrada</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-brand-gold text-white rounded-lg">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
