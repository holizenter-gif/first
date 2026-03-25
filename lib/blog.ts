import fs   from "fs";
import path from "path";
import matter      from "gray-matter";
import readingTime from "reading-time";

export interface BlogPost {
  slug:           string;
  titulo:         string;
  descripcion:    string;
  fecha:          string;
  autor:          string;
  categoria:      string;
  imagen:         string;
  keywords:       string[];
  tiempo_lectura: string;
  contenido:      string;
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      return {
        slug:           data.slug           ?? file.replace(".mdx", ""),
        titulo:         data.titulo         ?? "",
        descripcion:    data.descripcion    ?? "",
        fecha:          data.fecha          ?? "",
        autor:          data.autor          ?? "Holizenter",
        categoria:      data.categoria      ?? "Bienestar",
        imagen:         data.imagen         ?? "/blog/default.jpg",
        keywords:       data.keywords       ?? [],
        tiempo_lectura: data.tiempo_lectura ?? `${Math.ceil(stats.minutes)} min`,
        contenido:      content,
      } as BlogPost;
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  return getAllPosts().filter((p) => p.slug !== slug).slice(0, limit);
}
