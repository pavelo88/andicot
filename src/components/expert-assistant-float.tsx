"use client";

import { useState, useRef, useEffect } from 'react';
import { Cpu, Loader2, Send, Sparkles, X, Bot, MessageCircle } from 'lucide-react';
import { publicAIChatbot } from '@/ai/flows/publicAIChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


// Tipos para los mensajes y el historial
type Message = {
  role: 'user' | 'model';
  content: string;
};

// Guarda el prospecto en la colección 'contact_messages'
async function saveLeadToFirestore(leadData: { name?: string; phone?: string; email?: string; leadSummary?: string; }) {
  try {
    await addDoc(collection(db, "contact_messages"), {
      name: leadData.name || 'N/A',
      phone: leadData.phone || '',
      email: leadData.email || '',
      message: leadData.leadSummary || 'Generado por IA',
      createdAt: serverTimestamp(),
      status: 'pendiente', // Estado inicial para el CRM
      source: 'AIChatbot', // Origen del prospecto
    });
    return true;
  } catch (error) {
    console.error("Error al guardar prospecto en Firestore:", error);
    return false;
  }
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        { role: 'model', content: '¡Hola! Soy tu Consultor de Ingeniería de Andicot. Puedo ayudarte con dudas técnicas o a encontrar la solución perfecta para ti. ¿En qué puedo asistirte hoy?' }
      ]);
    }
  }, [isOpen, history.length]);

  // Scroll automático al final del chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await publicAIChatbot({ history: newHistory });

      // Guardar prospecto si se capturan datos
      if (response.name || response.phone || response.email) {
          const saved = await saveLeadToFirestore({
              name: response.name,
              phone: response.phone,
              email: response.email,
              leadSummary: response.leadSummary
          });
          if (saved) {
              toast({
                  title: "¡Datos de Contacto Recibidos!",
                  description: "Un especialista se pondrá en contacto contigo pronto.",
              });
          }
      }

      // Añadir la respuesta de la IA al historial
      const aiMessage: Message = { role: 'model', content: response.response };
      setHistory(prev => [...prev, aiMessage]);

      // Mostrar el botón de WhatsApp si la IA lo indica
      if (response.showWhatsappButton && response.whatsappSummary) {
          const whatsappMsg = encodeURIComponent(response.whatsappSummary);
          setWhatsappLink(`https://wa.me/593984467411?text=${whatsappMsg}`);
      }

    } catch (error) {
      console.error("Error al llamar al chatbot:", error);
      toast({
        variant: "destructive",
        title: "Error de Conexión",
        description: "No se pudo comunicar con el asistente. Intenta de nuevo.",
      });
      setHistory(prev => prev.slice(0, -1)); // Quita el mensaje del usuario si falla
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[200] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_theme(colors.primary/0.5)] hover:scale-110 hover:shadow-[0_0_30px_theme(colors.primary/0.8)] hover:brightness-110 transition-all duration-300 ease-out group"
        aria-label="Abrir Asistente de IA"
      >
        <Sparkles className="w-7 h-7 md:w-8 md:h-8 fill-current group-hover:rotate-12 transition-transform" />
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping -z-10"></span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[210] bg-black/60 backdrop-blur-sm animate-in fade-in-0" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`fixed bottom-6 left-6 z-[220] w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[600px] transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="tech-glass p-0 flex flex-col h-full border-primary/30 shadow-2xl rounded-2xl overflow-hidden">
          <header className="p-4 border-b border-primary/20 flex justify-between items-center">
            <div className="font-headline text-primary flex items-center gap-2">
              <Cpu size={20} /> Consultor IA
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground h-7 w-7">
              <X size={18} />
            </Button>
          </header>
          
          <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
              <div className="p-4 space-y-6">
                  {history.map((msg, index) => (
                      <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && (
                             <Avatar className="w-8 h-8 bg-primary/20 border border-primary/40">
                                 <AvatarFallback className="bg-transparent text-primary"><Bot size={16}/></AvatarFallback>
                             </Avatar>
                         )}
                         <div className={`rounded-xl p-3 max-w-[85%] text-sm leading-relaxed ${
                             msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                         }`}>
                             {msg.content}
                         </div>
                      </div>
                  ))}
                  {loading && (
                      <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 bg-primary/20 border border-primary/40">
                             <AvatarFallback className="bg-transparent text-primary"><Bot size={16}/></AvatarFallback>
                         </Avatar>
                         <div className="rounded-xl p-3 bg-secondary text-secondary-foreground">
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                         </div>
                      </div>
                  )}

                  {/* Botón dinámico de WhatsApp */}
                  {whatsappLink && (
                      <div className="p-4 flex justify-center">
                          <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white p-3 rounded-lg text-sm font-bold uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 animate-in fade-in-0"
                          >
                              <MessageCircle className="w-5 h-5" /> Continuar por WhatsApp
                          </a>
                      </div>
                  )}
              </div>
          </ScrollArea>

          <footer className="p-4 border-t border-primary/20">
            <div className="w-full flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-background/80 focus:ring-primary"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading} size="icon" className="bg-primary hover:bg-primary/90">
                <Send size={16} />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
