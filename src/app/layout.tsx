import type { Metadata, Viewport } from "next";
import "./globals.css";
// Importamos el fondo animado (El cerebro)
import { BrainBg } from "@/components/brain-bg";
import { Toaster } from "@/components/ui/toaster";

// CONFIGURACIÓN DE VISTA
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Se ha convertido la generación de metadatos a un objeto estático para resolver un error interno del servidor.
// La implementación anterior intentaba obtener datos de Firebase en el servidor, lo que causaba el problema.
export const metadata: Metadata = {
  title: {
    template: '%s | Andicot Solutions',
    default: 'Andicot Solutions | Ingeniería de Seguridad y Automatización',
  },
  description: "Líderes en consultoría, diseño y puesta en marcha de sistemas electrónicos. Especialistas en CCTV con IA, Detección de Incendios, Control de Acceso, Fibra Óptica y Domótica. Cumplimos normas internacionales.",
  keywords: [
    "Andicot Solutions",
    "CCTV Inteligencia Artificial Ecuador",
    "Control de Acceso y Asistencia",
    "Detección de Incendios",
    "Audio Evacuación",
    "Seguridad Perimetral",
    "Cableado Estructurado y Fibra Óptica",
    "Automatización Industrial",
    "Domótica e Inmótica",
    "Instalaciones Eléctricas Ecuador",
    "Ingeniería de Seguridad"
  ],
  authors: [{ name: "Andicot Solutions Team", url: "https://andicot.com" }],
  creator: "Andicot Engineering",
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://andicot.com",
    siteName: "Andicot Solutions",
    title: "Andicot Solutions | Seguridad Electrónica Avanzada",
    description: "Monitoreo con IA, Automatización Industrial y Seguridad Electrónica. Proyectos de renombre a nivel nacional.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Andicot Solutions - Ingeniería de Seguridad",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Schema.org: Datos estructurados para Google (Business Card) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Andicot Solutions",
              "url": "https://andicot.com",
              "logo": "https://andicot.com/logo.png",
              "description": "Consultoría, análisis, diseño y puesta en marcha de sistemas electrónicos y electrónicos.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EC"
              },
              "priceRange": "$$",
              "knowsAbout": [
                "CCTV",
                "Fire Detection",
                "Automation",
                "Access Control"
              ]
            }),
          }}
        />
      </head>
      
      <body className="light-mode antialiased overflow-x-hidden selection:bg-accent/30 selection:text-accent-foreground">
        {/* FONDO ANIMADO "CEREBRO" */}
        <BrainBg />
        
        {/* CONTENIDO DE LA PÁGINA */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
