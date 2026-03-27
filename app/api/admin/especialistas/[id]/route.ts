import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";
import { sendEmail }                 from "@/lib/brevo";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { accion, notas } = await req.json();
  if (!["aprobar", "rechazar"].includes(accion)) {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  const { data: sol, error: solError } = await supabase
    .from("solicitudes_especialistas")
    .select("*")
    .eq("id", id)
    .single();

  if (solError || !sol) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  if (accion === "aprobar") {
    // 1. Actualizar rol en Auth
    await supabase.auth.admin.updateUserById(sol.user_id, {
      user_metadata: { nombre: sol.nombre, rol: "especialista" },
    });

    // 2. Crear perfil en profesionales
    const slug = (sol.nombre as string)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const { data: prof } = await supabase
      .from("profesionales")
      .insert({
        nombre:           sol.nombre,
        slug,
        especialidad:     sol.especialidad,
        bio:              sol.bio,
        bio_corta:        sol.bio?.slice(0, 160) ?? null,
        certificaciones:  sol.certificaciones
          ? (sol.certificaciones as string).split(",").map((c: string) => c.trim())
          : [],
        experiencia_anos: sol.experiencia_anos,
        modalidad:        "hibrido",
        activo:           true,
        user_id:          sol.user_id,
        orden:            99,
      })
      .select()
      .single();

    // 3. Actualizar solicitud
    await supabase
      .from("solicitudes_especialistas")
      .update({
        status:         "aprobado",
        notas_admin:    notas ?? null,
        profesional_id: prof?.id ?? null,
      })
      .eq("id", id);

    // 4. Email de aprobación
    await sendEmail({
      to: [{ email: sol.email, name: sol.nombre }],
      subject: "¡Tu solicitud fue aprobada! — Holizenter 🎉",
      htmlContent: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;background:#F5F2EC">
          <div style="background:#0D1A0F;padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#5CB996;font-size:18px;letter-spacing:2px">HOLIZENTER</h1>
          </div>
          <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px">
            <h2 style="color:#0D1A0F">¡Bienvenido/a al equipo, ${sol.nombre}! 🎉</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.7">
              Tu solicitud para formar parte del directorio de especialistas de Holizenter
              ha sido <strong style="color:#5CB996">aprobada</strong>.
            </p>
            <div style="text-align:center;margin:20px 0">
              <a href="https://holizenter.mx/portal/login"
                 style="background:#5CB996;color:#fff;padding:12px 28px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px">
                Entrar a mi portal →
              </a>
            </div>
            ${notas ? `<p style="color:#6B7280;font-size:13px;background:#F5F2EC;padding:12px;border-radius:8px"><b>Nota:</b> ${notas}</p>` : ""}
            <p style="color:#9CA3AF;font-size:12px;margin-top:20px">Noemí y Ulises · Holizenter</p>
          </div>
        </div>`,
    });

  } else {
    // RECHAZAR
    await supabase
      .from("solicitudes_especialistas")
      .update({ status: "rechazado", notas_admin: notas ?? null })
      .eq("id", id);

    if (sol.user_id) {
      await supabase.auth.admin.updateUserById(sol.user_id, {
        ban_duration: "876000h",
      });
    }

    await sendEmail({
      to: [{ email: sol.email, name: sol.nombre }],
      subject: "Actualización sobre tu solicitud — Holizenter",
      htmlContent: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px 16px;background:#F5F2EC">
          <div style="background:#0D1A0F;padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="margin:0;color:#5CB996;font-size:18px;letter-spacing:2px">HOLIZENTER</h1>
          </div>
          <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px">
            <h2 style="color:#0D1A0F">Hola ${sol.nombre}</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.7">
              Revisamos tu solicitud con atención y en este momento no podemos
              incorporarte al directorio de especialistas.
            </p>
            ${notas ? `<p style="color:#6B7280;font-size:14px;background:#F5F2EC;padding:12px;border-radius:8px">${notas}</p>` : ""}
            <p style="color:#6B7280;font-size:14px">
              Si tienes preguntas, escríbenos a
              <a href="mailto:hola@holizenter.mx" style="color:#5CB996">hola@holizenter.mx</a>
            </p>
            <p style="color:#9CA3AF;font-size:12px;margin-top:20px">Noemí y Ulises · Holizenter</p>
          </div>
        </div>`,
    });
  }

  return NextResponse.json({ success: true });
}
