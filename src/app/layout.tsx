import type { Metadata, Viewport } from "next";
import "./globals.css";
// Importamos el fondo animado (El cerebro)
import { BrainBg } from "@/components/brain-bg";

// 1. CONFIGURACIÓN DE VISTA (IMPORTANTE PARA CELULARES)
export const viewport: Viewport = {
  themeColor: "#000000", // La barra del navegador en Android se verá negra
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita zoom accidental que rompe el diseño
};

// 2. METADATOS MAESTROS (SEO)
export const metadata: Metadata = {
  // Título dinámico: Se verá "Andicot Solutions | Stark OS"
  title: {
    template: '%s | Andicot Solutions',
    default: 'Andicot Solutions | Ingeniería de Seguridad y Automatización',
  },
  
  // Descripción extraída de tu texto corporativo (Optimizada para Google)
  description: "Líderes en consultoría, diseño y puesta en marcha de sistemas electrónicos. Especialistas en CCTV con IA, Detección de Incendios, Control de Acceso, Fibra Óptica y Domótica. Cumplimos normas internacionales.",
  
  // Palabras clave exactas basadas en tus servicios
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

  // Autor y Creador
  authors: [{ name: "Andicot Solutions Team", url: "https://andicot.com" }],
  creator: "Andicot Engineering",

  // 3. OPEN GRAPH (CÓMO SE VE AL COMPARTIR EN WHATSAPP/FACEBOOK)
  openGraph: {
    type: "website",
    locale: "es_EC", // Español - Ecuador
    url: "https://andicot.com",
    siteName: "Andicot Solutions",
    title: "Andicot Solutions | Seguridad Electrónica Avanzada",
    description: "Monitoreo con IA, Automatización Industrial y Seguridad Electrónica. Proyectos de renombre a nivel nacional.",
    // Recuerda subir una imagen llamada 'og-image.jpg' a la carpeta 'public'
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Andicot Solutions - Ingeniería de Seguridad",
      },
    ],
  },

  // 4. ICONOS
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // 5. ROBOTS (Para que Google te indexe correctamente)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
              "description": "Consultoría, análisis, diseño y puesta en marcha de sistemas eléctricos y electrónicos.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EC" // Ecuador
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
      
      <body className="antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
        {/* FONDO ANIMADO "CEREBRO" */}
        <BrainBg />
        
        {/* CONTENIDO DE LA PÁGINA */}
        {children}
      </body>
    </html>
  );
}