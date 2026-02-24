"use client"
import { useState } from "react"
import { Search, Shield, Zap, Globe, Cpu } from "lucide-react"

export function Hero({ data, stats, services = [], onSelect }: any) {
    const [searchTerm, setSearchTerm] = useState("")
    const [showResults, setShowResults] = useState(false)

    // Búsqueda Inteligente (Título + Tags ocultos)
    const filtered = services.filter((s: any) => 
        (s.t || s.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.tags || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelect = (id: string) => {
        if(onSelect) onSelect(id)
        setSearchTerm("")
        setShowResults(false)
    }

    return (
        <section className="relative min-h-[90vh] flex items-center px-6 pt-24 pb-12 bg-transparent">
            
            {/* --- VERSIÓN PC (PANTALLAS GRANDES) --- */}
            <div className="hidden lg:grid max-w-7xl mx-auto w-full grid-cols-2 gap-16 items-center z-30">
                {/* Izquierda: Textos y Buscador */}
                <div className="flex flex-col space-y-8">
                    <div>
                        <h1 className="font-headline font-black uppercase leading-none mb-6">
                            <span className="text-foreground text-4xl block mb-2">{data?.titulo_principal || "PROTEGEMOS SU"}</span>
                            <span className="text-accent text-5xl tracking-tighter block">{data?.titulo_resaltado || "INFRAESTRUCTURA"}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg border-l-2 border-accent/50 pl-6 max-w-lg font-body">
                            {data?.subtitulo || "Soluciones integrales de seguridad electrónica y automatización industrial."}
                        </p>
                    </div>

                    {/* Buscador PC */}
                    <div className="relative w-full max-w-md group">
                        <div className="stark-glass p-2 flex items-center bg-background/40 border-accent/30 transition-all focus-within:ring-2 focus-within:ring-accent">
                            <Search className="ml-3 w-5 h-5 text-accent" />
                            <input 
                                type="text" 
                                placeholder="BUSCAR MÓDULO (EJ: CÁMARAS)..." 
                                className="w-full bg-transparent border-none text-foreground p-3 outline-none font-code text-xs uppercase tracking-widest placeholder:text-muted-foreground" 
                                value={searchTerm} 
                                onChange={(e) => {setSearchTerm(e.target.value); setShowResults(true)}} 
                            />
                        </div>
                        {showResults && searchTerm && <ResultsList items={filtered} onSelect={handleSelect} />}
                    </div>
                </div>

                {/* Derecha: Stats (Pegadas a la derecha) */}
                <div className="justify-self-end grid grid-cols-2 gap-6 w-full max-w-md">
                    <StatCard label="PROYECTOS" value={stats?.proyectos || "500+"} icon={<Zap className="w-5 h-5"/>} />
                    <StatCard label="AÑOS EXP." value={stats?.años || "15+"} icon={<Globe className="w-5 h-5"/>} />
                    <StatCard label="UPTIME" value={stats?.uptime || "99.9%"} icon={<Cpu className="w-5 h-5"/>} />
                    <StatCard label="SOPORTE" value={stats?.soporte || "24/7"} icon={<Shield className="w-5 h-5"/>} />
                </div>
            </div>

            {/* --- VERSIÓN MÓVIL (CELULARES) --- */}
            <div className="lg:hidden w-full flex flex-col z-30 space-y-8">
                <div className="text-center px-2"> {/* Agregué padding lateral para seguridad */}
                    <h1 className="font-headline font-black uppercase leading-tight mb-4">
                        
                        <span className="text-foreground text-2xl md:text-3xl block mb-2">
                            {data?.titulo_principal || "PROTEGEMOS SU"}
                        </span>

                        <span className="text-accent text-2xl md:text-5xl tracking-tighter block break-words">
                            {data?.titulo_resaltado || "INFRAESTRUCTURA"}
                        </span>
                    </h1>
                    
                    <p className="text-muted-foreground text-sm px-4 leading-relaxed font-body">
                        {data?.subtitulo || "Soluciones integrales de seguridad electrónica."}
                    </p>
                </div>

                {/* 2. Stats (En medio) */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label="PROYECTOS" value={stats?.proyectos || "500+"} icon={<Zap className="w-4 h-4"/>} />
                    <StatCard label="AÑOS" value={stats?.años || "15+"} icon={<Globe className="w-4 h-4"/>} />
                    <StatCard label="UPTIME" value={stats?.uptime || "99.9%"} icon={<Cpu className="w-4 h-4"/>} />
                    <StatCard label="SOPORTE" value={stats?.soporte || "24/7"} icon={<Shield className="w-4 h-4"/>} />
                </div>

                {/* 3. Buscador (Al final) */}
                <div className="relative w-full">
                    <div className="stark-glass p-2 flex items-center bg-background/60 border-accent/30">
                        <Search className="ml-3 w-4 h-4 text-accent" />
                        <input 
                            type="text" 
                            placeholder="BUSCAR MÓDULO..." 
                            className="w-full bg-transparent border-none text-foreground p-3 outline-none font-code text-xs uppercase tracking-widest" 
                            value={searchTerm} 
                            onChange={(e) => {setSearchTerm(e.target.value); setShowResults(true)}} 
                        />
                    </div>
                    {showResults && searchTerm && <ResultsList items={filtered} onSelect={handleSelect} />}
                </div>
            </div>

        </section>
    )
}

// Componentes auxiliares
function StatCard({ label, value, icon }: any) {
    return (
        <div className="stark-glass p-4 flex flex-col items-center justify-center bg-background/40 border-border backdrop-blur-sm">
            <div className="text-accent mb-2 opacity-80">{icon}</div>
            <span className="text-xl md:text-2xl font-black text-foreground font-headline tracking-tighter">{value}</span>
            <span className="text-[8px] md:text-[9px] text-muted-foreground font-code uppercase mt-1 tracking-widest">{label}</span>
        </div>
    )
}

function ResultsList({ items, onSelect }: any) {
    return (
        <div className="absolute top-full left-0 w-full bg-background border border-accent/30 mt-2 z-50 rounded-lg overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
            {items.length > 0 ? (
                items.map((s: any) => (
                    <button key={s.id} onClick={() => onSelect(s.id)} className="w-full text-left p-4 hover:bg-accent/20 text-foreground text-[10px] uppercase font-code border-b border-border transition-colors flex justify-between">
                        <span>{s.t || s.titulo}</span>
                        <span className="text-accent">IR &rarr;</span>
                    </button>
                ))
            ) : (
                <div className="p-4 text-muted-foreground text-[10px] font-code text-center">NO SE ENCONTRARON RESULTADOS</div>
            )}
        </div>
    )
}
