import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Holizenter",
  description: "Términos y condiciones de uso de la plataforma Holizenter, incluyendo contratación de servicios, tienda y portal de especialistas.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display font-bold text-lg mb-3" style={{ color: "#0D1A0F" }}>
        {title}
      </h2>
      <div className="font-sans text-sm leading-relaxed space-y-2" style={{ color: "#6B7280" }}>
        {children}
      </div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen py-14 px-4" style={{ background: "#F5F2EC" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#5CB996" }}>
            Legal
          </p>
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "#0D1A0F" }}>
            Términos y Condiciones
          </h1>
          <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>
            Última actualización: marzo 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          <Section title="Aceptación de términos">
            <p>
              Al acceder o usar la plataforma Holizenter (holizenter.com), aceptas quedar vinculado
              a estos Términos y Condiciones. Si no estás de acuerdo, no uses nuestra plataforma.
            </p>
          </Section>

          <Section title="Servicios">
            <p>
              Holizenter ofrece diagnósticos de bienestar laboral, talleres, sesiones con especialistas
              y productos digitales y físicos a través de su tienda. Los servicios están dirigidos a
              empresas y profesionales ubicados principalmente en México.
            </p>
          </Section>

          <Section title="Diagnósticos y quizzes">
            <p>
              Los diagnósticos gratuitos (burnout, estrés, clima, etc.) son herramientas orientativas
              y no constituyen diagnóstico clínico ni médico. Los resultados son de carácter informativo
              y están basados en modelos reconocidos de bienestar organizacional.
            </p>
          </Section>

          <Section title="Compras en la tienda">
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Los precios están expresados en pesos mexicanos (MXN) e incluyen IVA cuando aplica.</li>
              <li>Los productos digitales no son reembolsables una vez entregados.</li>
              <li>Los productos físicos pueden ser devueltos dentro de los 7 días naturales siguientes a su recepción, siempre que estén en su empaque original y sin uso.</li>
              <li>El carrito de compras expira a las 24 horas de inactividad.</li>
            </ul>
          </Section>

          <Section title="Contratación de servicios empresariales">
            <p>
              Los talleres y programas corporativos requieren un anticipo del 30% para confirmar la
              fecha. El saldo restante se liquida antes de la realización del servicio. Las
              cancelaciones con menos de 48 horas de anticipación pueden estar sujetas a un cargo
              del 50% del anticipo.
            </p>
          </Section>

          <Section title="Portal de especialistas">
            <p>
              Los especialistas que forman parte del directorio de Holizenter han sido verificados
              por nuestro equipo. Holizenter no se responsabiliza por la relación directa entre
              el especialista y el cliente fuera de la plataforma.
            </p>
          </Section>

          <Section title="Propiedad intelectual">
            <p>
              Todo el contenido de la plataforma —textos, imágenes, logotipos, diseños— es propiedad
              de Holizenter o de sus licenciantes y está protegido por la legislación mexicana e
              internacional de propiedad intelectual. No está permitida su reproducción sin autorización
              expresa y por escrito.
            </p>
          </Section>

          <Section title="Limitación de responsabilidad">
            <p>
              Holizenter no será responsable de daños indirectos, incidentales o consecuentes
              derivados del uso de la plataforma o de la aplicación de los diagnósticos. En ningún
              caso la responsabilidad total de Holizenter excederá el monto pagado por el servicio
              en cuestión.
            </p>
          </Section>

          <Section title="Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
              controversia será sometida a los tribunales competentes de la Ciudad de México.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Para dudas sobre estos términos, escríbenos a{" "}
              <a href="mailto:hola@holizenter.com" style={{ color: "#5CB996" }}>
                hola@holizenter.com
              </a>
              .
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
