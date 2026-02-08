"use client"

import { useState, useEffect } from "react"
import { useSystemData } from "@/hooks/useStarkData"
import { db, storage } from "@/lib/firebase"
import { doc, writeBatch } from "firebase/firestore" 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Save, Lock, Globe, Database, Upload, Tag, ShieldCheck, BarChart3, Mail, Award, DollarSign, Share2, LogOut } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)

  const { data, services, loading } = useSystemData()
  const [configForm, setConfigForm] = useState<any>(null)
  const [servicesForm, setServicesForm] = useState<any[]>([])
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")

  // --- PRE-CARGA DE ESTRUCTURA ---
  useEffect(() => {
    if (!loading && data && services.length > 0) {
      // 1. Preparamos la configuración global con valores por defecto
      const safeData = {
        ...data,
        hero: data.hero || { titulo_principal: "", titulo_resaltado: "", subtitulo: "" },
        garantia: data.garantia || { titulo: "Garantía STARK", desc: "", btn: "VER PÓLIZA" },
        estadisticas: data.estadisticas || { proyectos: "500+", años: "15+", uptime: "99.9%", soporte: "24/7" },
        contacto: data.contacto || { email: "", tel: "", direccion: "" },
        // NUEVOS CAMPOS: Redes y Finanzas
        redes: data.redes || { facebook: "", instagram: "", tiktok: "" },
        finanzas: data.finanzas || { iva: "15", descuento: "0" },
        // LÓGICA MARCAS: Convertimos array a texto para editar
        marcasString: data.marcas && Array.isArray(data.marcas) ? data.marcas.join(", ") : ""
      }
      setConfigForm(safeData)

      // 2. Preparamos los servicios
      const mapped = services.map(s => ({
        ...s,
        d: s.d || s.descripcion || "",
        tags: s.tags || "",
        img: s.img || "",
        newFile: null,
        previewUrl: null
      }))
      setServicesForm(mapped)
    }
  }, [data, services, loading])

  // --- MANEJADORES ---
  const handleConfigChange = (section: string, field: string, value: string) => {
    // Manejo especial para campos raíz (como marcasString)
    if (section === "root") {
        setConfigForm((prev: any) => ({ ...prev, [field]: value }))
    } else {
        setConfigForm((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }))
    }
  }

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updated = [...servicesForm]
    updated[index] = { ...updated[index], [field]: value }
    setServicesForm(updated)
  }

  const handleImageFile = (index: number, file: File) => {
    const updated = [...servicesForm]
    updated[index].newFile = file
    updated[index].previewUrl = URL.createObjectURL(file)
    setServicesForm(updated)
  }

  const saveAllChanges = async () => {
    setIsSaving(true)
    try {
      const batch = writeBatch(db)

      // 1. Procesar Imágenes de Servicios
      const updatedServices = await Promise.all(servicesForm.map(async (service) => {
        let finalUrl = service.img
        if (service.newFile) {
          const storageRef = ref(storage, `servicios/${service.id}/${Date.now()}`)
          await uploadBytes(storageRef, service.newFile)
          finalUrl = await getDownloadURL(storageRef)
        }
        return { ...service, img: finalUrl }
      }))

      // 2. Batch de Servicios
      updatedServices.forEach(s => {
        const { newFile, previewUrl, ...cleanData } = s
        batch.update(doc(db, "servicios", s.id), cleanData)
      })

      // 3. Preparar Configuración Global
      const finalConfig = { ...configForm }
      
      // Convertir string de marcas a array limpio
      if (finalConfig.marcasString) {
          finalConfig.marcas = finalConfig.marcasString.split(",").map((m: string) => m.trim()).filter(Boolean)
          delete finalConfig.marcasString
      }

      batch.update(doc(db, "configuracion", "web_data"), finalConfig)

      await batch.commit()
      setSaveStatus("success")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (e) {
      console.error(e)
      setSaveStatus("error")
    } finally { setIsSaving(false) }
  }

  // --- LOGIN ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Andicot_2026_Sinergia") setIsAuthenticated(true)
    else setAuthError(true)
  }

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="tech-glass p-10 max-w-md w-full border border-cyan-500/30 bg-black/90 shadow-2xl">
        <Lock className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
        <h1 className="text-2xl md:text-6xl font-orbitron text-center mb-8 uppercase tracking-tighter text-white">PANEL DE CONTROL</h1>
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-black border border-cyan-500/50 p-4 text-cyan-400 outline-none mb-6 text-center font-mono text-lg rounded" 
            placeholder="CLAVE DE ACCESO..." 
        />
        <button className="w-full bg-cyan-500 text-black font-bold py-4 uppercase text-sm tracking-[0.2em] hover:bg-cyan-400 transition-all rounded shadow-[0_0_20px_rgba(0,242,255,0.4)]">
            INICIAR SESIÓN
        </button>
        {authError && <p className="text-red-500 text-center mt-6 text-xs font-mono animate-pulse">ACCESO DENEGADO</p>}
      </form>
    </div>
  )

  if (loading || !configForm) return <div className="h-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-lg animate-pulse">SINCRONIZANDO SISTEMA...</div>

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 pb-40 font-sans">
      
      {/* HEADER FLOTANTE MEJORADO */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 sticky top-4 bg-black/80 backdrop-blur-xl z-50 py-4 px-6 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                <Database className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-black italic font-orbitron text-white">
                    SYSTEM <span className="text-cyan-500">ADMIN</span>
                </h1>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">Panel de Control Global</p>
            </div>
        </div>
        
        <div className="flex gap-4">
            <button onClick={() => setIsAuthenticated(false)} className="p-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut className="w-5 h-5" />
            </button>
            <button 
                onClick={saveAllChanges} 
                disabled={isSaving} 
                className={`px-8 py-3 font-bold uppercase text-sm flex items-center gap-3 transition-all rounded-lg border ${
                    saveStatus === "success" 
                    ? "bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                    : "bg-cyan-500 text-black border-cyan-400 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105"
                }`}
            >
                {isSaving ? "GUARDANDO..." : saveStatus === "success" ? "GUARDADO EXITOSO" : "GUARDAR CAMBIOS"} 
                <Save className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="space-y-10 max-w-7xl mx-auto">
        
        {/* FILA 1: HERO & ESTADÍSTICAS */}
        <div className="grid lg:grid-cols-2 gap-8">
            <SectionCard title="Contenido Hero Principal" icon={<Globe />}>
                <InputField label="Título Línea 1 (Blanco)" value={configForm.hero.titulo_principal} onChange={(v) => handleConfigChange("hero", "titulo_principal", v)} />
                <InputField label="Título Línea 2 (Cyan)" value={configForm.hero.titulo_resaltado} onChange={(v) => handleConfigChange("hero", "titulo_resaltado", v)} />
                <div>
                    <Label text="Subtítulo Descriptivo" />
                    <TextArea value={configForm.hero.subtitulo} onChange={(e) => handleConfigChange("hero", "subtitulo", e.target.value)} rows={3} />
                </div>
            </SectionCard>

            <SectionCard title="Estadísticas (Hero)" icon={<BarChart3 />}>
                <div className="grid grid-cols-2 gap-6">
                    <InputField label="Proyectos (ej: 500+)" value={configForm.estadisticas.proyectos} onChange={(v) => handleConfigChange("estadisticas", "proyectos", v)} />
                    <InputField label="Años Exp. (ej: 15+)" value={configForm.estadisticas.años} onChange={(v) => handleConfigChange("estadisticas", "años", v)} />
                    <InputField label="Uptime (ej: 99.9%)" value={configForm.estadisticas.uptime} onChange={(v) => handleConfigChange("estadisticas", "uptime", v)} />
                    <InputField label="Soporte (ej: 24/7)" value={configForm.estadisticas.soporte} onChange={(v) => handleConfigChange("estadisticas", "soporte", v)} />
                </div>
            </SectionCard>
        </div>

        {/* FILA 2: GARANTÍA, FINANZAS Y REDES */}
        <div className="grid lg:grid-cols-2 gap-8">
            <SectionCard title="Garantía & Finanzas" icon={<DollarSign />}>
                 {/* Garantía */}
                <div className="p-4 border border-white/5 rounded-lg bg-white/5 mb-6">
                    <h4 className="text-cyan-500 text-xs font-bold uppercase mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Configuración Garantía</h4>
                    <div className="space-y-4">
                        <InputField label="Título Garantía" value={configForm.garantia.titulo} onChange={(v) => handleConfigChange("garantia", "titulo", v)} />
                        <InputField label="Texto Botón" value={configForm.garantia.btn} onChange={(v) => handleConfigChange("garantia", "btn", v)} />
                    </div>
                </div>

                {/* Finanzas (IVA y Descuento) */}
                <div className="p-4 border border-white/5 rounded-lg bg-emerald-500/5">
                    <h4 className="text-emerald-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><Tag className="w-4 h-4"/> Configuración Cotizador</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="IVA (%)" value={configForm.finanzas.iva} onChange={(v) => handleConfigChange("finanzas", "iva", v)} />
                        <InputField label="Descuento Global (%)" value={configForm.finanzas.descuento} onChange={(v) => handleConfigChange("finanzas", "descuento", v)} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Contacto & Redes Sociales" icon={<Share2 />}>
                <div className="space-y-5">
                    <InputField label="Email Corporativo" value={configForm.contacto.email} onChange={(v) => handleConfigChange("contacto", "email", v)} />
                    <InputField label="WhatsApp / Teléfono" value={configForm.contacto.tel} onChange={(v) => handleConfigChange("contacto", "tel", v)} />
                    <InputField label="Dirección Física" value={configForm.contacto.direccion} onChange={(v) => handleConfigChange("contacto", "direccion", v)} />
                    
                    <div className="border-t border-white/10 pt-5 mt-5">
                        <Label text="Enlaces Redes Sociales" />
                        <div className="space-y-3">
                            <InputField label="Facebook URL" value={configForm.redes.facebook} onChange={(v) => handleConfigChange("redes", "facebook", v)} />
                            <InputField label="Instagram URL" value={configForm.redes.instagram} onChange={(v) => handleConfigChange("redes", "instagram", v)} />
                            <InputField label="TikTok URL" value={configForm.redes.tiktok} onChange={(v) => handleConfigChange("redes", "tiktok", v)} />
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>

        {/* FILA 3: GESTIÓN DE MARCAS (ALIADOS) */}
        <SectionCard title="Gestión de Aliados (Marcas)" icon={<Award />}>
            <div>
                <Label text="Lista de Marcas (Separar por comas)" />
                <TextArea 
                    value={configForm.marcasString || ""} 
                    onChange={(e) => handleConfigChange("root", "marcasString", e.target.value)} 
                    rows={4}
                    placeholder="Ej: BOSCH, SAMSUNG, HIKVISION, PELCO, DSC..."
                />
                <p className="text-xs text-cyan-400 mt-2 font-mono flex items-center gap-2">
                    <Database className="w-3 h-3" /> Las marcas se actualizarán automáticamente en el anillo 3D.
                </p>
            </div>
        </SectionCard>

        {/* SECCIÓN 4: CATÁLOGO DE SERVICIOS */}
        <div className="pt-10 border-t border-white/10">
            <h3 className="text-white font-black font-orbitron text-2xl mb-8 flex items-center gap-3 uppercase italic">
                <Database className="text-cyan-500 w-8 h-8" /> Catálogo de Servicios
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesForm.map((s, i) => (
                    <div key={s.id} className="tech-glass p-6 border-white/5 hover:border-cyan-500/40 transition-all group relative bg-black/40">
                        {/* ID Badge */}
                        <span className="absolute top-2 right-2 text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                            ID: {s.id.slice(0,6)}
                        </span>

                        {/* Imagen */}
                        <div className="relative aspect-video mb-5 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                            <img src={s.previewUrl || s.img || "/placeholder.jpg"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 bg-black/70 transition-all duration-300">
                                <Upload className="w-8 h-8 text-cyan-400 mb-2" />
                                <span className="text-[10px] uppercase font-bold text-white tracking-widest">Cambiar Imagen</span>
                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(i, e.target.files[0])} />
                            </label>
                        </div>

                        {/* Campos */}
                        <div className="space-y-4">
                            <input 
                                value={s.t || s.titulo} 
                                onChange={(e) => handleServiceChange(i, "t", e.target.value)} 
                                className="w-full bg-transparent border-b border-white/10 pb-2 font-orbitron text-lg font-bold uppercase text-cyan-400 outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-700" 
                                placeholder="TÍTULO DEL SERVICIO" 
                            />
                            
                            <div>
                                <Label text="Descripción Corta" />
                                <TextArea value={s.d} onChange={(e) => handleServiceChange(i, "d", e.target.value)} rows={3} />
                            </div>
                            
                            <div>
                                <Label text="Tags de Búsqueda" />
                                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded p-2 focus-within:border-cyan-500/50 transition-colors">
                                    <Tag className="w-4 h-4 text-cyan-500/50" />
                                    <input value={s.tags} onChange={(e) => handleServiceChange(i, "tags", e.target.value)} className="w-full bg-transparent text-xs text-cyan-100 font-mono outline-none" placeholder="camara, sensor, alarma..." />
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-emerald-900/10 p-3 rounded border border-emerald-500/20">
                                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Precio Base ($)</span>
                                <input 
                                    type="number" 
                                    value={s.p || s.precio_base} 
                                    onChange={(e) => handleServiceChange(i, "p", e.target.value)} 
                                    className="bg-transparent text-right font-mono text-white font-bold outline-none w-24 text-lg" 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  )
}

// --- COMPONENTES AUXILIARES PARA ESTILO UNIFICADO ---

function SectionCard({ title, icon, children }: any) {
    return (
        <section className="tech-glass p-8 border-white/5 bg-black/20 hover:bg-black/40 transition-colors">
            <h3 className="text-cyan-500 font-bold font-mono text-sm mb-6 flex items-center gap-3 uppercase tracking-[0.15em] border-b border-cyan-500/10 pb-4">
                {icon} {title}
            </h3>
            <div className="space-y-5">
                {children}
            </div>
        </section>
    )
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <Label text={label} />
            <input 
                value={value || ""} 
                onChange={(e) => onChange(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white rounded outline-none focus:border-cyan-500/60 focus:bg-black/60 transition-all font-medium" 
            />
        </div>
    )
}

function TextArea({ value, onChange, rows = 3, placeholder }: any) {
    return (
        <textarea 
            value={value || ""} 
            onChange={onChange} 
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 p-3 text-sm text-gray-300 rounded outline-none focus:border-cyan-500/60 focus:bg-black/60 transition-all resize-none leading-relaxed" 
        />
    )
}

function Label({ text }: { text: string }) {
    return (
        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">{text}</label>
    )
}
