export function Experience({ stats }: { stats: any }) {
  // Si no hay datos, mostramos null para evitar errores
  if (!stats) return null;

  return (
    <section className="relative z-20 py-10 bg-black/50 border-y border-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {Object.entries(stats).map(([key, value]) => (
            <div 
              key={key} 
              className="p-6 border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md hover:bg-cyan-500/10 transition-colors group"
            >
              <div className="text-3xl font-black mb-1 italic text-white group-hover:text-cyan-400 transition-colors font-orbitron">
                {value as string}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-cyan-500/80">
                {key}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}