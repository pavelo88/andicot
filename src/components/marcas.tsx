"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export function Marcas({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  // Valor por defecto para PC, ajustado según tu petición.
  const [radius, setRadius] = useState(216)
  const requestRef = useRef<number>()

  const defaultBrandNames = [
    'BOSCH', 'HONEYWELL', 'CISCO', 'HIKVISION', 'SAMSUNG', 'DSC', 'APC', 'PELCO'
  ];

  const brandNames = (brands && brands.length > 0 ? brands : defaultBrandNames).map(brand => {
    if (typeof brand === 'string') {
      return brand;
    }
    if (typeof brand === 'object' && brand.name) {
      return brand.name;
    }
    return '';
  }).filter(Boolean);

  useEffect(() => {
    const handleResize = () => {
      // ==================================================================
      // AQUÍ PUEDES CAMBIAR EL RADIO (qué tan juntas están las etiquetas)
      // Un número más pequeño las junta más.
      // El primer valor es para móvil, el segundo para PC.
      // ==================================================================
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

  if (!brandNames || brandNames.length === 0) {
    return null;
  }

  return (
    <section
      id="alianzas"
      className="relative z-10 overflow-hidden border-t border-border bg-secondary pt-12 md:pt-20 pb-6"
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

      {/* Anillo de Texto (El original) */}
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
            // AQUÍ PUEDES CAMBIAR LA INCLINACIÓN ("lo tumbado") DEL ANILLO
            // El valor actual es -13deg. Un número más negativo (ej: -15deg) lo inclina más.
            // ==================================================================
            transform: `rotateX(-13deg) rotateY(${rotation}deg)`
          }}
        >
          {brandNames.map((brandName, i) => {
            const angle = (i / brandNames.length) * 360
            const isMobile = radius < 200

            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 flex items-center justify-center
                           tech-glass text-accent
                           font-headline font-bold shadow-[0_0_15px_theme(colors.accent/0.1)]
                           backface-visible transition-all hover:bg-accent/10"
                style={{
                  width: isMobile ? "115px" : "185px",
                  height: isMobile ? "45px" : "78px",
                  marginLeft: isMobile ? "-57.5px" : "-92.5px",
                  marginTop: isMobile ? "-22.5px" : "-39px",
                  fontSize: isMobile ? "0.7rem" : "1.1rem",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <span className="bg-transparent pointer-events-none">{brandName}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
