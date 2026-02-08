"use client"

// 1. Importamos el "Mensajero" que conecta con Firebase/Datos
import { useSystemData } from "@/hooks/useStarkData"

// 2. Importamos todos tus componentes visuales
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
      <div className="h-screen bg-black text-cyan-500 font-mono flex items-center justify-center animate-pulse tracking-widest">
        CONECTANDO AL SISTEMA...
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
