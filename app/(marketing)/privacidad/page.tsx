import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Holizenter",
  description: "Conoce cómo Holizenter recopila, usa y protege tu información personal conforme a la Ley Federal de Protección de Datos Personales.",
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

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen py-14 px-4" style={{ background: "#F5F2EC" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#5CB996" }}>
            Legal
          </p>
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "#0D1A0F" }}>
            Aviso de Privacidad
          </h1>
          <p className="font-sans text-sm" style={{ color: "#9CA3AF" }}>
            Última actualización: marzo 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          <Section title="Responsable del tratamiento">
            <p>
              <strong style={{ color: "#374151" }}>Holizenter</strong> (en adelante "Holizenter"),
              con domicilio en Ciudad de México, es responsable del tratamiento de los datos personales
              que nos proporciones, de conformidad con la Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </Section>

          <Section title="Datos personales que recabamos">
            <p>Recabamos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nombre completo y correo electrónico</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Nombre de empresa y sector</li>
              <li>Número de colaboradores</li>
              <li>Respuestas a diagnósticos y quizzes de bienestar</li>
              <li>Información de facturación para compras en la tienda</li>
            </ul>
          </Section>

          <Section title="Finalidades del tratamiento">
            <p>Tus datos son usados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Enviar tu reporte de diagnóstico personalizado</li>
              <li>Agendar y confirmar citas y sesiones</li>
              <li>Procesar órdenes de compra y enviar comprobantes</li>
              <li>Informarte sobre servicios, talleres y novedades de Holizenter (con tu consentimiento)</li>
              <li>Mejorar nuestros servicios y plataforma</li>
            </ul>
          </Section>

          <Section title="Transferencia de datos">
            <p>
              No transferimos tus datos personales a terceros sin tu consentimiento, salvo en los
              casos previstos por la ley o cuando sea necesario para la prestación del servicio
              (por ejemplo, procesadores de pago o plataformas de agendamiento).
            </p>
          </Section>

          <Section title="Cookies y tecnologías de rastreo">
            <p>
              Utilizamos cookies propias y de terceros (Google Analytics, GTM) para analizar el
              uso de nuestra plataforma y mejorar la experiencia del usuario. Puedes desactivar las
              cookies desde la configuración de tu navegador.
            </p>
          </Section>

          <Section title="Derechos ARCO">
            <p>
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos
              personales (derechos ARCO). Para ejercerlos, envía un correo a{" "}
              <a href="mailto:privacidad@holizenter.mx" style={{ color: "#5CB996" }}>
                privacidad@holizenter.mx
              </a>{" "}
              con el asunto "Derechos ARCO" e indicando tu nombre completo y la solicitud específica.
              Responderemos en un plazo máximo de 20 días hábiles.
            </p>
          </Section>

          <Section title="Cambios al aviso de privacidad">
            <p>
              Holizenter se reserva el derecho de modificar este aviso en cualquier momento. Los
              cambios serán publicados en esta página con la fecha de actualización correspondiente.
              El uso continuado de nuestra plataforma tras la actualización implica la aceptación
              de los cambios.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Para cualquier duda sobre el tratamiento de tus datos, escríbenos a{" "}
              <a href="mailto:hola@holizenter.mx" style={{ color: "#5CB996" }}>
                hola@holizenter.mx
              </a>
              .
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
