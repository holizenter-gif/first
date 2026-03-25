interface ProductoGaleriaProps {
  imagenPrincipal: string;
  imagenesExtra: string[];
  nombre: string;
}

export default function ProductoGaleria({ imagenPrincipal, imagenesExtra, nombre }: ProductoGaleriaProps) {
  return (
    <div>
      <div className="aspect-square bg-brand-beige rounded-2xl flex items-center justify-center text-6xl">🛍️</div>
      {imagenesExtra.length > 0 && (
        <div className="flex gap-2 mt-3">
          {imagenesExtra.map((img, i) => (
            <div key={i} className="w-16 h-16 bg-brand-beige rounded-lg flex items-center justify-center text-xl">🖼️</div>
          ))}
        </div>
      )}
    </div>
  );
}
