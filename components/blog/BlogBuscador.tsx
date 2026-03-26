"use client";

import { useState }    from "react";
import { useRouter }   from "next/navigation";
import { Search }      from "lucide-react";

export default function BlogBuscador() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/blog?busqueda=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar artículos..."
        className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 pl-11 pr-4 py-3 rounded-full text-sm font-display focus:outline-none focus:border-brand-teal transition-colors"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-display font-semibold px-4 py-1.5 rounded-full transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
