"use client";

import { useState }    from "react";
import { useRouter }   from "next/navigation";
import { Loader2, Eye, Save, Globe, EyeOff } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

const CATEGORIAS = [
  { value: "articulo",   label: "Artículo"       },
  { value: "noticia",    label: "Noticia"         },
  { value: "reflexion",  label: "Reflexión"       },
  { value: "guia",       label: "Guía"            },
  { value: "caso_exito", label: "Caso de éxito"   },
];

const QUIZ_OPTIONS = [
  { value: "",            label: "Sin quiz"                    },
  { value: "burnout",     label: "Quiz Burnout"                },
  { value: "estres",      label: "Quiz Estrés"                 },
  { value: "satisfaccion",label: "Quiz Satisfacción"           },
  { value: "clima",       label: "Quiz Clima NOM-035"          },
  { value: "holistico",   label: "Quiz Bienestar Holístico"    },
];

const AUTORES = ["Noemí Molina", "Ulises Zarco", "Holizenter"];

interface ArticuloEditorProps {
  articulo?: Partial<BlogPost>;
  modo:      "crear" | "editar";
}

export default function ArticuloEditor({ articulo, modo }: ArticuloEditorProps) {
  const router = useRouter();

  const [titulo,      setTitulo]      = useState(articulo?.titulo        ?? "");
  const [slug,        setSlug]        = useState(articulo?.slug          ?? "");
  const [descripcion, setDescripcion] = useState(articulo?.descripcion   ?? "");
  const [contenido,   setContenido]   = useState(articulo?.contenido     ?? "");
  const [categoria,   setCategoria]   = useState(articulo?.categoria     ?? "articulo");
  const [autor,       setAutor]       = useState(articulo?.autor         ?? "Holizenter");
  const [quiz_id,     setQuizId]      = useState(articulo?.quiz_id       ?? "");
  const [tags,        setTags]        = useState(articulo?.tags?.join(", ") ?? "");
  const [tiempo,      setTiempo]      = useState(articulo?.tiempo_lectura ?? "5 min");
  const [publicado,   setPublicado]   = useState(articulo?.publicado     ?? false);
  const [destacado,   setDestacado]   = useState(articulo?.destacado     ?? false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [preview,     setPreview]     = useState(false);

  const generarSlug = (texto: string) =>
    texto.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleTituloChange = (v: string) => {
    setTitulo(v);
    if (modo === "crear") setSlug(generarSlug(v));
  };

  const handleGuardar = async (publicar?: boolean) => {
    if (!titulo.trim() || !slug.trim()) {
      setError("El título y el slug son obligatorios.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const body = {
        titulo, slug, descripcion, contenido, categoria,
        autor, quiz_id: quiz_id || null,
        tags:     tags.split(",").map((t) => t.trim()).filter(Boolean),
        tiempo_lectura: tiempo,
        publicado: publicar !== undefined ? publicar : publicado,
        destacado,
      };

      const url    = modo === "crear" ? "/api/admin/articulos" : `/api/admin/articulos/${articulo?.id}`;
      const method = modo === "crear" ? "POST" : "PUT";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error guardando");

      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error guardando el artículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">

      {/* Editor principal */}
      <div className="lg:col-span-2 space-y-5">

        {/* Título */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="text-xs text-gray-500 font-display mb-1.5 block">Título *</label>
          <input
            value={titulo}
            onChange={(e) => handleTituloChange(e.target.value)}
            placeholder="Título del artículo"
            className="w-full text-lg font-display font-semibold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
          <div className="mt-2">
            <label className="text-xs text-gray-400 font-display mb-1 block">Slug (URL)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs whitespace-nowrap">holizenter.mx/blog/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(generarSlug(e.target.value))}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-teal"
                placeholder="url-del-articulo"
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="text-xs text-gray-500 font-display mb-1.5 block">
            Descripción / resumen (aparece en el listado y en Google)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            placeholder="Una línea que describe el artículo. Máx 160 caracteres recomendado."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{descripcion.length}/160 caracteres</p>
        </div>

        {/* Contenido MDX */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-gray-500 font-display">
              Contenido (soporta Markdown)
            </label>
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs text-brand-teal font-display hover:underline"
            >
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? "Editar" : "Vista previa"}
            </button>
          </div>

          {preview ? (
            <div className="prose prose-sm max-w-none min-h-[300px] p-3 border border-gray-100 rounded-lg bg-brand-beige">
              <p className="text-gray-400 text-xs italic">
                Vista previa disponible al guardar — edita el contenido en Markdown.
              </p>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{contenido}</pre>
            </div>
          ) : (
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={16}
              placeholder={`## Título de sección\n\nEscribe el cuerpo del artículo en Markdown.\n\n**Texto en negrita** e *italica*.\n\n- Lista de puntos\n- Otro punto`}
              className="w-full text-sm font-mono border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal resize-y"
            />
          )}
          <p className="text-xs text-gray-400 mt-1">
            Soporta Markdown: **negrita**, *cursiva*, ## títulos, - listas, [link](url)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

      </div>

      {/* Panel lateral */}
      <div className="space-y-4">

        {/* Acciones */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-display font-semibold text-brand-dark text-sm mb-4">Publicación</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Estado</span>
            <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full ${
              publicado ? "bg-brand-teal-50 text-brand-teal" : "bg-gray-100 text-gray-500"
            }`}>
              {publicado ? "Publicado" : "Borrador"}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
                className="accent-brand-teal"
              />
              <span className="text-sm text-gray-600">Artículo destacado</span>
            </label>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleGuardar()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-brand-dark text-brand-dark font-display font-medium py-2.5 rounded-full hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar borrador
            </button>
            <button
              onClick={() => handleGuardar(true)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white font-display font-semibold py-2.5 rounded-full transition-colors text-sm shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Publicar ahora
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <p className="font-display font-semibold text-brand-dark text-sm">Metadatos</p>

          <div>
            <label className="text-xs text-gray-500 font-display mb-1.5 block">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-display mb-1.5 block">Autor</label>
            <select
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white"
            >
              {AUTORES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-display mb-1.5 block">
              Quiz contextual (aparece dentro del artículo)
            </label>
            <select
              value={quiz_id}
              onChange={(e) => setQuizId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal bg-white"
            >
              {QUIZ_OPTIONS.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-display mb-1.5 block">
              Tags (separados por coma)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="burnout, NOM-035, mindfulness"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-display mb-1.5 block">
              Tiempo de lectura estimado
            </label>
            <input
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              placeholder="5 min"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
