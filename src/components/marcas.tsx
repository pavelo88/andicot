"use client"

import { useEffect, useState, useRef } from "react"

export function Marcas({ brands }: { brands: string[] }) {
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(400) // Radio inicial PC
  const requestRef = useRef<number>()

  const displayBrands = brands && brands.length > 0 
    ? brands 
    : ['BOSCH', 'HONEYWELL', 'CISCO', 'HIKVISION', 'SAMSUNG', 'DSC', 'APC', 'PELCO']

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 165 : 400)
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

  return (
    <section 
        id="alianzas" 
        className="relative z-10 py-8 md:py-24 overflow-hidden border-y border-white/5 transition-all duration-500
                   bg-zinc-950 dark:bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.08)_0%,#000_70%)]"
    >
      
      {/* TÍTULO CORREGIDO: Estilo "Dos Colores" + Italic + Black */}
      <div className="text-center mb-4 md:mb-8 relative z-20">
        <h2 className="font-orbitron font-black italic uppercase leading-tight">
          {/* Parte 1: Blanco (o negro en light mode) */}
          <span className="text-white light:text-black text-2xl md:text-5xl block md:inline md:mr-3">
            ALIADOS
          </span>
          {/* Parte 2: Cyan Neón */}
          <span className="text-cyan-500 text-3xl md:text-5xl block md:inline tracking-tighter">
            TECNOLÓGICOS
          </span>
          <div className="h-1 w-20 bg-cyan-500 mt-4 mx-auto shadow-[0_0_20px_rgba(0,242,255,0.6)]"></div>

        </h2>
      </div>

      {/* CONTENEDOR DE ESCENA 3D (Manteniendo el ajuste de altura móvil) */}
      <div 
        className="relative flex justify-center items-center" 
        style={{ 
            perspective: "1200px", 
            height: radius < 200 ? "250px" : "320px" 
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(-10deg) rotateY(${rotation}deg)` 
          }}
        >
          {displayBrands.map((brand, i) => {
            const angle = (i / displayBrands.length) * 360
            const isMobile = radius < 200

            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 flex items-center justify-center
                           tech-glass text-cyan-500
                           font-orbitron font-bold shadow-[0_0_15px_rgba(0,242,255,0.1)]
                           backface-visible transition-all hover:bg-cyan-500/10"
                style={{
                  width: isMobile ? "115px" : "185px", 
                  height: isMobile ? "45px" : "78px",
                  marginLeft: isMobile ? "-57.5px" : "-92.5px", 
                  marginTop: isMobile ? "-22.5px" : "-39px", 
                  fontSize: isMobile ? "0.7rem" : "1.1rem",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <span className="bg-transparent pointer-events-none">{brand}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
