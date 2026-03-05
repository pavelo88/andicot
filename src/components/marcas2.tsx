"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// Mapa de logos como fallback (logos blancos o claros para buena visibilidad)
const logoMap: { [key: string]: string } = {
    'PELCO': 'https://www.pelco.com/wp-content/uploads/2021/08/pelco-logo-white-1.svg',
    'AVIGILON': 'https://www.motorolasolutions.com/content/dam/msi/images/products/video-security-and-access-control/avigilon-logo-white-rgb.svg',
    'MOTOROLA': 'https://www.motorolasolutions.com/content/dam/msi/images/global-images/logo-motorola-solutions-white.svg',
    'LENEL': 'https://www.lenels2.com/media/default/images/lenels2-logo-white.svg',
    'EDWARDS': 'https://www.edwardsfiresafety.com/wp-content/themes/edwards/assets/images/logo-white.svg',
    'BOSCH': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bosch-logo.svg/2560px-Bosch-logo.svg.png', // Este es rojo, se verá bien.
    'NOTIFIER': 'https://www.security.honeywell.com/-/media/Honeywell_Security/Images/Logos/Notifier/Notifier-by-Honeywell_Logo_White_RGB_300.png',
    'TYCO': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Tyco_logo.svg/2560px-Tyco_logo.svg.png', // Azul
    'HIKVISION': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hikvision_logo.svg/2560px-Hikvision_logo.svg.png', // Rojo
    'CISCO': 'https://www.cisco.com/c/dam/m/en_us/header/cisco-logo-white.svg',
    'HONEYWELL': 'https://www.honeywell.com/etc.clientlibs/honeywell/clientlibs/global/resources/images/Honeywell_Logo_White.svg',
    'DSC': 'https://www.dsc.com/assets/img/dsc-logo-white.svg',
    'APC': 'https://download.schneider-electric.com/files?p_File_Name=APC_corp_logo_white_RGB.svg&p_Doc_Ref=APC_corp_logo_white_RGB_svg',
};

export function Marcas2({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(400)
  const requestRef = useRef<number>()

  // Filtramos y preparamos las marcas con un logo válido
  const brandsWithLogos = (brands || [])
    .map(brand => {
      if (typeof brand === 'object' && brand.logo) {
        return { name: brand.name, logoUrl: brand.logo };
      }
      const name = typeof brand === 'object' ? brand.name : brand;
      if (name && logoMap[name.toUpperCase()]) {
        return { name: name, logoUrl: logoMap[name.toUpperCase()] };
      }
      return null;
    })
    .filter((b): b is { name: string; logoUrl: string } => b !== null);

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 165 : 400)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      setRotation(prev => prev + 0.08) // Invertimos la rotación para variar
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
      className="relative z-10 py-8 md:py-12 overflow-hidden transition-all duration-500"
    >
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
                        className="object-contain filter-none" // Mantenemos colores originales
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