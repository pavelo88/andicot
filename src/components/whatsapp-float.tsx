import { MessageCircle } from "lucide-react"

export function WhatsappFloat() {
  return (
    <a
      href="https://wa.me/593984467411"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-6 right-6 z-[200]
        flex items-center justify-center
        w-14 h-14 md:w-16 md:h-16 rounded-full
        bg-[#25d366] text-white
        shadow-[0_0_20px_rgba(37,211,102,0.5)]
        hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.8)] hover:brightness-110
        transition-all duration-300 ease-out
        group
      "
      aria-label="Contactar por WhatsApp"
    >
      {/* El icono tiene un pequeño shake al hacer hover en el botón padre */}
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-current group-hover:rotate-12 transition-transform" />
      
      {/* Onda de radar opcional (Ping effect) para llamar la atención */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-20 animate-ping -z-10"></span>
    </a>
  )
}
