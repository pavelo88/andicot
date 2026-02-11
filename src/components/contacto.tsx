"use client"

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react"
import { MapPin, Mail, Phone, Facebook, Instagram, Music2, X, Send } from "lucide-react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"


export function Contacto({ info, redes, garantia }: { info: any, redes: any, garantia: any }) {
  const [showModal, setShowModal] = useState(false)
  const msgRef = useRef<HTMLTextAreaElement>(null)

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // --- CONEXIÓN CON COTIZADOR ---
  useEffect(() => {
    const loadMessage = () => {
      const msg = localStorage.getItem("system_quote_msg")
      if (msg && msgRef.current) {
        msgRef.current.value = msg
        msgRef.current.style.height = 'auto'
        msgRef.current.style.height = `${msgRef.current.scrollHeight}px`
        localStorage.removeItem("system_quote_msg") 
      }
    }
    window.addEventListener("updateContactForm", loadMessage)
    return () => window.removeEventListener("updateContactForm", loadMessage)
  }, [])

  // --- MANEJADORES DEL FORMULARIO ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; 
    e.target.style.height = `${e.target.scrollHeight}px`; 
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const message = msgRef.current?.value;
      if (!formData.name || !formData.email || !message) {
        throw new Error("Por favor complete los campos requeridos.");
      }
      await addDoc(collection(db, "contact_messages"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: message,
        createdAt: new Date().toISOString(),
        read: false,
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '' });
      if (msgRef.current) {
        msgRef.current.value = '';
        msgRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 6000);
    }
  };

  return (
    <>
      <section id="contacto" className="relative z-10 py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-6 scroll-mt-20">
        
        <h3 className="text-2xl md:text-3xl italic font-black mb-6 md:mb-12 uppercase text-white light:text-black font-orbitron text-center">
          Canal de Comunicación
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
          
          {/* === FORMULARIO === */}
          <div className="tech-glass rounded-xl p-5 md:p-8 flex flex-col h-full border-cyan-500/20 bg-black/40">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="NOMBRE" 
                  className="w-full bg-black/20 border border-cyan-500/30 text-white p-3 text-xs md:text-sm font-mono outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all rounded" 
                  required 
                />
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="EMAIL" 
                  className="w-full bg-black/20 border border-cyan-500/30 text-white p-3 text-xs md:text-sm font-mono outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all rounded" 
                  required 
                />
              </div>
              
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="WHATSAPP / TELÉFONO" 
                className="w-full bg-black/20 border border-cyan-500/30 text-white p-3 text-xs md:text-sm font-mono outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all rounded" 
              />
              
              <textarea 
                id="message-area"
                ref={msgRef}
                name="message"
                placeholder="DESCRIBA SU REQUERIMIENTO..." 
                rows={3}
                onInput={handleAutoResize}
                className="w-full bg-black/20 border border-cyan-500/30 text-white p-3 text-xs md:text-sm font-mono outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all resize-none overflow-hidden rounded min-h-[80px]" 
                required
              ></textarea>
              
              {submitStatus && (
                <div className={`p-3 rounded text-center text-xs font-mono ${submitStatus === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-red-900/50 text-red-300 border border-red-500/30'}`}>
                  {submitStatus === 'success' ? '¡Mensaje enviado! Nos pondremos en contacto pronto.' : 'Error al enviar. Por favor, intente de nuevo.'}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                <button type="submit" disabled={isSubmitting} className="bg-cyan-500 text-black font-black py-3 md:py-4 text-xs md:text-sm uppercase hover:brightness-125 transition-all font-orbitron flex items-center justify-center gap-2 rounded hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" /> {isSubmitting ? 'ENVIANDO...' : 'Enviar'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setShowModal(true)}
                  className="bg-transparent border border-cyan-500 text-cyan-500 font-bold py-3 md:py-4 text-xs md:text-sm uppercase hover:bg-cyan-500/10 transition-all font-orbitron rounded"
                >
                  {garantia.btn || "Ver Garantía"}
                </button>
              </div>
            </form>
          </div>
          
          {/* === INFO Y MAPA === */}
          <div className="tech-glass rounded-xl p-0 overflow-hidden flex flex-col h-full border-cyan-500/20 bg-black/40">
            <div className="p-6 text-center border-b border-cyan-500/20 bg-black/20">
                <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                    <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Contacto Directo</span>
                        <a href={`tel:${info.tel.replace(/\s/g, '')}`} className="text-xl md:text-2xl font-black text-white hover:text-cyan-400 transition-colors font-orbitron">
                        {info.tel}
                        </a>
                    </div>
                    <div className="flex gap-6">
                        <SocialIcon href={redes.fb} icon={<Facebook className="w-5 h-5" />} />
                        <SocialIcon href={redes.ig} icon={<Instagram className="w-5 h-5" />} />
                        <SocialIcon href={redes.tt} icon={<Music2 className="w-5 h-5" />} />
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] relative grayscale invert contrast-125 brightness-90 border-t border-cyan-500/20">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.05435678491!2d-78.57062637956405!3d-0.1865938072041283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a400242219b%3A0xe252752a16826f59!2sQuito%2C%20Ecuador!5e0!3m2!1ses!2s!4v1700000000000!5m2!1ses!2s"
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 bg-transparent pointer-events-none md:pointer-events-auto"></div>
            </div>
            
            <div className="p-3 bg-black/40 text-center border-t border-cyan-500/20">
                <p className="text-[10px] font-mono italic text-gray-400">
                  {info.direccion}
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL GARANTÍA */}
      {showModal && (
        <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="tech-glass max-w-2xl w-full p-6 md:p-10 relative overflow-y-auto max-h-[85vh] rounded-xl shadow-2xl shadow-cyan-500/20 border-cyan-500 bg-black/80">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-cyan-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl md:text-2xl uppercase italic text-cyan-400 font-black font-orbitron mb-6 border-b border-white/10 pb-4">
                {garantia.titulo}
            </h3>
            <div className="font-mono text-xs space-y-3 leading-relaxed text-gray-300">
              {garantia.items && garantia.items.map((item: string, i: number) => (
                <div key={i} className="flex gap-3">
                  <span className="text-cyan-500 font-bold shrink-0">{`0${i+1}`}</span>
                  <span>{item}</span>
                </div>
              ))}
              <div className="bg-red-950/30 border border-red-500/30 p-3 mt-4 text-[10px] text-red-200 rounded">
                <span className="font-bold block mb-1 text-red-400">IMPORTANTE:</span> 
                La garantía se anula por manipulación de terceros o variaciones de voltaje.
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-6 bg-cyan-500 text-black font-black w-full py-3 text-sm hover:brightness-125 transition-all font-orbitron uppercase rounded">
              {garantia.btn_cierre || "Entendido"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function SocialIcon({ href, icon }: { href: string, icon: any }) {
    return (
        <a href={href} target="_blank" className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all p-2 bg-white/5 rounded-full hover:bg-white/10 border border-transparent hover:border-cyan-500/30">
            {icon}
        </a>
    )
}
