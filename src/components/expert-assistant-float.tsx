"use client";

import { useState } from 'react';
import { Cpu, Loader2, Send, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { expertAssistant } from '@/ai/flows/expert-assistant-flow';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface ExpertAssistantFloatProps {
    services: any[];
    brands: any[];
}

export function ExpertAssistantFloat({ services, brands }: ExpertAssistantFloatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: '¡Hola! Soy el asistente de Andicot. ¿En qué puedo ayudarte hoy? Pregúntame sobre nuestros servicios, marcas o cualquier otra duda que tengas.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await expertAssistant({
        question: input,
        servicesContext: JSON.stringify(services),
        brandsContext: JSON.stringify(brands),
      });

      const aiMessage: Message = { sender: 'ai', text: response.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling expert assistant:", error);
      toast({
        variant: "destructive",
        title: "Error de Conexión",
        description: "No se pudo comunicar con el asistente de IA. Por favor, intenta de nuevo más tarde.",
      });
      // Remove the user message if the AI fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="
            fixed bottom-6 left-6 z-[200]
            flex items-center justify-center
            w-14 h-14 md:w-16 md:h-16 rounded-full
            bg-primary text-secondary
            shadow-[0_0_20px_theme(colors.primary/0.5)]
            hover:scale-110 hover:shadow-[0_0_30px_theme(colors.primary/0.8)] hover:brightness-110
            transition-all duration-300 ease-out
            group
          "
          aria-label="Abrir Asistente de IA"
        >
          <Sparkles className="w-7 h-7 md:w-8 md:h-8 fill-current group-hover:rotate-12 transition-transform" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping -z-10"></span>
        </button>
      </DialogTrigger>
      <DialogContent className="tech-glass sm:max-w-md p-0 flex flex-col h-[70vh] max-h-[600px] border-primary/30">
        <DialogHeader className="p-4 border-b border-primary/20">
          <DialogTitle className="font-headline text-primary flex items-center gap-2">
            <Cpu size={20} /> Asistente Experto ANDICOT
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                       {msg.sender === 'ai' && (
                           <Avatar className="w-8 h-8 bg-primary/20 border border-primary/40">
                               <AvatarFallback className="bg-transparent text-primary">
                                   <Sparkles size={16}/>
                               </AvatarFallback>
                           </Avatar>
                       )}
                       <div className={`rounded-xl p-3 max-w-[80%] text-sm ${
                           msg.sender === 'user'
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-secondary text-secondary-foreground'
                       }`}>
                           {msg.text}
                       </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 bg-primary/20 border border-primary/40">
                           <AvatarFallback className="bg-transparent text-primary">
                               <Sparkles size={16}/>
                           </AvatarFallback>
                       </Avatar>
                       <div className="rounded-xl p-3 bg-secondary text-secondary-foreground">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                       </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        <DialogFooter className="p-4 border-t border-primary/20">
          <div className="w-full flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-background/80 focus:ring-primary"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading} size="icon" className="bg-primary hover:bg-primary/90">
              <Send size={16} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
