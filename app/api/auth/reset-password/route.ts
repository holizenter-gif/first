import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { validateEmail }             from "@/lib/auth-validation";

const SUCCESS_MSG = "Si el email existe en nuestra plataforma, recibirás un link para recuperar tu contraseña.";

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json();
    const { email } = body;

    const emailErr = validateEmail(email);
    if (emailErr) return NextResponse.json({ error: "Email inválido" }, { status: 400 });

    const supabase    = await createClient();
    const redirectTo  = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.com"}/auth/reset-confirm`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    if (error) {
      // Loguear el error internamente pero nunca revelar si el email existe
      console.error("Error en resetPasswordForEmail:", error);
    }

    // Siempre retornar success (no revelar si email está registrado)
    return NextResponse.json({ success: true, message: SUCCESS_MSG });

  } catch (error) {
    console.error("Error en reset-password:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
