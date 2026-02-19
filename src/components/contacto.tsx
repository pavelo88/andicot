"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Mail, Phone, MapPin, Send, Shield, Facebook, Instagram, Youtube, CheckCircle, AlertTriangle, Loader } from "lucide-react"

// --- INTERFACES ---
interface ContactoProps {
    info: { tel: string, email: string, direccion: string, wa_link?: string };
    redes: { facebook?: string, instagram?: string, tiktok?: string, fb?: string, ig?: string, tt?: string };
    garantia: { titulo: string, btn: string, items: string[] };
}

// =========================================================
// COMPONENTE DE CONTACTO
// =========================================================
export function Contacto({ info, redes, garantia }: ContactoProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    // LÓGICA: Sincroniza el mensaje desde el cotizador
    useEffect(() => {
        const handleUpdateForm = () => {
            const quoteMsg = localStorage.getItem("system_quote_msg");
            if (quoteMsg) {
                setMessage(quoteMsg);
                localStorage.removeItem("system_quote_msg");
            }
        };

        window.addEventListener("updateContactForm", handleUpdateForm);
        return () => window.removeEventListener("updateContactForm", handleUpdateForm);
    }, []);

    // LÓGICA: Envío del formulario a Firebase
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            await addDoc(collection(db, "contact_messages"), {
                name,
                email,
                message,
                createdAt: serverTimestamp(),
                status: 'pendiente', // Estado inicial para el CRM
                ia_note: 'Análisis pendiente...' // Nota inicial para la IA
            });
            setStatus('success');
            setName("");
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 4000);
        }
    };
    
    // --- URLs de Redes Sociales (A prueba de fallos) ---
    const facebookUrl = redes?.facebook || redes?.fb;
    const instagramUrl = redes?.instagram || redes?.ig;
    const tiktokUrl = redes?.tiktok || redes?.tt;

    return (
        <section id="contacto" className="relative z-10 py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
            
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white font-orbitron">
                    Contacto y <span className="text-cyan-500">Soporte</span>
                </h2>
                <div className="h-1 w-20 bg-cyan-500 mt-4 mx-auto shadow-[0_0_20px_rgba(0,242,255,0.6)]"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">

                {/* --- COLUMNA 1: FORMULARIO --- */}
                <div className="tech-glass p-8 border-cyan-500/20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-orbitron">
                        <Mail className="text-cyan-500" /> ENVIAR REQUERIMIENTO
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            placeholder="SU NOMBRE COMPLETO..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white rounded outline-none focus:border-cyan-500/60 focus:bg-black/60 transition-all font-mono tracking-wider"
                        />
                        <input
                            type="email"
                            placeholder="SU EMAIL DE CONTACTO..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white rounded outline-none focus:border-cyan-500/60 focus:bg-black/60 transition-all font-mono tracking-wider"
                        />
                        <textarea
                            placeholder="DETALLE SU NECESIDAD O PROYECTO..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full bg-black/40 border border-white/10 p-3 text-sm text-gray-300 rounded outline-none focus:border-cyan-500/60 focus:bg-black/60 transition-all resize-none leading-relaxed"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-cyan-500 text-black font-black uppercase py-4 rounded tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
                        >
                            {status === 'loading' && <Loader className="w-5 h-5 animate-spin" />}
                            {status === 'success' && <CheckCircle className="w-5 h-5" />}
                            {status === 'error' && <AlertTriangle className="w-5 h-5" />}
                            {status === 'idle' && <Send className="w-5 h-5" />}
                            
                            {status === 'loading' ? 'ENVIANDO...' :
                             status === 'success' ? 'MENSAJE RECIBIDO' :
                             status === 'error' ? 'ERROR, VERIFIQUE' : 'ENVIAR MENSAJE'}
                        </button>
                    </form>
                </div>

                {/* --- COLUMNA 2: INFO Y MAPA --- */}
                <div 
                    className="relative min-h-[500px] lg:min-h-full h-full tech-glass p-8 border-white/5 bg-cover bg-center flex flex-col justify-end"
                    style={{backgroundImage: "url('/mapa-bg.png')"}}
                >
                    <div className="absolute inset-0 bg-black/80"></div>
                    <div className="relative z-10 space-y-6 text-white">
                        {/* Datos de Contacto */}
                        <InfoItem icon={<Phone className="w-4 h-4" />} text={info.tel} href={`tel:${info.tel.replace(/\s/g, '')}`} />
                        <InfoItem icon={<Mail className="w-4 h-4" />} text={info.email} href={`mailto:${info.email}`} />
                        <InfoItem icon={<MapPin className="w-4 h-4" />} text={info.direccion} />

                        {/* Redes Sociales */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            {facebookUrl && <SocialIcon href={facebookUrl} icon={<Facebook className="w-5 h-5"/>} />}
                            {instagramUrl && <SocialIcon href={instagramUrl} icon={<Instagram className="w-5 h-5"/>} />}
                            {tiktokUrl && <SocialIcon href={tiktokUrl} icon={<Youtube className="w-5 h-5"/>} />}
                        </div>

                        {/* Garantía */}
                        <div className="p-4 bg-cyan-950/40 border border-cyan-500/20 rounded-lg">
                            <h4 className="text-cyan-400 font-bold uppercase text-xs flex items-center gap-2 mb-3">
                                <Shield className="w-4 h-4"/> {garantia.titulo}
                            </h4>
                            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                                {garantia.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

// --- SUBCOMPONENTES ---
function InfoItem({ icon, text, href }: { icon: React.ReactNode, text: string, href?: string }) {
    const content = (
        <div className="flex items-start gap-4 group">
            <div className="text-cyan-500 mt-1">{icon}</div>
            <p className="text-sm font-mono tracking-tight leading-relaxed group-hover:text-cyan-400 transition-colors">
                {text}
            </p>
        </div>
    );
    return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

function SocialIcon({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white hover:scale-110 transition-all">
            {icon}
        </a>
    )
}
