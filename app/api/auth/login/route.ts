import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { validateEmail }             from "@/lib/auth-validation";

const GENERIC_ERROR = "Email o contraseña inválidos";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validaciones backend
    const emailErr = validateEmail(email);
    if (emailErr) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    if (!password?.trim()) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.session) {
      // Nunca revelar si el usuario existe o no
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: {
        access_token:  data.session.access_token,
        refresh_token: data.session.refresh_token,
        user_id:       data.user?.id,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
