import FadeIn from "./FadeIn";
import SectionLabel from "./SectionLabel";

const LINEAS = [
  "Creemos que el bienestar no es un taller de empresa ni una app de meditación.",
  "Es el trabajo más profundo que una persona puede hacer.",
  "Por eso integramos ciencia clínica, terapia holística y tradición contemplativa en un solo ecosistema — para que ese trabajo tenga base real, y resultados reales.",
];

export default function Manifiesto() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">

        <FadeIn>
          <SectionLabel text="Por qué existimos" />
        </FadeIn>

        <div className="space-y-6">
          {LINEAS.map((linea, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <p
                className="font-sans leading-relaxed"
                style={{
                  fontSize:   i === 0 ? "22px" : i === 2 ? "18px" : "20px",
                  color:      i === 0 ? "var(--hl-text)" : "var(--hl-text-muted)",
                  fontWeight: i === 0 ? "600" : "400",
                }}
              >
                {linea}
              </p>
            </FadeIn>
          ))}

          <FadeIn delay={0.3}>
            <p
              className="font-sans font-bold pt-4 border-t"
              style={{
                fontSize:    "20px",
                color:       "var(--hl-green)",
                borderColor: "var(--hl-divider)",
              }}
            >
              No somos el bienestar de moda.{" "}
              <em className="font-dm-serif italic font-normal">
                Somos el bienestar que dura.
              </em>
            </p>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
