import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { sendEmail }                 from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nombre, email, password, especialidad, bio,
      certificaciones, experiencia_anos, motivacion,
      whatsapp, linkedin, sitio_web,
    } = body;

    if (!nombre || !email || !password || !especialidad) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Verificar que el email no tenga solicitud previa
    const { data: existe } = await supabase
      .from("solicitudes_especialistas")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (existe) {
      const msgs: Record<string, string> = {
        pendiente: "Ya tienes una solicitud pendiente de revisión.",
        aprobado:  "Tu solicitud ya fue aprobada. Revisa tu email.",
        rechazado: "Tu solicitud fue rechazada anteriormente. Escríbenos a hola@holizenter.mx.",
      };
      return NextResponse.json(
        { error: msgs[existe.status as string] ?? "Ya existe una solicitud." },
        { status: 400 }
      );
    }

    // 2. Crear cuenta en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombre,
        rol: "especialista_pendiente",
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return NextResponse.json({ error: "Este email ya está registrado." }, { status: 400 });
      }
      throw authError;
    }

    // 3. Guardar solicitud
    await supabase.from("solicitudes_especialistas").insert({
      nombre, email, especialidad, bio,
      certificaciones,
      experiencia_anos: Number(experiencia_anos) || 0,
      motivacion, whatsapp, linkedin, sitio_web,
      status:  "pendiente",
      user_id: authData.user.id,
    });

    // 4. Email al especialista
    await sendEmail({
      to: [{ email, name: nombre }],
      subject: "Recibimos tu solicitud — Holizenter 🌿",
      htmlContent: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;background:#F5F2EC">
          <div style="background:#0D1A0F;padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#5CB996;font-size:18px;letter-spacing:2px">HOLIZENTER</h1>
          </div>
          <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px">
            <h2 style="color:#0D1A0F;font-size:18px">Hola ${nombre}, recibimos tu solicitud ✅</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.7">
              Gracias por tu interés en formar parte del directorio de especialistas de Holizenter.
              Revisaremos tu solicitud y te contactaremos en los próximos 3-5 días hábiles.
            </p>
            <p style="color:#9CA3AF;font-size:12px;margin-top:20px">Noemí y Ulises · Holizenter</p>
          </div>
        </div>`,
    });

    // 5. Notificación al admin
    await sendEmail({
      to: [{ email: "hola@holizenter.mx", name: "Holizenter Admin" }],
      subject: `🧑‍⚕️ Nueva solicitud de especialista: ${nombre}`,
      htmlContent: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2>Nueva solicitud de especialista</h2>
          <table style="width:100%;font-size:13px">
            <tr><td><b>Nombre:</b></td><td>${nombre}</td></tr>
            <tr><td><b>Email:</b></td><td>${email}</td></tr>
            <tr><td><b>Especialidad:</b></td><td>${especialidad}</td></tr>
            <tr><td><b>Experiencia:</b></td><td>${experiencia_anos ?? 0} años</td></tr>
            <tr><td><b>WhatsApp:</b></td><td>${whatsapp ?? "—"}</td></tr>
          </table>
          <p style="margin-top:16px">
            <a href="https://holizenter.mx/admin/especialistas"
               style="background:#5CB996;color:#fff;padding:10px 20px;border-radius:99px;text-decoration:none;font-weight:600">
              Revisar en el admin →
            </a>
          </p>
        </div>`,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error en solicitud especialista:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
