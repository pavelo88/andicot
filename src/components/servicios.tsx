"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { 
  Camera, Flame, ShieldCheck, Zap, Wifi, Server, Lock, 
  Cpu, ChevronRight, MousePointer2 
} from "lucide-react"
import { BlueprintBackground } from "@/components/imagenes"


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
  const [isPaused, setIsPaused] = useState(false) // Estado para pausar el auto-play
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  
  // Sincronización Highlight
  useEffect(() => {
    if (highlightedId) {
      const index = services.findIndex(s => s.id === highlightedId)
      if (index !== -1) setCurrentIndex(index)
    }
  }, [highlightedId, services])

  // --- AUTO-PLAY (NUEVO) ---
  useEffect(() => {
    // Si está pausado o no hay servicios, no hacemos nada
    if (isPaused || services.length === 0) return

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))
      }, 3500) // Cambia cada 3.5 segundos (ajusta este número si quieres más rápido/lento)
    }

    startAutoPlay()

    // Limpieza al desmontar o cambiar estado
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isPaused, services.length])


  // --- SWIPE TÁCTIL (MÓVIL) ---
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true) // Pausar automático al tocar
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  
  const handleTouchEnd = () => {
    setIsPaused(false) // Reanudar automático al soltar
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))
    if (distance < -50) setCurrentIndex(prev => (prev === 0 ? services.length - 1 : prev - 1))
    setTouchStart(null); setTouchEnd(null)
  }

  return (
    <section id="servicios" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white font-orbitron">
          Catálogo de <span className="text-cyan-500">Soluciones</span>
        </h2>
        <div className="h-1 w-20 bg-cyan-500 mt-4 mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,242,255,0.6)]"></div>

      </div>

      {/* --- MÓVIL (SWIPE + AUTO) --- */}
      <div className="md:hidden relative min-h-[500px]" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {services.length > 0 && (
          // Envuelto en un div con animación de fade key para suavizar el cambio automático
          <div key={currentIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ServiceCard 
                service={services[currentIndex]} 
                onClick={() => onSelect(services[currentIndex].id)} 
                isActive={true}
                isMobile={true}
              />
          </div>
        )}
        
        {/* Controles manuales discretos (opcional) */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <button onClick={() => setCurrentIndex(prev => (prev === 0 ? services.length - 1 : prev - 1))} className="pointer-events-auto bg-black/20 p-2 rounded-full text-white/50 hover:text-cyan-500 backdrop-blur-sm">‹</button>
            <button onClick={() => setCurrentIndex(prev => (prev === services.length - 1 ? 0 : prev + 1))} className="pointer-events-auto bg-black/20 p-2 rounded-full text-white/50 hover:text-cyan-500 backdrop-blur-sm">›</button>
        </div>

        <div className="absolute bottom-0 w-full flex justify-center py-4">
             <span className="text-[10px] font-mono text-cyan-500 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-sm">
                {currentIndex + 1} / {services.length}
             </span>
        </div>
      </div>

      {/* --- PC (GRID COMPACTA - SIN CAMBIOS) --- */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
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

// =========================================================
// 2. SUBCOMPONENTE: TARJETA DE SERVICIO (SIN CAMBIOS)
// =========================================================
function ServiceCard({ service, onClick, isActive, isMobile }: { service: ServiceProps, onClick: () => void, isActive: boolean, isMobile: boolean }) {
  const title = service.t || service.titulo || "Servicio"
  const desc = service.d || service.descripcion || ""
  const price = service.p || service.precio_base || "0"
  const img = service.img || service.imagen || service.image

  return (
    <div 
      onClick={onClick}
      className={`
        group tech-glass p-5 cursor-pointer transition-all duration-500 hover:-translate-y-2 flex flex-col
        ${isActive ? 'ring-2 ring-cyan-500 shadow-[0_0_40px_rgba(0,242,255,0.2)]' : 'border-white/5 hover:border-cyan-500/30'}
        ${isMobile ? 'h-full justify-between' : ''} 
      `}
    >
      {/* ZONA VISUAL: Sin fondo negro, altura reducida en PC */}
      <div className={`
          relative w-full mb-5 overflow-hidden rounded-lg border border-white/10 group-hover:border-cyan-500/50 transition-all
          aspect-square md:aspect-[16/10]
          ${img ? 'bg-transparent' : 'bg-black/40'}
      `}>
        {img ? (
          <>
            <Image src={img} alt={title} fill className="object-contain p-2 drop-shadow-xl group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[8px] text-cyan-400 font-mono border border-cyan-500/30">LIVE ●</div>
          </>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* AQUÍ LLAMAMOS AL FONDO BLUEPRINT INTEGRADO */}
            <div className="absolute inset-0 opacity-50"><BlueprintBackground type={title} /></div>
            <div className="relative z-10 p-3 rounded-full bg-black/40 border border-cyan-500/50 text-cyan-400 backdrop-blur-sm shadow-[0_0_15px_rgba(0,242,255,0.3)]">
               {getIcon(title)}
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1">
        <h4 className="text-lg font-black font-orbitron text-white mb-2 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
          {title}
        </h4>
        <p className={`text-xs text-gray-400 font-light leading-relaxed mb-4 ${isMobile ? 'line-clamp-4' : 'line-clamp-3'}`}>
          {desc}
        </p>
        
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Desde</span>
                <span className="text-xl font-mono text-cyan-500 font-bold">${price}</span>
            </div>
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white bg-cyan-500/10 hover:bg-cyan-500 hover:text-black px-4 py-2 rounded transition-all border border-cyan-500/30">
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
