import type { Metadata, Viewport } from "next";
import "./globals.css";
// Importamos el fondo animado (El cerebro)
import { BrainBg } from "@/components/brain-bg";

// 1. IMPORTANTE: Conexión con Firebase para extraer los Tags
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// CONFIGURACIÓN DE VISTA
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. FUNCIÓN MAESTRA: UNE TUS PALABRAS CLAVE CON LOS TAGS DE FIREBASE
export async function generateMetadata(): Promise<Metadata> {
  // Esta es tu lista original de palabras clave (Keywords estáticas)
  const staticKeywords = [
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
  ];

  let dynamicTags: string[] = [];

  try {
    // Consultamos la colección 'servicios' en Firebase
    const querySnapshot = await getDocs(collection(db, "servicios"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tags) {
        // Limpiamos y separamos los tags (ej: "camara, cctv") convirtiéndolos en lista
        const tagsArray = data.tags.split(",").map((t: string) => t.trim());
        dynamicTags = [...dynamicTags, ...tagsArray];
      }
    });
  } catch (error) {
    console.error("Error obteniendo tags dinámicos:", error);
  }

  // UNIÓN FINAL: Combinamos ambas listas y eliminamos duplicados con 'Set'
  const finalKeywords = Array.from(new Set([...staticKeywords, ...dynamicTags]));

  return {
    title: {
      template: '%s | Andicot Solutions',
      default: 'Andicot Solutions | Ingeniería de Seguridad y Automatización',
    },
    description: "Líderes en consultoría, diseño y puesta en marcha de sistemas electrónicos. Especialistas en CCTV con IA, Detección de Incendios, Control de Acceso, Fibra Óptica y Domótica. Cumplimos normas internacionales.",
    keywords: finalKeywords, // <--- Aquí se inyecta la unión de ambas listas
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
}

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
      
      <body className="antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
        {/* FONDO ANIMADO "CEREBRO" */}
        <BrainBg />
        
        {/* CONTENIDO DE LA PÁGINA */}
        {children}
      </body>
    </html>
  );
}