"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// Mapa de logos de respaldo (fallback) con URLs de alta calidad.
const logoMap: { [key: string]: string } = {
  'PELCO': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png',
  'AVIGILON': 'https://www.motorolasolutions.com/content/dam/msi/images/business/products/video-security-access-control/avigilon-logo-blue-video-security-and-access-control-logo.png',
  'MOTOROLA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Motorola_logo.svg/512px-Motorola_logo.svg.png',
  'BOSCH': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg',
  'TYCO': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tyco-Logo.svg',
  'HIKVISION': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Hikvision_logo.svg',
  'CISCO': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg',
  'HONEYWELL': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg',
  'APC': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/LogoAPC.svg',
  'LENEL': 'https://www.lenels2.com/wp-content/themes/lenels2/assets/images/logo.svg',
  'EDWARDS': 'https://www.edwardsfiresafety.com/wp-content/uploads/carrier-edwards-logo.svg',
  'NOTIFIER': 'https://www.security.honeywell.com/etc.clientlibs/honeywell/clientlibs/secure/resources/images/notifier-logo.svg',
  'DSC': 'https://www.dsc.com/assets/images/logo.png'  
};

export function Marcas2({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(320)
  const requestRef = useRef<number>()

  // Lógica robusta para obtener los logos:
  // 1. Prioriza el logo subido desde el panel de admin.
  // 2. Si no hay logo del admin, usa el logo de respaldo del `logoMap`.
  // 3. Si no hay ninguno de los dos, la marca no se muestra para evitar imágenes rotas.
  const brandsWithLogos = (brands || [])
    .map(brand => {
      const name = (typeof brand === 'object' ? brand.name : brand)?.toUpperCase() || '';
      
      // Prioridad 1: Un logo válido subido desde el admin.
      if (typeof brand === 'object' && brand.logo && brand.logo.startsWith('http')) {
        return { name: brand.name, logoUrl: brand.logo };
      }
      // Prioridad 2: Un logo de respaldo del mapa.
      if (logoMap[name]) {
        return { name: name, logoUrl: logoMap[name] };
      }
      return null;
    })
    .filter((b): b is { name: string; logoUrl: string } => b !== null);

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 165 : 240)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      setRotation(prev => prev + 0.08)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  if (!brandsWithLogos || brandsWithLogos.length === 0) {
    return null;
  }

  return (
    <section
      id="alianzas2"
      className="relative z-10 pt-4 md:pt-12 pb-8 md:pb-24 overflow-hidden border-y border-border transition-all duration-500
                 bg-secondary/10 dark:bg-[radial-gradient(circle_at_center,theme(colors.accent/0.08)_0%,transparent_70%)]"
    >
       <div className="text-center mb-4 md:mb-8 relative z-20">
        <h2 className="font-headline font-black uppercase leading-tight">
          <span className="text-foreground text-2xl md:text-5xl block md:inline md:mr-3">
            LOGOS
          </span>
          <span className="text-accent text-3xl md:text-5xl block md:inline tracking-tighter">
            OFICIALES
          </span>
          <div className="h-1 w-20 bg-accent mt-4 mx-auto shadow-[0_0_20px_theme(colors.accent/0.6)]"></div>
        </h2>
      </div>

      <div
        className="relative flex justify-center items-center"
        style={{
          perspective: "1200px",
          height: radius < 200 ? "150px" : "180px"
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(-10deg) rotateY(${rotation}deg)`
          }}
        >
          {brandsWithLogos.map((brand, i) => {
            const angle = (i / brandsWithLogos.length) * 360
            const isMobile = radius < 200

            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 flex items-center justify-center
                           tech-glass bg-background/60 backdrop-blur-lg
                           p-4 overflow-hidden
                           backface-visible transition-all"
                style={{
                  width: isMobile ? "110px" : "180px",
                  height: isMobile ? "60px" : "80px",
                  marginLeft: isMobile ? "-55px" : "-90px",
                  marginTop: isMobile ? "-30px" : "-40px",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <div className="relative w-full h-full">
                    <Image 
                        src={brand.logoUrl}
                        alt={`${brand.name} Logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 110px, 180px"
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
