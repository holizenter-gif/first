import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import { validatePassword, validatePasswordMatch } from "@/lib/auth-validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, confirm_password } = body;

    // Validaciones backend
    if (!token?.trim()) {
      return NextResponse.json({ error: "Link expirado o inválido" }, { status: 401 });
    }
    const pwdErr   = validatePassword(password);
    const matchErr = validatePasswordMatch(password, confirm_password);
    if (pwdErr)   return NextResponse.json({ error: pwdErr   }, { status: 400 });
    if (matchErr) return NextResponse.json({ error: matchErr }, { status: 400 });

    const supabase = await createClient();

    // Validar token de recovery con Supabase
    const { data, error: otpError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type:       "recovery",
    });

    if (otpError || !data?.user) {
      console.error("OTP inválido:", otpError?.message);
      return NextResponse.json({ error: "Link expirado o inválido" }, { status: 401 });
    }

    // Actualizar contraseña usando admin client (bypass RLS)
    const admin = createAdminClient();
    const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, {
      password,
    });

    if (updateError) {
      console.error("Error actualizando contraseña:", updateError);
      return NextResponse.json({ error: "Error al actualizar contraseña" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.",
    });

  } catch (error) {
    console.error("Error en reset-confirm:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
