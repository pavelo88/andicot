"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Mail, Phone, Send, Shield, Facebook, Instagram, Music2, CheckCircle, AlertTriangle, Loader, FileText } from "lucide-react"

// Componentes para el Modal de Garantía
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"


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
    const { toast } = useToast()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
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
            toast({
                variant: "destructive",
                title: "Información Incompleta",
                description: "Por favor, complete todos los campos requeridos (nombre, email y mensaje).",
            })
            return;
        }
        setStatus('loading');
        try {
            await addDoc(collection(db, "contact_messages"), {
                name,
                email,
                phone,
                message,
                createdAt: serverTimestamp(),
                status: 'pendiente', // Estado inicial para el CRM
            });
            setStatus('success');
            setName("");
            setEmail("");
            setPhone("");
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
                <h2 className="text-3xl md:text-5xl font-black uppercase text-foreground font-headline">
                    Canal de <span className="text-accent">Comunicación</span>
                </h2>
                <div className="h-1 w-20 bg-accent mt-4 mx-auto shadow-[0_0_20px_theme(colors.accent/0.6)]"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-stretch">

                {/* --- COLUMNA 1: FORMULARIO --- */}
                <div className="tech-glass p-8 border-accent/20 rounded-xl flex flex-col h-full">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 font-headline">
                        <Mail className="text-accent" /> ENVIAR REQUERIMIENTO
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                        <input
                            type="text"
                            placeholder="SU NOMBRE COMPLETO..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background/40 border border-border p-3 text-sm text-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all font-code tracking-wider"
                        />
                         <input
                            type="email"
                            placeholder="SU EMAIL DE CONTACTO..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background/40 border border-border p-3 text-sm text-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all font-code tracking-wider"
                        />
                        <input
                            type="tel"
                            placeholder="SU TELÉFONO (OPCIONAL)..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-background/40 border border-border p-3 text-sm text-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all font-code tracking-wider"
                        />
                        <textarea
                            placeholder="DETALLE SU NECESIDAD O PROYECTO..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full bg-background/40 border border-border p-3 text-sm text-muted-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all resize-none leading-relaxed flex-1"
                        />
                        <div className="grid grid-cols-2 gap-4 mt-auto pt-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full bg-transparent border-accent/30 text-accent hover:bg-accent/10 hover:text-accent">
                                        <Shield className="w-4 h-4 mr-2" />
                                        {garantia.btn}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="tech-glass max-w-2xl text-foreground border-accent/30">
                                    <DialogHeader>
                                        <DialogTitle className="font-headline text-accent text-2xl flex items-center gap-3">
                                            <FileText/> {garantia.titulo}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Resumen de los términos y condiciones más importantes.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-80 w-full pr-4">
                                        <div className="text-muted-foreground text-sm space-y-4 text-left font-body pr-6">
                                            
                                        <p>Los dispositivos y equipos comercializados cuentan con un año de garantía contra defectos de fábrica, de acuerdo con los siguientes términos y condiciones.</p>

                                        <h5 className="font-bold text-foreground pt-4">Procedimiento de Garantía</h5>
                                        <ul className="list-disc pl-5 space-y-3">
                                            <li><strong>Coordinación Previa:</strong> Antes de acudir, comunique el desperfecto por email (ventas@andicot.com) o WhatsApp (0984467411), incluyendo detalles y videos del problema.</li>
                                            <li><strong>Recepción:</strong> El trámite se realiza en nuestra oficina (Jose Tamayo N24-33, Torres del Castillo, T2, Of. 903) de lunes a viernes, de 09h00 a 17h00.</li>
                                            <li><strong>Requisitos:</strong> Es indispensable presentar la factura y todos los accesorios originales. El trámite es personal con el cliente directo.</li>
                                            <li><strong>Diagnóstico:</strong> El tiempo de respuesta es de 48 a 72 horas laborables.</li>
                                        </ul>

                                        <h5 className="font-bold text-foreground pt-4">Condiciones y Exclusiones</h5>
                                        <ul className="list-disc pl-5 space-y-3">
                                            <li><strong>Reposición:</strong> Si un producto no tiene stock o está discontinuado, se emitirá una nota de crédito proporcional. El producto de recambio continúa con el tiempo de garantía original.</li>
                                            <li><strong>Logística:</strong> Gastos de envío por courier a provincia son cubiertos por el cliente.</li>
                                            <li><strong>Sin Garantía:</strong> Cables, accesorios y productos sin número de serie se entregan probados y no están cubiertos.</li>
                                            <li><strong>Costo por Revisión:</strong> Si el equipo funciona correctamente, el diagnóstico tiene un costo de $10 + IVA. Se recomienda realizar pruebas previas por WhatsApp para evitar este cargo.</li>
                                            <li><strong>Abandono:</strong> No nos responsabilizamos por equipos no reclamados después de 30 días.</li>
                                        </ul>

                                        <h5 className="font-bold text-foreground pt-4">Causas de Invalidación Automática</h5>
                                        <p>
                                            La garantía se anulará de forma inmediata si el equipo ha sido abierto, manipulado por personal no autorizado, o si presenta golpes, quemaduras, humedad, sobrecargas de voltaje o alteración en los sellos de seguridad y seriales.
                                        </p>
                                        </div>
                                    </ScrollArea>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Cerrar
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-accent text-accent-foreground font-black uppercase py-3 rounded tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
                            >
                                {status === 'loading' && <Loader className="w-5 h-5 animate-spin" />}
                                {status === 'success' && <CheckCircle className="w-5 h-5" />}
                                {status === 'error' && <AlertTriangle className="w-5 h-5" />}
                                {status === 'idle' && <Send className="w-5 h-5" />}
                                
                                {status === 'loading' ? 'ENVIANDO...' :
                                 status === 'success' ? 'RECIBIDO' :
                                 status === 'error' ? 'VERIFIQUE' : 'ENVIAR'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- COLUMNA 2: INFO Y MAPA (ACTUALIZADA) --- */}
                <div className="tech-glass rounded-xl p-0 overflow-hidden flex flex-col h-full border-accent/20 bg-card/40">
                    <div className="p-6 text-center border-b border-accent/20 bg-background/20">
                        <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                            <div>
                                <span className="font-code text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">OFICINA CENTRAL</span>
                                <a href={`tel:${info.tel.replace(/\s/g, '')}`} className="text-xl md:text-2xl font-black text-foreground hover:text-accent transition-colors font-headline">
                                {info.tel}
                                </a>
                            </div>
                            <div className="flex gap-6">
                                {facebookUrl && <SocialIcon href={facebookUrl} icon={<Facebook className="w-5 h-5" />} />}
                                {instagramUrl && <SocialIcon href={instagramUrl} icon={<Instagram className="w-5 h-5" />} />}
                                {tiktokUrl && <SocialIcon href={tiktokUrl} icon={<Music2 className="w-5 h-5" />} />}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px] relative grayscale invert contrast-125 brightness-90 border-t border-accent/20">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.817298131365!2d-78.48952862590858!3d-0.185623835431189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a7f3b405c77%3A0x6b84025c56b7c524!2sTorres%20del%20Castillo!5e0!3m2!1ses-419!2sec!4v1715981016839!5m2!1ses-419!2sec"
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="absolute inset-0 bg-transparent pointer-events-none md:pointer-events-auto"></div>
                    </div>
                    
                    <div className="p-3 bg-background/40 text-center border-t border-accent/20">
                        <p className="text-[10px] font-code text-muted-foreground">
                        {info.direccion}
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

function SocialIcon({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent hover:scale-110 transition-all p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 border border-transparent hover:border-accent/30">
            {icon}
        </a>
    )
}

    
