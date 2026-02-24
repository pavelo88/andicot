"use client"

import { useState, useEffect } from "react"
import { Trash2, FileText, Send, Plus, Minus, MousePointer2, ArrowDownCircle, MessageCircle, Tag, Check } from "lucide-react"

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
  
  const [showToast, setShowToast] = useState(false)

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
      
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 2500)
    }
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
  
  const ivaPercent = parseFloat(business?.iva || "15")
  const discountPercent = parseFloat(business?.descuento || "0")

  const discountRate = discountPercent / 100
  const discountVal = subtotal * discountRate
  
  const subtotalLessDiscount = subtotal - discountVal
  const ivaVal = subtotalLessDiscount * (ivaPercent / 100)
  const total = subtotalLessDiscount + ivaVal


  const sendWhatsApp = () => {
    const detalle = cart.map(i => `- ${i.qty}x ${i.t || i.titulo} ($${i.price})`).join("%0A")
    const msg = `Hola, equipo de Andicot, solicito proforma:%0A${detalle}%0A%0ASubtotal: $${subtotal.toFixed(2)}%0ADescuento: -$${discountVal.toFixed(2)}%0AIVA (${ivaPercent}%): $${ivaVal.toFixed(2)}%0A*TOTAL: $${total.toFixed(2)}*`
    window.open(`https://wa.me/593984467411?text=${msg}`, '_blank')
  }

  const sendToForm = () => {
    const detalle = cart.map(i => `- ${i.qty}x ${i.t || i.titulo}`).join("\n")
    const msg = `SOLICITUD DE PROFORMA WEB:\n\n${detalle}\n\nSubtotal: $${subtotal.toFixed(2)}\nDescuento: -$${discountVal.toFixed(2)}\nIVA (${ivaPercent}%): $${ivaVal.toFixed(2)}\nTOTAL ESTIMADO: $${total.toFixed(2)}`
    
    localStorage.setItem("system_quote_msg", msg)
    window.dispatchEvent(new Event("updateContactForm"))
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleJumpToSummary = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("detalle-proforma");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="cotizador" className="py-20 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-24">
      
      <div 
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm transition-all duration-500 ease-in-out ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-background/90 backdrop-blur-md border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-lg p-4 flex items-center gap-4">
            <div className="bg-emerald-500/20 p-2 rounded-full">
                <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
                <p className="text-emerald-400 font-bold font-headline text-sm uppercase">¡Servicio Agregado!</p>
                <p className="text-muted-foreground text-[10px] leading-tight mt-1">
                    Verifica tu proforma abajo o sigue agregando.
                </p>
            </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black uppercase text-foreground font-headline">
          Configurador de <span className="text-accent">Proforma</span>
        </h2>
        <div className="h-1 w-20 bg-accent mt-4 mx-auto shadow-[0_0_20px_theme(colors.accent/0.6)]"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        
        <div className="tech-glass p-8 flex flex-col h-full border-accent/20">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 font-headline">
            <Plus className="text-accent" /> AGREGAR MÓDULOS
          </h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 block">Seleccione Solución</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-background/60 border border-border text-foreground p-4 rounded-lg outline-none focus:border-accent font-code text-xs uppercase"
              >
                <option value="">-- SELECCIONAR --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.t || s.titulo}</option>
                ))}
              </select>
              {selectedService && (
                <p className="mt-3 text-[10px] text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1">
                  {selectedService.d || selectedService.descripcion}
                </p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 block">Cantidad</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 bg-foreground/5 rounded text-accent"><Minus className="w-4 h-4" /></button>
                <span className="text-2xl font-code font-bold text-foreground w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 bg-foreground/5 rounded text-accent"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <button 
            onClick={addToCart}
            disabled={!selectedId}
            className="w-full mt-8 bg-accent text-accent-foreground font-black uppercase py-4 rounded tracking-widest transition-all disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
          >
            Añadir a Proforma
          </button>

          <button
            onClick={handleJumpToSummary}
            className="lg:hidden mt-6 text-emerald-400 font-code text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse hover:text-emerald-300"
          >
            Ver Resumen de Costos <ArrowDownCircle className="w-4 h-4" />
          </button>
        </div>

        <div id="detalle-proforma" className="tech-glass p-8 flex flex-col h-full border-accent/20 bg-card/40 scroll-mt-32">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 font-headline">
            <FileText className="text-accent" /> RESUMEN DE COSTOS
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[250px] pr-2 space-y-3 mb-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <MousePointer2 className="w-8 h-8 mb-2" />
                <p className="text-xs font-code uppercase">Carrito Vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.uid} className="flex justify-between items-center bg-foreground/5 p-3 rounded border border-border">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] font-bold text-foreground uppercase">{item.qty}x {item.t || item.titulo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-code text-accent text-xs">${item.price * item.qty}</span>
                    <button onClick={() => setCart(cart.filter(i => i.uid !== item.uid))} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border pt-4 font-code text-xs space-y-2">
            <div className="flex justify-between text-muted-foreground">
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountVal > 0 && (
                <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> DESCUENTO ({discountPercent}%)</span>
                    <span>-${discountVal.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between text-muted-foreground">
                <span>IVA ({ivaPercent}%)</span>
                <span>${ivaVal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-xl font-bold text-foreground pt-4 border-t border-dashed border-border mt-2">
              <span className="font-headline">TOTAL</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
                onClick={sendToForm}
                className="flex items-center justify-center gap-2 bg-foreground/5 border border-accent/30 text-foreground p-3 rounded text-[10px] font-bold uppercase hover:bg-accent/10 transition-all text-center"
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
