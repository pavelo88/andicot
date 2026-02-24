
"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { 
  Camera, Flame, ShieldCheck, Zap, Wifi, Server, Lock, 
  Cpu, ChevronRight, MousePointer2 
} from "lucide-react"
import { BlueprintBackground } from "@/components/imagenes"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"


// --- INTERFACES ---
interface ServiceProps {
  id: string
  t?: string; titulo?: string
  d?: string; descripcion?: string
  p?: string | number; precio_base?: string | number
  img?: string; imagen?: string; image?: string
}

// =========================================================
// 1. COMPONENTE PRINCIPAL: SERVICIOS
// =========================================================
export function Servicios({ services, onSelect, highlightedId }: { services: ServiceProps[], onSelect: (id: string) => void, highlightedId?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (highlightedId) {
      const index = services.findIndex(s => s.id === highlightedId)
      if (index !== -1) setCurrentIndex(index)
    }
  }, [highlightedId, services])

  useEffect(() => {
    if (isPaused || services.length === 0) return

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))
      }, 3500)
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isPaused, services.length])

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  
  const handleTouchEnd = () => {
    setIsPaused(false)
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))
    if (distance < -50) setCurrentIndex(prev => (prev === 0 ? services.length - 1 : prev - 1))
    setTouchStart(null); setTouchEnd(null)
  }

  return (
    <section id="servicios" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-foreground font-headline">
          Catálogo de <span className="text-accent">Soluciones</span>
        </h2>
        <div className="h-1 w-20 bg-accent mt-4 mx-auto shadow-[0_0_20px_theme(colors.accent/0.6)]"></div>
      </div>

      {/* --- VISTA MÓVIL --- */}
      <div className="md:hidden relative min-h-[500px]" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {services.length > 0 && (
          <div key={currentIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ServiceCard 
                service={services[currentIndex]} 
                onClick={() => onSelect(services[currentIndex].id)} 
                isActive={true}
                isMobile={true}
              />
          </div>
        )}
        
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <button onClick={() => setCurrentIndex(prev => (prev === 0 ? services.length - 1 : prev - 1))} className="pointer-events-auto bg-background/20 p-2 rounded-full text-foreground/50 hover:text-accent backdrop-blur-sm">‹</button>
            <button onClick={() => setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))} className="pointer-events-auto bg-background/20 p-2 rounded-full text-foreground/50 hover:text-accent backdrop-blur-sm">›</button>
        </div>

        <div className="absolute bottom-0 w-full flex justify-center py-4">
             <span className="text-[10px] font-code text-accent bg-background/40 px-3 py-1 rounded-full border border-accent/30 backdrop-blur-sm">
                {currentIndex + 1} / {services.length}
             </span>
        </div>
      </div>

      {/* --- VISTA TABLET: CARRUSEL --- */}
      <div className="hidden md:block lg:hidden">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {services.map((s) => (
              <CarouselItem key={s.id} className="pl-4 md:basis-1/2">
                <div className="p-1 h-full flex">
                    <ServiceCard
                        service={s}
                        onClick={() => onSelect(s.id)}
                        isActive={s.id === highlightedId}
                        isMobile={false}
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
      
      {/* --- VISTA PC: GRID --- */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
        {services.map(s => (
          <ServiceCard 
            key={s.id} 
            service={s} 
            onClick={() => onSelect(s.id)} 
            isActive={s.id === highlightedId}
            isMobile={false}
          />
        ))}
      </div>
    </section>
  )
}

function ServiceCard({ service, onClick, isActive, isMobile }: { service: ServiceProps, onClick: () => void, isActive: boolean, isMobile: boolean }) {
  const title = service.t || service.titulo || "Servicio"
  const desc = service.d || service.descripcion || ""
  const price = service.p || service.precio_base || "0"
  const img = service.img || service.imagen || service.image

  return (
    <div 
      onClick={onClick}
      className={`
        group tech-glass p-5 cursor-pointer transition-all duration-500 hover:-translate-y-2 flex flex-col w-full
        ${isActive ? 'ring-2 ring-accent shadow-[0_0_40px_theme(colors.accent/0.2)]' : 'border-border hover:border-accent/30'}
        ${isMobile ? 'h-full justify-between' : ''} 
      `}
    >
      <div className={`
          relative w-full mb-5 overflow-hidden rounded-lg border border-border group-hover:border-accent/50 transition-all
          aspect-square md:aspect-[16/10]
          ${img ? 'bg-transparent' : 'bg-background/40'}
      `}>
        {img ? (
          <>
            <Image src={img} alt={title} fill className="object-contain p-2 drop-shadow-xl group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-2 right-2 bg-background/60 backdrop-blur px-2 py-1 rounded text-[8px] text-accent font-code border border-accent/30">LIVE ●</div>
          </>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-50"><BlueprintBackground type={title} /></div>
            <div className="relative z-10 p-3 rounded-full bg-background/40 border border-accent/50 text-accent backdrop-blur-sm shadow-[0_0_15px_theme(colors.accent/0.3)]">
               {getIcon(title)}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h4 className="text-lg font-black font-headline text-foreground mb-2 uppercase tracking-tight group-hover:text-accent transition-colors">
          {title}
        </h4>
        <p className={`text-xs text-muted-foreground font-body leading-relaxed mb-4 ${isMobile ? 'line-clamp-4' : 'line-clamp-3'}`}>
          {desc}
        </p>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Desde</span>
                <span className="text-xl font-code text-accent font-bold">${price}</span>
            </div>
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-foreground bg-accent/10 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded transition-all border border-accent/30">
               {isMobile ? <MousePointer2 className="w-3 h-3"/> : null} 
               COTIZAR {isMobile ? '' : <ChevronRight className="w-3 h-3"/>}
            </button>
        </div>
      </div>
    </div>
  )
}

function getIcon(t: string) {
  t = t.toLowerCase()
  if (t.includes("cctv")) return <Camera className="w-6 h-6" />
  if (t.includes("incendio")) return <Flame className="w-6 h-6" />
  if (t.includes("acceso")) return <ShieldCheck className="w-6 h-6" />
  if (t.includes("electrico")) return <Zap className="w-6 h-6" />
  if (t.includes("wifi")) return <Wifi className="w-6 h-6" />
  if (t.includes("fibra")) return <Server className="w-6 h-6" />
  if (t.includes("perimetral")) return <Lock className="w-6 h-6" />
  return <Cpu className="w-6 h-6" />
}
