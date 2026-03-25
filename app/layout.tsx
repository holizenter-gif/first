import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
