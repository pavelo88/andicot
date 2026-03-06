"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// --- LOGO MAP: Usado como respaldo si no hay un logo en Firebase ---
const logoMap: { [key: string]: string } = {
  'PELCO': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png',
  'AVIGILON': 'https://www.groupeclr.com/wp-content/uploads/2023/10/Avigilon-Logo-White-1024x292.png',
  'MOTOROLA': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola-logo-black-and-white.png',
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
  // Un número más grande las separa más.
  // ==================================================================
  const [radius, setRadius] = useState(240)
  const requestRef = useRef<number>()

  // --- LÓGICA DE DATOS ---
  const brandsWithData = (brands || []).map(brand => {
    const name = (typeof brand === 'object' ? brand.name : brand)?.toUpperCase() || '';
    const logoUrl = (typeof brand === 'object' && brand.logo) ? brand.logo : logoMap[name];
    return { name, logoUrl };
  }).filter(b => b.name && b.logoUrl);


  useEffect(() => {
    const handleResize = () => {
      // ==================================================================
      // AJUSTE MANUAL: Radio del anillo (Móvil vs PC)
      // ==================================================================
      setRadius(window.innerWidth < 768 ? 180 : 240)
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
      className="relative z-10 overflow-hidden border-y border-border pt-12 md:pt-20 pb-20 bg-secondary dark:bg-background"
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
                           backface-visible transition-all duration-300 bg-background/80 border-border"
                style={{
                  // ==================================================================
                  // AJUSTE MANUAL: Ancho de las etiquetas (PC y Móvil)
                  // ==================================================================
                  width: isMobile ? "115px" : "160px",
                  height: isMobile ? "45px" : "75px",
                  marginLeft: isMobile ? "-57.5px" : "-80px", // Mitad del ancho, en negativo
                  marginTop: isMobile ? "-22.5px" : "-39px",   // Mitad de la altura, en negativo
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <div className="relative w-full h-full p-3 md:p-4">
                    <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} Logo`}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
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
