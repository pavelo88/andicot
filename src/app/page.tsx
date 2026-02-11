"use client"

import Image from "next/image"
import { useSystemData } from "@/hooks/useStarkData"
import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { Marcas } from "@/components/marcas"
import { Servicios } from "@/components/servicios"
import { Cotizador } from "@/components/cotizador"
import { Contacto } from "@/components/contacto"
import { Footer } from "@/components/footer"
import { WhatsappFloat } from "@/components/whatsapp-float"
import { useState } from "react"

export default function Home() {
  // 3. Activamos el Mensajero
  const { data, services, loading } = useSystemData()
  
  // Estado para el COTIZADOR (Qué servicio se va a cotizar)
  const [servicioSeleccionado, setServicioSeleccionado] = useState("")

  // Estado para el BUSCADOR (Qué servicio se va a resaltar/iluminar)
  const [highlightedService, setHighlightedService] = useState("")

  // 4. Pantalla de carga (Mientras conecta con el satélite)
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
        
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
            
            <Image 
              src="https://picsum.photos/seed/logo/96/96"
              alt="Logo Andicot"
              width={96}
              height={96}
              priority
              className="relative z-10 drop-shadow-[0_0_10px_rgba(0,242,255,0.8)] animate-pulse object-contain rounded-full"
            />
        </div>

        {/* TÍTULO DE BIENVENIDA */}
        <h1 className="text-2xl md:text-4xl font-black text-white font-orbitron tracking-widest uppercase mb-4">
          BIENVENIDO A ANDICOT
        </h1>

        {/* DESCRIPCIÓN DE LA EMPRESA */}
        <p className="text-cyan-500 font-mono text-sm md:text-base max-w-xl leading-relaxed mx-auto">
          Expertos en Infraestructura, Cableado Estructurado y Soluciones Tecnológicas de Alta Gama.
        </p>

        {/* INDICADOR DE CARGA INFERIOR */}
        <div className="mt-12 flex flex-col items-center gap-3">
            {/* Spinner simple */}
            <div className="w-6 h-6 border-2 border-cyan-900 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase animate-pulse">
              Sincronizando Sistema...
            </span>
        </div>

      </div>
    )
  }

  // LÓGICA: Cuando el usuario busca algo en el Hero
  const handleSearchSelection = (id: string) => {
    // 1. Marcamos cual es el ID que debe brillar
    setHighlightedService(id)
    
    // 2. Navegamos suavemente hacia la sección de servicios
    const element = document.getElementById("servicios")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    // 3. Apagamos el brillo después de 4 segundos (efecto flash)
    setTimeout(() => {
      setHighlightedService("")
    }, 4000)
  }

  // LÓGICA: Cuando el usuario hace clic en una tarjeta para cotizar
  const handleCardClick = (id: string) => {
    setServicioSeleccionado(id)
    const element = document.getElementById("cotizador")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // 5. Si ya cargó, mostramos la web completa
  return (
    <div className="relative z-10 text-white selection:bg-cyan-500/30">
      <Nav />
      
      <main>
        {/* HERO: Le pasamos la nueva función de búsqueda */}
        <Hero 
          data={data.hero} 
          stats={data.estadisticas} 
          services={services}
          onSelect={handleSearchSelection} 
        />

        <Marcas brands={data.marcas} />
        
        {/* SERVICIOS: Recibe el ID resaltado y la función de click */}
        {/* NOTA: Tu componente Servicios necesitará una pequeña actualización para leer 'highlightedId' */}
        <Servicios 
          services={services}
          highlightedId={highlightedService}
          onSelect={handleCardClick} 
        />
        
        {/* COTIZADOR: Recibe el servicio seleccionado */}
        <Cotizador 
          services={services} 
          business={data.finanzas} 
          preSelectedId={servicioSeleccionado}
       />
        
        <Contacto 
          info={data.contacto} 
          redes={data.redes} 
          garantia={data.garantia} 
        />
      </main>

      <Footer />
      
      <WhatsappFloat />
    </div>
  )
}
