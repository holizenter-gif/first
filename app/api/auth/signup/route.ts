import { NextRequest, NextResponse } from "next/server";
import { createAdminClient }         from "@/lib/supabase/admin";
import {
  validateEmail, validatePassword, validatePasswordMatch, validateName,
} from "@/lib/auth-validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, apellido, email, password, confirm_password } = body;

    // Validaciones backend (nunca confiar solo en frontend)
    const errors: string[] = [];
    const eNombre   = validateName(nombre,   "Nombre");
    const eApellido = validateName(apellido,  "Apellido");
    const eEmail    = validateEmail(email);
    const ePwd      = validatePassword(password);
    const eMatch    = validatePasswordMatch(password, confirm_password);
    if (eNombre)   errors.push(eNombre);
    if (eApellido) errors.push(eApellido);
    if (eEmail)    errors.push(eEmail);
    if (ePwd)      errors.push(ePwd);
    if (eMatch)    errors.push(eMatch);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verificar que email no exista
    const { count } = await admin
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("email", email.trim().toLowerCase());

    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email:          email.trim().toLowerCase(),
      password,
      email_confirm:  true,
    });

    if (authError || !authData?.user) {
      console.error("Error creando auth user:", authError);
      return NextResponse.json({ error: "No se pudo crear la cuenta" }, { status: 400 });
    }

    const userId = authData.user.id;

    // Crear row en user_profiles
    const { error: profileError } = await admin.from("user_profiles").insert({
      id:        userId,
      nombre:    nombre.trim(),
      apellido:  apellido.trim(),
      email:     email.trim().toLowerCase(),
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Error creando user_profile:", profileError);
      // Rollback: eliminar usuario de auth
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Error al crear perfil de usuario" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user:    { id: userId, email: authData.user.email, nombre: nombre.trim(), apellido: apellido.trim() },
      message: "Cuenta creada correctamente",
    }, { status: 201 });

  } catch (error) {
    console.error("Error en signup:", error);
    return NextResponse.json({ error: "Error interno. Intenta de nuevo" }, { status: 500 });
  }
}
