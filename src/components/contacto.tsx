"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Mail, Phone, MapPin, Send, Shield, Facebook, Instagram, Youtube, CheckCircle, AlertTriangle, Loader, FileText } from "lucide-react"

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
                        <div className="grid grid-cols-2 gap-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                        <Shield className="w-4 h-4 mr-2" />
                                        {garantia.btn}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="tech-glass max-w-2xl text-white border-cyan-500/30">
                                    <DialogHeader>
                                        <DialogTitle className="font-orbitron text-cyan-400 text-2xl flex items-center gap-3">
                                            <FileText/> {garantia.titulo}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="h-72 w-full pr-4">
                                        <DialogDescription className="text-gray-300 text-sm space-y-4 text-left font-mono">
                                            <p>Los dispositivos y equipos comercializados cuentan con un año de garantía contra defectos de fábrica, de acuerdo con los siguientes términos y condiciones.</p>
                                            <p>El procedimiento para aplicar a garantía se realiza en la oficina ubicada en la calle Jose Tamayo N24-33 y Baquerizo Moreno. Complejo corporativo Torres del Castillo – Torre 2 – oficina 903, previa coordinación, en horario laborable de lunes a viernes de 09h00 hasta 17h00.</p>
                                            <p>La recepción de equipos se realiza una vez se haya comunicado el desperfecto previamente por correo electrónico (ventas@andicot.com) o WhatsApp (0984467411), se requiere detalle especificando el problema del producto y video del inconveniente.</p>
                                            <p>El trámite de garantía se realiza directamente con el cliente, no con terceros, se requiere de la factura y accesorios, sin adulteración del serial o apertura del equipo por terceros, que el equipo no presente golpes o quemaduras, variaciones de voltaje, o evidencias de mala manipulación y uso.</p>
                                            <p>El tiempo de respuesta en el diagnóstico para validar la aplicación de garantía es de aproximadamente 48 a 72 horas en horario laborable, a partir del ingreso del equipo en soporte técnico.</p>
                                            <p>En caso de que el producto no se pueda realizar reposición por falta de stock o se encuentre discontinuado, se emitirá una nota de crédito por el valor proporcional del tiempo restante de la garantía.</p>
                                            <p>Cuando se hace efectivo un cambio por garantía, este producto prosigue con el tiempo restante de garantía con respecto a la factura de venta.</p>
                                            <p>No nos responsabilizamos de productos que el cliente no reclame dentro de los 30 días después del ingreso a garantía.</p>
                                            <p>En caso de que la compra haya sido enviada por courier a provincia por petición del cliente, éste debe cubrir todos los gastos de logística, no nos responsabilizamos por valores de envío adicionales.</p>
                                            <p>Los productos sin garantía son los referidos a cables, accesorios y/o productos que no dispongan de número serial, por lo que se entregan probados, comprobando su funcionamiento.</p>
                                            <p>Cuando el producto ingresa a revisión por garantía y se comprueba su buen estado, esta revisión y diagnóstico causará un costo de servicios técnicos de USD $10 mas impuestos; para evitar tal situación, se recomienda informar por correo o WhatsApp para realizar pruebas previas.</p>
                                            <p className="font-bold text-cyan-400">Toda garantía se invalida en forma automática en los siguientes casos:</p>
                                            <ul className="list-disc list-inside space-y-2 pl-4">
                                                <li>Si el sello de seguridad o la etiqueta en la que consta el número de serie muestra signos de haber sido movido o alterado.</li>
                                                <li>Si los equipos o partes se encuentran golpeados, rotos o con signos de maltratos o humedad.</li>
                                                <li>Si algún componente electrónico está quemado o se verifica que ha sido manipulado.</li>
                                                <li>Si el equipo ha sido abierto y manipulado internamente.</li>
                                            </ul>
                                        </DialogDescription>
                                    </ScrollArea>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" className="w-full bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-200">
                                                Cerrar
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-cyan-500 text-black font-black uppercase py-3 rounded tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
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

                {/* --- COLUMNA 2: INFO Y MAPA --- */}
                <div 
                    className="relative min-h-[500px] lg:min-h-full h-full tech-glass p-8 border-white/5 bg-cover bg-center flex flex-col justify-end"
                    style={{backgroundImage: "url('/mapa-bg.png')"}}
                >
                    <div className="absolute inset-0 bg-black/80"></div>
                    <div className="relative z-10 space-y-6 text-white">
                        {/* Datos de Contacto */}
                        <InfoItem icon={<Phone className="w-4 h-4" />} text={info.tel} href={info.wa_link || `https://wa.me/${info.tel.replace(/\s/g, '')}`} />
                        <InfoItem icon={<Mail className="w-4 h-4" />} text={info.email} href={`mailto:${info.email}`} />
                        <InfoItem icon={<MapPin className="w-4 h-4" />} text={info.direccion} />

                        {/* Redes Sociales */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            {facebookUrl && <SocialIcon href={facebookUrl} icon={<Facebook className="w-5 h-5"/>} />}
                            {instagramUrl && <SocialIcon href={instagramUrl} icon={<Instagram className="w-5 h-5"/>} />}
                            {tiktokUrl && <SocialIcon href={tiktokUrl} icon={<Youtube className="w-5 h-5"/>} />}
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
            <p className="text-sm font-mono tracking-tight leading-relaxed group-hover:text-cyan-400 transition-colors phone-number-stark">
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