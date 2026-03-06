"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// --- SUBCOMPONENTE PARA CADA TARJETA DE MARCA ---
const BrandCard = ({ brand, isMobile, angle, radius }: { brand: { name: string, logoUrl: string }, isMobile: boolean, angle: number, radius: number }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Resetear el estado de error si la URL del logo cambia
    setHasError(false);
  }, [brand.logoUrl]);

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
      {hasError ? (
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
          <Image
            src={brand.logoUrl}
            alt={`${brand.name} Logo`}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            sizes="(max-width: 768px) 110px, 140px"
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}

export function Marcas({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  const [isSlowed, setIsSlowed] = useState(false)
  const [radius, setRadius] = useState(260)
  const requestRef = useRef<number>()

  // Usamos las marcas por defecto que nos pasaste
  const defaultBrands = [
    { id: 1, name: 'PELCO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png' },
    { id: 2, name: 'AVIGILON', url: 'https://www.groupeclr.com/wp-content/uploads/2023/10/Avigilon-Logo-White-1024x292.png' },
    { id: 3, name: 'MOTOROLA', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola-logo-black-and-white.png' },
    { id: 4, name: 'BOSCH', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg' },
    { id: 5, name: 'TYCO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tyco-Logo.svg' },
    { id: 6, name: 'HIKVISION', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Hikvision_logo.svg' },
    { id: 7, name: 'CISCO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg' },
    { id: 8, name: 'HONEYWELL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg' },
    { id: 9, name: 'APC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/LogoAPC.svg' }
  ];

  // Lógica para procesar los datos de las marcas
  const brandsWithData = (brands && brands.length > 0 ? brands : defaultBrands).map(brand => {
    if (typeof brand === 'object' && brand.name) {
      const logoUrl = brand.logo || brand.url;
      if (logoUrl) {
        return { name: brand.name.toUpperCase(), logoUrl };
      }
    }
    if (typeof brand === 'string') {
        return { name: brand.toUpperCase(), logoUrl: '' };
    }
    return null;
  }).filter(Boolean) as { name: string, logoUrl: string }[];

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 160 : 280) // Aumentado para separar más
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      // Incrementada la velocidad en ~7% y lógica de ralentización al hacer clic
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
      className="relative z-10 overflow-hidden border-b border-t border-border pt-12 md:pt-20 pb-20 bg-secondary cursor-pointer"
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
