"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// --- SUBCOMPONENTE PARA CADA TARJETA DE MARCA ---
const BrandCard = ({ brand, isMobile, angle, radius }: { brand: { name: string, logoUrl: string }, isMobile: boolean, angle: number, radius: number }) => {
  const [hasError, setHasError] = useState(false);

  // Cada vez que la URL del logo cambie, reseteamos el estado de error.
  // Esto es útil si los datos se actualizan en tiempo real.
  useEffect(() => {
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
        width: isMobile ? "120px" : "150px",
        height: isMobile ? "50px" : "60px",
        // === FIN: TAMAÑO DE ETIQUETAS (TARJETAS) ===
        marginLeft: isMobile ? "-60px" : "-75px",
        marginTop: isMobile ? "-25px" : "-30px",
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`
      }}
    >
      {hasError || !brand.logoUrl ? (
        // Si hay un error o no hay logo, muestra el nombre de la marca
        // Al hacer hover, el texto tomará el color de acento
        <span className="text-muted-foreground transition-colors duration-300 group-hover:text-accent font-code text-xs md:text-sm uppercase">
          {brand.name}
        </span>
      ) : (
        // Si no hay error y hay logo, muestra la imagen.
        // El tamaño del logo se controla con el div contenedor de abajo.
        // ================================================
        // === INICIO: TAMAÑO DE IMAGEN (logo) ===
        // Para hacer el logo más pequeño, reduce el porcentaje (ej. w-[70%] h-[70%]).
        // Para hacerlo más grande, auméntalo (ej. w-[100%] h-[100%]).
        // ================================================
        <div className="relative w-[85%] h-[85%]">
          <Image
            src={brand.logoUrl}
            alt={`${brand.name} Logo`}
            fill
            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            sizes="(max-width: 768px) 110px, 160px"
            onError={() => setHasError(true)}
          />
        </div>
        // === FIN: TAMAÑO DE IMAGEN (logo) ===
      )}
    </div>
  );
}

export function Marcas({ brands }: { brands: any[] }) {
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(260)
  const requestRef = useRef<number>()
  

  const defaultBrands = [
    { id: 1, name: 'PELCO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png' },
    { id: 2, name: 'AVIGILON', url: 'https://cdn.worldvectorlogo.com/logos/avigilon-logo.svg' },
    { id: 3, name: 'MOTOROLA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Motorola-Logo.svg/1920px-Motorola-Logo.svg.png'},
    { id: 4, name: 'BOSCH', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg' },
    { id: 5, name: 'TYCO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tyco-Logo.svg' },
    { id: 6, name: 'HIKVISION', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Hikvision_logo.svg' },
    { id: 7, name: 'CISCO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg' },
    { id: 8, name: 'HONEYWELL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg' },
    { id: 9, name: 'APC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/LogoAPC.svg' }
  ];
  
  // Lógica de procesamiento de marcas mejorada
  const brandsWithData = (brands && brands.length > 0 ? brands : []).map(brand => {
    let brandName: string;
    let logoFromDb: string | undefined;

    if (typeof brand === 'object' && brand.name) {
      brandName = brand.name.toUpperCase();
      logoFromDb = brand.logo;
    } else {
      brandName = String(brand).toUpperCase();
    }
    
    const defaultBrand = defaultBrands.find(db => db.name === brandName);
    const logoUrl = logoFromDb || defaultBrand?.url || '';

    return { name: brandName, logoUrl };
  }).filter(brand => brand.name) as { name: string, logoUrl: string }[];


  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 160 : 280)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      const speed = 0.1; // Velocidad de rotación constante
      setRotation(prev => prev - speed)
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
      className="relative z-10 overflow-hidden border-b border-t border-border pt-12 md:pt-20 pb-20 bg-background cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-80"></div>
      
      <div className="absolute inset-0 bg-background -z-10"></div>
      
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
