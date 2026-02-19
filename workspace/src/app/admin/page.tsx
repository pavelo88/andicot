
"use client"

import Image from "next/image"
import logoImg from "../icon.png"
import { useState, useEffect, useCallback } from "react"
import { useSystemData } from "@/hooks/useStarkData"
import { db, storage } from "@/lib/firebase" 
import { doc, writeBatch } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Save, Lock, Globe, Database, Tag, ShieldCheck, BarChart3, Mail, Award, DollarSign, Share2, LogOut, Upload, Trash2, X } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)

  const { data, services, loading } = useSystemData()
  const [configForm, setConfigForm] = useState<any>(null)
  const [servicesForm, setServicesForm] = useState<any[]>([])
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  
  // Estados para Drag & Drop
  const [dragActive, setDragActive] = useState<number | null>(null)
  
  // --- PRE-CARGA DE ESTRUCTURA ---
  useEffect(() => {
    if (!loading && data && services.length > 0) {
      const safeData = {
        ...data,
        hero: data.hero || { titulo_principal: "", titulo_resaltado: "", subtitulo: "" },
        garantia: data.garantia || { titulo: "Garantía STARK", desc: "", btn: "VER PÓLIZA" },
        estadisticas: data.estadisticas || { proyectos: "500+", años: "15+", uptime: "99.9%", soporte: "24/7" },
        contacto: data.contacto || { email: "", tel: "", direccion: "" },
        redes: data.redes || { facebook: "", instagram: "", tiktok: "" },
        finanzas: data.finanzas || { iva: "15", descuento: "0" },
        marcasString: data.marcas && Array.isArray(data.marcas) ? data.marcas.join(", ") : ""
      }
      setConfigForm(safeData)

      const mapped = services.map(s => ({
        ...s,
        d: s.d || s.descripcion || "",
        tags: s.tags || "",
        img: s.img || "",
        imgPreview: null,
        file: null,
      }))
      setServicesForm(mapped)
    }
  }, [data, services, loading])

  // --- MANEJADORES ---
  const handleConfigChange = (section: string, field: string, value: string) => {
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

  // --- MANEJO DE IMÁGENES ---
  const handleImageChange = (index: number, file: File) => {
    const updated = [...servicesForm]
    updated[index].file = file;
    updated[index].imgPreview = URL.createObjectURL(file);
    setServicesForm(updated);
  }

  const handleImageDelete = (index: number) => {
    const updated = [...servicesForm];
    updated[index].file = null;
    updated[index].imgPreview = null;
    updated[index].img = ""; // También limpia la URL existente
    setServicesForm(updated);
  };
  
  const handleImageUpload = async (service: any) => {
    if (!service.file) return service.img // Si no hay archivo nuevo, devuelve la URL existente
    const serviceSlug = (service.t || service.titulo).toLowerCase().replace(/\s+/g, '-')
    const filePath = `servicios/${serviceSlug}/${Date.now()}`
    const storageRef = ref(storage, filePath)
    
    await uploadBytes(storageRef, service.file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  }

  // --- DRAG & DROP ---
  const handleDrag = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(index);
    else if (e.type === "dragleave") setDragActive(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageChange(index, e.dataTransfer.files[0]);
    }
  }, []);


  const saveAllChanges = async () => {
    setIsSaving(true);
    setSaveStatus("");
    try {
        const batch = writeBatch(db);

        // 1. Procesar imágenes y preparar datos de servicios
        const updatedServicesData = await Promise.all(servicesForm.map(async (service) => {
            const newImgUrl = await handleImageUpload(service);
            const { imgPreview, file, ...cleanData } = service;
            return { ...cleanData, img: newImgUrl };
        }));

        // 2. Aplicar actualizaciones de servicios en el batch
        updatedServicesData.forEach(s => {
            batch.update(doc(db, "servicios", s.id), s);
        });

        // 3. Preparar y aplicar configuración global
        const finalConfig = { ...configForm };
        if (finalConfig.marcasString) {
            finalConfig.marcas = finalConfig.marcasString.split(",").map((m: string) => m.trim()).filter(Boolean);
            delete finalConfig.marcasString;
        }
        batch.update(doc(db, "configuracion", "web_data"), finalConfig);

        // 4. Confirmar todos los cambios
        await batch.commit();
        setSaveStatus("success");
        
        // Actualizar estado local para reflejar los cambios guardados
        setServicesForm(updatedServicesData.map(s => ({...s, imgPreview: null, file: null})));

    } catch (e: any) {
        console.error("Error al guardar:", e);
        setSaveStatus("error");
    } finally {
        setIsSaving(false);
        setTimeout(() => setSaveStatus(""), 4000);
    }
  }

  // --- LOGIN ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setIsAuthenticated(true)
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

  if (loading || !configForm) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
        
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
            <Image 
              src={logoImg}
              alt="Logo Andicot" 
              priority
              className="w-24 h-auto relative z-10 drop-shadow-[0_0_10px_rgba(0,242,255,0.8)] animate-pulse object-contain"
            />
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-white font-orbitron tracking-widest uppercase mb-4">
          BIENVENIDO A ANDICOT
        </h1>

        <p className="text-cyan-500 font-mono text-sm md:text-base max-w-xl leading-relaxed mx-auto">
          Expertos en Infraestructura, Cableado Estructurado y Soluciones Tecnológicas de Alta Gama.
        </p>

        <div className="mt-12 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-900 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase animate-pulse">
              Sincronizando Sistema...
            </span>
        </div>

      </div>
    )
  }
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 pb-40 font-sans">
      
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
                    : saveStatus === 'error'
                    ? "bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    : "bg-cyan-500 text-black border-cyan-400 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105"
                }`}
            >
                {isSaving ? "GUARDANDO..." : saveStatus === "success" ? "GUARDADO EXITOSO" : saveStatus === "error" ? "ERROR, REINTENTAR" : "GUARDAR CAMBIOS"} 
                <Save className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="space-y-10 max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-8">
            <SectionCard title="Contenido Hero Principal" icon={<Globe />}>
                <InputField label="Título Línea 1 (Blanco)" value={configForm.hero.titulo_principal} onChange={(v) => handleConfigChange("hero", "titulo_principal", v)} />
                <InputField label="Título Línea 2 (Cyan)" value={configForm.hero.titulo_resaltado} onChange={(v) => handleConfigChange("hero", "titulo_resaltado", v)} />
                <div>
                    <Label text="Subtítulo Descriptivo" />
                    <TextArea value={configForm.hero.subtitulo} onChange={(e: any) => handleConfigChange("hero", "subtitulo", e.target.value)} rows={3} />
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

        <div className="grid lg:grid-cols-2 gap-8">
            <SectionCard title="Garantía & Finanzas" icon={<DollarSign />}>
                <div className="p-4 border border-white/5 rounded-lg bg-white/5 mb-6">
                    <h4 className="text-cyan-500 text-xs font-bold uppercase mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Configuración Garantía</h4>
                    <div className="space-y-4">
                        <InputField label="Título Garantía" value={configForm.garantia.titulo} onChange={(v) => handleConfigChange("garantia", "titulo", v)} />
                        <InputField label="Texto Botón" value={configForm.garantia.btn} onChange={(v) => handleConfigChange("garantia", "btn", v)} />
                    </div>
                </div>
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

        <SectionCard title="Gestión de Aliados (Marcas)" icon={<Award />}>
            <div>
                <Label text="Lista de Marcas (Separar por comas)" />
                <TextArea 
                    value={configForm.marcasString || ""} 
                    onChange={(e: any) => handleConfigChange("root", "marcasString", e.target.value)} 
                    rows={4}
                    placeholder="Ej: BOSCH, SAMSUNG, HIKVISION, PELCO, DSC..."
                />
                <p className="text-xs text-cyan-400 mt-2 font-mono flex items-center gap-2">
                    <Database className="w-3 h-3" /> Las marcas se actualizarán automáticamente en el anillo 3D.
                </p>
            </div>
        </SectionCard>

        <div className="pt-10 border-t border-white/10">
            <h3 className="text-white font-black font-orbitron text-2xl mb-8 flex items-center gap-3 uppercase italic">
                <Database className="text-cyan-500 w-8 h-8" /> Catálogo de Servicios
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesForm.map((s, i) => (
                    <div key={s.id} className="tech-glass p-6 border-white/5 hover:border-cyan-500/40 transition-all group relative bg-black/40">
                        <span className="absolute top-2 right-2 text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                            ID: {s.id.slice(0,6)}
                        </span>

                        <div 
                          className={`relative aspect-video mb-5 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-all ${dragActive === i ? 'border-cyan-500 ring-2 ring-cyan-500' : ''}`}
                          onDragEnter={(e) => handleDrag(e, i)}
                          onDragLeave={(e) => handleDrag(e, i)}
                          onDragOver={(e) => handleDrag(e, i)}
                          onDrop={(e) => handleDrop(e, i)}
                        >
                            {(s.img || s.imgPreview) ? (
                                <>
                                    <Image src={s.imgPreview || s.img} alt={s.t || s.titulo} fill className="w-full h-full object-cover" />
                                    <button onClick={() => handleImageDelete(i)} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </>
                            ) : (
                                <label htmlFor={`file-upload-${i}`} className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer text-gray-500 hover:text-cyan-400 transition-colors">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">
                                        SUBIR IMAGEN
                                    </span>
                                    <span className="text-[9px] font-mono mt-1">o arrastrar aquí</span>
                                    <input id={`file-upload-${i}`} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleImageChange(i, e.target.files[0])} />
                                </label>
                            )}
                        </div>

                        <div className="space-y-4">
                            <input 
                                value={s.t || s.titulo} 
                                onChange={(e) => handleServiceChange(i, "t", e.target.value)} 
                                className="w-full bg-transparent border-b border-white/10 pb-2 font-orbitron text-lg font-bold uppercase text-cyan-400 outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-700" 
                                placeholder="TÍTULO DEL SERVICIO" 
                            />
                            
                            <div>
                                <Label text="Descripción Corta" />
                                <TextArea value={s.d} onChange={(e: any) => handleServiceChange(i, "d", e.target.value)} rows={3} />
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
                                    onChange={(e) => handleServiceChange(i, "p", parseFloat(e.target.value) || 0)} 
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

    

    

    