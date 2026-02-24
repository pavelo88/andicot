export function Experience({ stats }: { stats: any }) {
  // Si no hay datos, mostramos null para evitar errores
  if (!stats) return null;

  return (
    <section className="relative z-20 py-10 bg-background/50 border-y border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {Object.entries(stats).map(([key, value]) => (
            <div 
              key={key} 
              className="p-6 border border-accent/20 bg-gradient-to-b from-accent/15 to-transparent backdrop-blur-md hover:from-accent/25 transition-all duration-300 group"
            >
              <div className="text-3xl font-black mb-1 text-foreground group-hover:text-accent transition-colors font-headline">
                {value as string}
              </div>
              <div className="font-code text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-accent/80">
                {key}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
