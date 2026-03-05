"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

const logoMap: { [key: string]: string } = {
  'PELCO': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pelco_logo.svg',
  'AVIGILON': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Avigilon_logo.svg',
  'MOTOROLA': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Motorola_Solutions_Logo.svg',
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
  const [radius, setRadius] = useState(400)
  const requestRef = useRef<number>()

  const brandsWithLogos = (brands || [])
    .map(brand => {
      // Prioridad 1: Un logo válido subido desde el admin
      if (typeof brand === 'object' && brand.logo && brand.logo.startsWith('http')) {
        return { name: brand.name, logoUrl: brand.logo };
      }
      // Prioridad 2: Un logo de respaldo del mapa
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
