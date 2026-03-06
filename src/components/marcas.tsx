"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// --- LOGO MAP: Usado como respaldo si no hay un logo en Firebase ---
const logoMap: { [key: string]: string } = {
  'PELCO': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png',
  'AVIGILON': 'https://vectorlogoseek.com/wp-content/uploads/2019/09/avigilon-vector-logo.png',
  'MOTOROLA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Motorola_logo.svg/512px-Motorola_logo.svg.png',
  'BOSCH': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg',
  'TYCO': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tyco-Logo.svg',
  'HIKVISION': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Hikvision_logo.svg',
  'CISCO': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg',
  'HONEYWELL': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg',
  'APC': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/LogoAPC.svg',
  'LENEL': 'https://www.lenels2.com/wp-content/uploads/2020/03/LenelS2_logo-color.svg',
  'EDWARDS': 'https://www.edwardsfiresafety.com/wp-content/uploads/carrier-edwards-logo.svg',
  'NOTIFIER': 'https://www.notifier.es/wp-content/uploads/sites/11/2022/10/NOTIFIER_Powered_by_Honeywell_BLK_RGB_es.png',
  'DSC': 'https://www.dsc.com/assets/images/logo.png'  
};


export function Marcas({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  // ==================================================================
  // AJUSTE MANUAL: Radio del anillo (qué tan juntas están las etiquetas)
  // Un número más pequeño las junta más.
  // ==================================================================
  const [radius, setRadius] = useState(216)
  const requestRef = useRef<number>()

  // --- LÓGICA DE DATOS ---
  // Mapeamos los datos de entrada para asegurarnos de que cada marca tenga un nombre y un logo
  const brandsWithData = (brands || []).map(brand => {
    // Obtenemos el nombre, ya sea de un string o de un objeto
    const name = (typeof brand === 'object' ? brand.name : brand)?.toUpperCase() || '';
    
    // Buscamos el logo. Prioridad 1: el que viene de Firebase. Prioridad 2: nuestro mapa de respaldo.
    const logoUrl = (typeof brand === 'object' && brand.logo) ? brand.logo : logoMap[name];

    return { name, logoUrl };
  }).filter(b => b.name && b.logoUrl); // Nos aseguramos de tener solo marcas con datos completos


  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 165 : 216)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      setRotation(prev => prev - 0.08)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  if (!brandsWithData || brandsWithData.length === 0) {
    return null;
  }

  return (
    <section
      id="alianzas"
      className="relative z-10 overflow-hidden border-t border-border bg-secondary pt-12 md:pt-20 pb-20"
    >
      <div className="text-center mb-4 md:mb-8 relative z-20">
        <h2 className="font-headline font-black uppercase leading-tight">
          <span className="text-foreground text-2xl md:text-5xl block md:inline md:mr-3">
            ALIADOS
          </span>
          <span className="text-accent text-3xl md:text-5xl block md:inline tracking-tighter">
            TECNOLÓGICOS
          </span>
          <div className="h-1 w-20 bg-accent mt-4 mx-auto shadow-[0_0_20px_theme(colors.accent/0.6)]"></div>
        </h2>
      </div>

      <div
        className="relative flex justify-center items-center"
        style={{
          perspective: "1200px",
          height: radius < 200 ? "230px" : "320px"
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            // ==================================================================
            // AJUSTE MANUAL: Inclinación del anillo
            // Un número más negativo (ej: -15deg) lo inclina más.
            // ==================================================================
            transform: `rotateX(-13deg) rotateY(${rotation}deg)`
          }}
        >
          {brandsWithData.map((brand, i) => {
            const angle = (i / brandsWithData.length) * 360
            const isMobile = radius < 200

            return (
              <div
                key={i}
                className="group absolute left-1/2 top-1/2 flex items-center justify-center
                           tech-glass text-accent
                           font-headline font-bold shadow-[0_0_15px_theme(colors.accent/0.1)]
                           backface-visible transition-all duration-300 hover:bg-background/80 hover:border-accent/30"
                style={{
                  // ==================================================================
                  // AJUSTE MANUAL: Ancho de las etiquetas (PC y Móvil)
                  // ==================================================================
                  width: isMobile ? "115px" : "160px",
                  height: isMobile ? "45px" : "78px",
                  marginLeft: isMobile ? "-57.5px" : "-80px", // Mitad del ancho, en negativo
                  marginTop: isMobile ? "-22.5px" : "-39px",   // Mitad de la altura, en negativo
                  fontSize: isMobile ? "0.7rem" : "1.1rem",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                {/* --- Texto por defecto --- */}
                <span className="transition-opacity duration-300 group-hover:opacity-0">{brand.name}</span>
                
                {/* --- Logo que aparece en hover --- */}
                <div className="absolute inset-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} Logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 110px, 160px"
                    />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}