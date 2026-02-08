"use client"

import { useState, useEffect } from "react"
import { Trash2, FileText, Send, Plus, Minus, MousePointer2, ArrowDownCircle, MessageCircle, Tag } from "lucide-react"

interface Service {
  id: string
  t?: string; titulo?: string
  d?: string; descripcion?: string
  p?: string | number; precio_base?: string | number
}

interface Business {
  iva: string;
  descuento: string;
}

export function Cotizador({ services, business, preSelectedId }: { services: Service[], business?: Business, preSelectedId: string }) {
  const [selectedId, setSelectedId] = useState("")
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState<any[]>([])

  const selectedService = services.find(s => s.id === selectedId)

  useEffect(() => {
    if (preSelectedId) {
      setSelectedId(preSelectedId)
      const element = document.getElementById("cotizador")
      if (element) element.scrollIntoView({ behavior: "smooth" })
    }
  }, [preSelectedId])

  const addToCart = () => {
    if (!selectedId) return
    const service = services.find(s => s.id === selectedId)
    if (service) {
      const newItem = { 
        ...service, 
        uid: Date.now(), 
        qty, 
        price: Number(service.p || service.precio_base || 0) 
      }
      setCart([...cart, newItem])
      setQty(1)
    }
  }

  // --- CÁLCULOS FINANCIEROS ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
  
  const ivaPercent = parseFloat(business?.iva || "15")
  const discountPercent = parseFloat(business?.descuento || "0")

  const discountRate = discountPercent / 100
  const discountVal = subtotal * discountRate
  
  const subtotalLessDiscount = subtotal - discountVal
  const ivaVal = subtotalLessDiscount * (ivaPercent / 100)
  const total = subtotalLessDiscount + ivaVal


  // --- ENVIAR DATOS ---
  const sendWhatsApp = () => {
    const detalle = cart.map(i => `- ${i.qty}x ${i.t || i.titulo} ($${i.price})`).join("%0A")
    const msg = `Hola, equipo de Andicot, solicito proforma:%0A${detalle}%0A%0ASubtotal: $${subtotal.toFixed(2)}%0ADescuento: -$${discountVal.toFixed(2)}%0AIVA (${ivaPercent}%): $${ivaVal.toFixed(2)}%0A*TOTAL: $${total.toFixed(2)}*`
    window.open(`https://wa.me/593984467411?text=${msg}`, '_blank')
  }

  const sendToForm = () => {
    // 1. Crear el mensaje bonito
    const detalle = cart.map(i => `- ${i.qty}x ${i.t || i.titulo}`).join("\n")
    const msg = `SOLICITUD DE PROFORMA WEB:\n\n${detalle}\n\nSubtotal: $${subtotal.toFixed(2)}\nDescuento: -$${discountVal.toFixed(2)}\nIVA (${ivaPercent}%): $${ivaVal.toFixed(2)}\nTOTAL ESTIMADO: $${total.toFixed(2)}`
    
    // 2. Guardar en memoria
    localStorage.setItem("system_quote_msg", msg)
    
    // 3. Avisar al formulario
    window.dispatchEvent(new Event("updateContactForm"))
    
    // 4. Bajar al contacto
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
  }

  const proformaPreview = cart.map(i => i.t || i.titulo).join(", ")

  return (
    <section id="cotizador" className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24">
      
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white light:text-black font-orbitron">
          Configurador de <span className="text-cyan-500">Proforma</span>
        </h2>
        <div className="h-1 w-20 bg-cyan-500 mt-4 mx-auto shadow-[0_0_20px_rgba(0,242,255,0.6)]"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        
        {/* --- CONFIGURADOR --- */}
        <div className="tech-glass p-8 flex flex-col h-full border-cyan-500/20">
          <h3 className="text-xl font-bold text-white light:text-black mb-6 flex items-center gap-2 font-orbitron">
            <Plus className="text-cyan-500" /> AGREGAR MÓDULOS
          </h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2 block">Seleccione Solución</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white light:text-black p-4 rounded-lg outline-none focus:border-cyan-500 font-mono text-xs uppercase"
              >
                <option value="">-- SELECCIONAR --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.t || s.titulo}</option>
                ))}
              </select>
              {selectedService && (
                <p className="mt-3 text-[10px] text-gray-400 italic leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {selectedService.d || selectedService.descripcion}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2 block">Cantidad</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 bg-white/5 rounded text-cyan-500"><Minus className="w-4 h-4" /></button>
                <span className="text-2xl font-mono font-bold text-white light:text-black w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 bg-white/5 rounded text-cyan-500"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <button 
            onClick={addToCart}
            disabled={!selectedId}
            className="w-full mt-8 bg-cyan-500 text-black font-black uppercase py-4 rounded tracking-widest transition-all disabled:opacity-50 hover:brightness-110"
          >
            Añadir a Proforma
          </button>
        </div>

        {/* --- RESUMEN FINANCIERO --- */}
        <div id="detalle-proforma" className="tech-glass p-8 flex flex-col h-full border-cyan-500/20 bg-black/40 scroll-mt-32">
          <h3 className="text-xl font-bold text-white light:text-black mb-6 flex items-center gap-2 font-orbitron">
            <FileText className="text-cyan-500" /> RESUMEN DE COSTOS
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[250px] pr-2 space-y-3 mb-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <MousePointer2 className="w-8 h-8 mb-2" />
                <p className="text-xs font-mono uppercase">Carrito Vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.uid} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] font-bold text-white light:text-black uppercase">{item.qty}x {item.t || item.titulo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-500 text-xs">${item.price * item.qty}</span>
                    <button onClick={() => setCart(cart.filter(i => i.uid !== item.uid))} className="text-gray-600 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* TABLA DE TOTALES */}
          <div className="border-t border-white/10 pt-4 font-mono text-xs space-y-2">
            <div className="flex justify-between text-gray-400">
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountVal > 0 && (
                <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> DESCUENTO ({discountPercent}%)</span>
                    <span>-${discountVal.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between text-gray-400">
                <span>IVA ({ivaPercent}%)</span>
                <span>${ivaVal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-xl font-bold text-white light:text-black pt-4 border-t border-dashed border-white/10 mt-2">
              <span className="font-orbitron italic">TOTAL</span>
              <span className="text-cyan-500">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
                onClick={sendToForm}
                className="flex items-center justify-center gap-2 bg-white/5 border border-cyan-500/30 text-white light:text-black p-3 rounded text-[10px] font-bold uppercase hover:bg-cyan-500/10 transition-all text-center"
            >
              <Send className="w-4 h-4" /> Solicitar información
            </button>
            <button 
              onClick={sendWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded text-[10px] font-bold uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
