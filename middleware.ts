import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const rol = user?.user_metadata?.rol as string | undefined;

  // ── Proteger /admin — solo rol admin ──────────────
  if (pathname.startsWith("/admin")) {
    if (!user) return NextResponse.redirect(new URL("/auth", request.url));
    if (rol !== "admin") return NextResponse.redirect(new URL("/portal", request.url));
    return response;
  }

  // ── Proteger /portal — solo rol especialista ──────
  if (
    pathname.startsWith("/portal") &&
    pathname !== "/portal/login" &&
    pathname !== "/portal/reset-password"
  ) {
    if (!user) return NextResponse.redirect(new URL("/portal/login", request.url));
    if (rol === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (rol !== "especialista") return NextResponse.redirect(new URL("/portal/login", request.url));
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
