export function Footer() {
    const currentYear = new Date().getFullYear() // Esto toma el año actual del sistema
  
    return (
      <footer className="relative z-10 py-12 text-center border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-600 leading-loose selection:text-cyan-400 selection:bg-cyan-900/20">
          © {currentYear} ANDICOT SOLUTIONS | <br className="md:hidden" /> Ingeniería de Seguridad Avanzada
        </span>
      </footer>
    )
  }