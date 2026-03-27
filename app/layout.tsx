import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Montserrat } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSerif = DM_Serif_Display({
  subsets:  ["latin"],
  variable: "--font-dm-serif",
  display:  "swap",
  weight:   "400",
  style:    ["normal", "italic"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://holizenter.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Holizenter — El Poder de tu Bienestar | Bienestar Holístico para Empresas",
    template: "%s | Holizenter",
  },
  description:
    "Diagnóstico laboral gratuito, talleres de bienestar, integración de equipos y sensibilización de alta dirección. Cuerpo · Mente · Espíritu. Ciudad de México.",
  keywords: [
    "bienestar holístico empresas México",
    "diagnóstico burnout laboral gratis",
    "talleres bienestar corporativo CDMX",
    "NOM-035 programa bienestar",
  ],
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: APP_URL,
    siteName: "Holizenter",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "HealthAndBeautyBusiness"],
  "@id": "https://holizenter.com/#organization",
  name: "Holizenter",
  alternateName: "Holizenter — El Poder de tu Bienestar",
  url: "https://holizenter.com",
  logo: {
    "@type": "ImageObject",
    url: "https://holizenter.com/brand/imagotipo-color.png",
  },
  description:
    "Hub de bienestar holístico para personas y empresas en México. Programa MBSR certificado por Brown University, diagnóstico laboral gratuito, talleres corporativos y directorio de especialistas.",
  foundingDate: "2023",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad de México",
    addressRegion: "CDMX",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hola@holizenter.com",
    availableLanguage: "Spanish",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de bienestar Holizenter",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Diagnóstico de Bienestar Laboral Gratuito" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Talleres de Bienestar Corporativo" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Programa MBSR 8 Semanas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sensibilización Alta Dirección" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${dmSerif.variable}`}
    >
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
