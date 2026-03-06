"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// --- SUBCOMPONENTE PARA CADA TARJETA DE MARCA ---
function BrandCard({ brand, isMobile, angle, radius }: { brand: { name: string, logoUrl: string }, isMobile: boolean, angle: number, radius: number }) {
  // Estado para controlar si la imagen falló al cargar
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group absolute left-1/2 top-1/2 flex items-center justify-center
                 tech-glass
                 font-headline font-bold shadow-[0_0_15px_theme(colors.accent/0.1)]
                 backface-visible transition-all duration-300 bg-background/80 border-border"
      style={{
        // ================================================
        // === INICIO: TAMAÑO DE ETIQUETAS (TARJETAS) ===
        // Aquí puedes cambiar el tamaño de las tarjetas.
        // ================================================
        width: isMobile ? "120px" : "160px",
        height: isMobile ? "50px" : "70px",
        // === FIN: TAMAÑO DE ETIQUETAS (TARJETAS) ===
        marginLeft: isMobile ? "-60px" : "-80px",
        marginTop: isMobile ? "-25px" : "-35px",
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`
      }}
    >
      {imageError ? (
        // Si hay un error, muestra el nombre de la marca con efecto hover
        <span className="text-muted-foreground transition-colors duration-300 group-hover:text-accent font-code text-xs md:text-sm uppercase">
          {brand.name}
        </span>
      ) : (
        // Si no hay error, muestra la imagen
        // ================================================
        // === INICIO: TAMAÑO DE IMAGEN (logo) ===
        // Cambia el padding (p-X) para hacer el logo más grande o pequeño.
        // Más padding (p-10, p-12) = logo más pequeño.
        // Menos padding (p-6, p-4) = logo más grande.
        // ================================================
        <div className="relative w-full h-full p-10">
        {/* === FIN: TAMAÑO DE IMAGEN (logo) === */}
          <Image
            src={brand.logoUrl}
            alt={`${brand.name} Logo`}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            sizes="(max-width: 768px) 110px, 140px"
            // Aquí está la magia: si la imagen falla, actualizamos el estado
            onError={() => setImageError(true)}
          />
        </div>
      )}
    </div>
  );
}


export function Marcas({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  const [isSlowed, setIsSlowed] = useState(false)
  const [radius, setRadius] = useState(260) // Aumentado para separar etiquetas
  const requestRef = useRef<number>()

  // Lógica unificada para procesar los datos de las marcas vengan de donde vengan (Firebase o data.ts)
  const brandsWithData = (brands || []).map(brand => {
    if (typeof brand === 'object' && brand.name) {
      // El formato de Firebase es { name, logo }
      // El formato de data.ts puede ser { id, name, url } o string
      const logoUrl = brand.logo || brand.url;
      if (logoUrl) {
        return { name: brand.name.toUpperCase(), logoUrl };
      }
    }
    // Fallback para el array de strings original
    if (typeof brand === 'string') {
        // En este caso, no tenemos una URL de logo definida, así que la lógica de error se activará.
        return { name: brand.toUpperCase(), logoUrl: '' };
    }
    return null;
  }).filter(Boolean) as { name: string, logoUrl: string }[];


  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 144 : 260)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      const speed = isSlowed ? 0.01 : 0.091;
      setRotation(prev => prev - speed)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isSlowed])

  if (!brandsWithData || brandsWithData.length === 0) {
    return null;
  }

  return (
    <section
      id="alianzas"
      onClick={() => setIsSlowed(prev => !prev)}
      className="relative z-10 overflow-hidden border-y border-border pt-12 md:pt-20 pb-20 bg-background cursor-pointer"
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
            transform: `rotateX(-13deg) rotateY(${rotation}deg)`
          }}
        >
          {brandsWithData.map((brand, i) => {
            const angle = (i / brandsWithData.length) * 360
            const isMobile = radius < 200

            return (
              <BrandCard
                key={i}
                brand={brand}
                isMobile={isMobile}
                angle={angle}
                radius={radius}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
