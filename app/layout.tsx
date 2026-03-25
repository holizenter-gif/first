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

export const metadata: Metadata = {
  metadataBase: new URL("https://holizenter.mx"),
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
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://holizenter.mx",
    siteName: "Holizenter",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${dmSerif.variable}`}
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
