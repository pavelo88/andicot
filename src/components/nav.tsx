"use client"

import { useState, useEffect } from "react"
import { Sun, Menu, X, Moon, Laptop2, MessageSquare, Calculator } from "lucide-react"

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLightMode, setIsLightMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // 1. DETECTOR DE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 2. FUNCIÓN PARA NAVEGAR SIN QUE LA BARRA TAPE EL TÍTULO
  const scrollToSection = (id: string) => {
    setIsOpen(false) 
    const element = document.querySelector(id)
    if (element) {
      const headerOffset = 100 
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  // 3. CAMBIO DE TEMA
  const toggleTheme = () => {
    const newMode = !isLightMode
    setIsLightMode(newMode)
    if (newMode) {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }

  // COLORES DINÁMICOS
  const textColorClass = isLightMode ? "text-black" : "text-white"
  // Aquí está la magia: Si es claro, fondo blanco. Si es oscuro, fondo negro.
  const mobileBgClass = isLightMode ? "bg-white/95" : "bg-black/95"
  
  // Hamburguesa: Si el menú está abierto, Cyan. Si no, depende del modo.
  const hamburgerColor = isOpen 
    ? "text-cyan-400" 
    : (isLightMode ? "text-black" : "text-white")

  return (
    <>
      <nav 
        className={`
          fixed top-0 w-full z-[100] transition-all duration-500 border-b
          ${isScrolled 
            ? (isLightMode ? 'bg-white/80 border-gray-200 shadow-md' : 'bg-black/80 border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,255,0.1)]') 
            : 'bg-transparent border-transparent py-6'
          }
          ${isScrolled ? 'backdrop-blur-md py-3' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* === LOGO === */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Rombo del Logo */}
            <div className={`
              w-10 h-10 border-2 rotate-45 flex items-center justify-center transition-all duration-300
              ${isScrolled 
                ? (isLightMode ? 'border-black bg-black/5' : 'border-cyan-500 bg-cyan-500/10') 
                : 'border-cyan-500 bg-transparent' // En Hero siempre Cyan
              }
              group-hover:rotate-90 group-hover:bg-cyan-500 group-hover:border-cyan-400
            `}>
              <span className={`
                rotate-[-45deg] font-black text-sm tracking-tighter transition-colors
                ${isScrolled 
                    ? (isLightMode ? 'text-black' : 'text-cyan-400') 
                    : 'text-cyan-400' // En Hero siempre Cyan
                }
                group-hover:text-black
              `}>
                A
              </span>
            </div>
            
            {/* Texto ANDICOT */}
            <div className="flex flex-col">
              <span className={`
                text-xl font-black tracking-tighter italic uppercase transition-colors leading-none
                ${isScrolled ? textColorClass : 'text-white drop-shadow-md'}
                group-hover:text-cyan-400
              `}>
                ANDICOT
              </span>
            </div>
          </div>
          
          {/* === MENÚ DE ESCRITORIO === */}
          <div className="hidden md:flex items-center gap-8">
            <div className={`flex gap-8 text-[11px] font-mono uppercase tracking-widest font-bold ${isLightMode && isScrolled ? 'text-gray-800' : 'text-gray-400'}`}>
              <NavButton label="Servicios" onClick={() => scrollToSection('#servicios')} />
              <NavButton label="Cotizador" onClick={() => scrollToSection('#cotizador')} />
              <NavButton label="Contacto" onClick={() => scrollToSection('#contacto')} />
            </div>
            
            <div className="h-6 w-px bg-current opacity-20"></div>

            <button 
              onClick={toggleTheme} 
              className={`
                p-2 rounded-full transition-all border
                ${isLightMode 
                    ? "text-orange-500 border-orange-500/30 hover:bg-orange-100" 
                    : "text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,242,255,0.6)]"
                }
              `}
            >
              {isLightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* === BOTÓN HAMBURGUESA (MÓVIL) === */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme} 
              className={isLightMode ? "text-orange-500" : "text-cyan-500"}
            >
              {isLightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              className={`p-2 transition-colors ${hamburgerColor}`} 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* === MENÚ MÓVIL CORREGIDO === */}
      {isOpen && (
        // AQUÍ USAMOS LA VARIABLE mobileBgClass PARA EL FONDO BLANCO/NEGRO
        <div className={`fixed inset-0 z-[90] ${mobileBgClass} backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden animate-in fade-in zoom-in-95 duration-200`}>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

          <div className="flex flex-col gap-8 text-center">
            {/* Pasamos isLight para que el botón se ponga negro si es necesario */}
            <MobileButton label="Catálogo de Servicios" onClick={() => scrollToSection('#servicios')} icon={<Laptop2 />} isLight={isLightMode} />
            <MobileButton label="Cotizador Online" onClick={() => scrollToSection('#cotizador')} icon={<Calculator />} isLight={isLightMode} />
            <MobileButton label="Contacto y Soporte" onClick={() => scrollToSection('#contacto')} icon={<MessageSquare />} isLight={isLightMode} />
          </div>

          <div className="absolute bottom-12 text-center">
             <p className={`text-[10px] font-mono tracking-widest uppercase mb-2 ${isLightMode ? 'text-gray-500' : 'text-cyan-900'}`}>
                 System Status: Online
             </p>
             <div className="w-12 h-1 bg-cyan-500/50 mx-auto rounded-full"></div>
          </div>
        </div>
      )}
    </>
  )
}

// Subcomponente Botón Escritorio
function NavButton({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="relative group overflow-hidden py-1 hover:text-cyan-500 transition-colors">
            {label}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </button>
    )
}

// Subcomponente Botón Móvil (Ahora soporta modo claro)
function MobileButton({ label, onClick, icon, isLight }: { label: string, onClick: () => void, icon: any, isLight?: boolean }) {
    return (
        <button 
            onClick={onClick} 
            className={`
                flex items-center gap-4 text-xl font-orbitron tracking-widest active:scale-95 transition-all p-4 border rounded-xl w-[280px] justify-center
                ${isLight 
                    ? "text-black border-gray-200 hover:bg-gray-100 hover:text-cyan-600" // Estilo Claro
                    : "text-white border-transparent hover:border-cyan-500/20 hover:bg-white/5 hover:text-cyan-400" // Estilo Oscuro
                }
            `}
        >
            <div className="text-cyan-500 opacity-70">
                {icon}
            </div>
            {label}
        </button>
    )
}
