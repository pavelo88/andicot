"use client"

import { useState, useEffect } from "react"
import { useSystemData } from "@/hooks/useStarkData"
import { db, storage } from "@/lib/firebase"
import { doc, writeBatch } from "firebase/firestore" 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Save, Lock, Globe, Database, Upload, Tag, ShieldCheck, BarChart3, Award, DollarSign, Share2, LogOut, Trash2, Plus } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)

  const { data, services, loading } = useSystemData()
  const [configForm, setConfigForm] = useState<any>(null)
  const [servicesForm, setServicesForm] = useState<any[]>([])
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | "">("")

  useEffect(() => {
    if (!loading && data && services.length > 0) {
      const safeData: any = {
        ...data,
        hero: data.hero || { titulo_principal: "", titulo_resaltado: "", subtitulo: "" },
        garantia: data.garantia || { titulo: "Garantía STARK", desc: "", btn: "VER PÓLIZA" },
        estadisticas: data.estadisticas || { proyectos: "500+", años: "15+", uptime: "99.9%", soporte: "24/7" },
        contacto: data.contacto || { email: "", tel: "", direccion: "" },
        redes: data.redes || { facebook: "", instagram: "", tiktok: "" },
        finanzas: data.finanzas || { iva: "15", descuento: "0" },
      }
      
      // Manejo retrocompatible de marcas (string[] vs object[])
      const initialMarcas = (data.marcas || []).map((m: any) => 
        typeof m === 'string' 
        ? { name: m, logo: '', newFile: null, previewUrl: null }
        : { ...m, newFile: null, previewUrl: null }
      )
      safeData.marcas = initialMarcas

      setConfigForm(safeData)

      const mappedServices = services.map(s => ({
        ...s,
        t: s.t || s.titulo || "",
        d: s.d || s.descripcion || "",
        p: s.p || s.precio_base || 0,
        tags: s.tags || "",
        img: s.img || "",
        newFile: null,
        previewUrl: null
      }))
      setServicesForm(mappedServices)
    }
  }, [data, services, loading])

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
  
  const handleImageFile = (index: number, file: File) => {
    const updated = [...servicesForm]
    updated[index].newFile = file
    updated[index].previewUrl = URL.createObjectURL(file)
    setServicesForm(updated)
  }

  const handleDeleteImage = (index: number) => {
    const updated = [...servicesForm];
    updated[index].img = "";
    updated[index].previewUrl = null;
    updated[index].newFile = null;
    setServicesForm(updated);
  };
  
  // --- Nuevos Handlers para Marcas ---
  const handleBrandChange = (index: number, value: string) => {
    const updatedMarcas = [...configForm.marcas];
    updatedMarcas[index].name = value;
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };
  
  const handleAddBrand = () => {
    const newBrand = { name: "NUEVA MARCA", logo: "", newFile: null, previewUrl: null };
    setConfigForm({ ...configForm, marcas: [...configForm.marcas, newBrand] });
  };

  const handleRemoveBrand = (index: number) => {
    const updatedMarcas = configForm.marcas.filter((_: any, i: number) => i !== index);
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };
  
  const handleBrandImageFile = (index: number, file: File) => {
    const updatedMarcas = [...configForm.marcas];
    updatedMarcas[index].newFile = file;
    updatedMarcas[index].previewUrl = URL.createObjectURL(file);
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };
  
  const handleDeleteBrandImage = (index: number) => {
    const updatedMarcas = [...configForm.marcas];
    updatedMarcas[index].logo = "";
    updatedMarcas[index].previewUrl = null;
    updatedMarcas[index].newFile = null;
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };
  // ------------------------------------

  const saveAllChanges = async () => {
    setIsSaving(true)
    setSaveStatus("")
    try {
      const batch = writeBatch(db)

      // 1. Handle services update
      const finalServices = await Promise.all(servicesForm.map(async (service) => {
          let imageUrl = service.img;
          if (service.newFile) {
              const storageRef = ref(storage, `servicios/${service.id}/${Date.now()}_${service.newFile.name}`);
              await uploadBytes(storageRef, service.newFile);
              imageUrl = await getDownloadURL(storageRef);
          }
          return {
              id: service.id,
              titulo: service.t || service.titulo,
              descripcion: service.d || service.descripcion,
              precio_base: Number(service.p || service.precio_base || 0),
              tags: service.tags || "",
              img: imageUrl,
          };
      }));

      finalServices.forEach(s => {
          const { id, ...dataToSave } = s;
          batch.update(doc(db, "servicios", id), dataToSave);
      });

      // 2. Handle general config update
      const finalConfig: any = { ...configForm };
      
      // 2.1 Procesar logos de marcas
      const finalMarcas = await Promise.all(configForm.marcas.map(async (marca: any) => {
          let logoUrl = marca.logo;
          if (marca.newFile) {
              const storageRef = ref(storage, `marcas/${Date.now()}_${marca.newFile.name}`);
              await uploadBytes(storageRef, marca.newFile);
              logoUrl = await getDownloadURL(storageRef);
          }
          return {
              name: marca.name,
              logo: logoUrl || '',
          };
      }));
      finalConfig.marcas = finalMarcas;

      // Limpiar campos temporales del formulario
      delete finalConfig.marcasString;
      
      batch.update(doc(db, "configuracion", "web_data"), finalConfig)

      // 3. Commit all changes
      await batch.commit()
      setSaveStatus("success")
      setTimeout(() => setSaveStatus(""), 3000)

    } catch (e) {
      console.error("Error al guardar cambios:", e)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus(""), 4000)
    } finally { 
      setIsSaving(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="tech-glass p-10 max-w-md w-full border-accent/30 bg-background/90 shadow-2xl">
        <Lock className="w-12 h-12 text-accent mx-auto mb-6" />
        <h1 className="text-2xl md:text-6xl font-headline text-center mb-8 uppercase tracking-tighter text-foreground">PANEL DE CONTROL</h1>
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-background border border-accent/50 p-4 text-accent outline-none mb-6 text-center font-code text-lg rounded" 
            placeholder="CLAVE DE ACCESO..." 
        />
        <button type="submit" className="w-full bg-accent text-accent-foreground font-bold py-4 uppercase text-sm tracking-[0.2em] hover:brightness-110 transition-all rounded shadow-[0_0_20px_theme(colors.accent/0.4)]">
            INICIAR SESIÓN
        </button>
        {authError && <p className="text-destructive text-center mt-6 text-xs font-code animate-pulse">ACCESO DENEGADO</p>}
      </form>
    </div>
  )

  if (loading || !configForm) return <div className="h-screen bg-background flex items-center justify-center text-accent font-code text-lg animate-pulse">SINCRONIZANDO SISTEMA...</div>

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 pb-40 font-sans">
      
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 sticky top-4 bg-background/80 backdrop-blur-xl z-50 py-4 px-6 border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-2 rounded-lg border border-accent/20">
                <Database className="w-6 h-6 text-accent" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-black font-headline text-foreground">
                    SYSTEM <span className="text-accent">ADMIN</span>
                </h1>
                <p className="text-[10px] font-code text-muted-foreground uppercase tracking-[0.2em]">Panel de Control Global</p>
            </div>
        </div>
        
        <div className="flex gap-4">
            <button onClick={() => setIsAuthenticated(false)} className="p-3 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all">
                <LogOut className="w-5 h-5" />
            </button>
            <button 
                onClick={saveAllChanges} 
                disabled={isSaving} 
                className={`px-8 py-3 font-bold uppercase text-sm flex items-center gap-3 transition-all rounded-lg border ${
                    isSaving ? "bg-amber-500 border-amber-400 text-white animate-pulse" :
                    saveStatus === "success" 
                    ? "bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                    : saveStatus === "error"
                    ? "bg-red-600 border-red-500 text-white"
                    : "bg-accent text-accent-foreground border-accent hover:shadow-[0_0_20px_theme(colors.accent/0.4)] hover:scale-105"
                }`}
            >
                {isSaving ? "GUARDANDO..." : saveStatus === "success" ? "GUARDADO" : saveStatus === "error" ? "ERROR" : "GUARDAR CAMBIOS"} 
                <Save className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="space-y-10 max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-8">
            <SectionCard title="Contenido Hero Principal" icon={<Globe />}>
                <InputField label="Título Línea 1 (Blanco)" value={configForm.hero.titulo_principal} onChange={(v) => handleConfigChange("hero", "titulo_principal", v)} />
                <InputField label="Título Línea 2 (Acento)" value={configForm.hero.titulo_resaltado} onChange={(v) => handleConfigChange("hero", "titulo_resaltado", v)} />
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
                <div className="p-4 border border-border rounded-lg bg-foreground/5 mb-6">
                    <h4 className="text-accent text-xs font-bold uppercase mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Configuración Garantía</h4>
                    <div className="space-y-4">
                        <InputField label="Título Garantía" value={configForm.garantia.titulo} onChange={(v) => handleConfigChange("garantia", "titulo", v)} />
                        <InputField label="Texto Botón" value={configForm.garantia.btn} onChange={(v) => handleConfigChange("garantia", "btn", v)} />
                    </div>
                </div>
                <div className="p-4 border border-border rounded-lg bg-emerald-500/5">
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
                    
                    <div className="border-t border-border pt-5 mt-5">
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
            <div className="space-y-4">
              {configForm.marcas.map((marca: any, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-background/30 p-3 rounded-lg border border-border">
                  <div className="relative w-16 h-10 bg-background/50 rounded flex items-center justify-center overflow-hidden border border-border">
                    <img src={marca.previewUrl || marca.logo || `https://placehold.co/100x40/242853/a4c851?text=LOGO`} alt={marca.name} className="w-full h-full object-contain" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="w-5 h-5 text-accent" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBrandImageFile(i, e.target.files[0])} />
                    </label>
                  </div>
                  <input 
                    value={marca.name}
                    onChange={(e) => handleBrandChange(i, e.target.value)}
                    className="flex-1 bg-transparent border-b border-border pb-1 font-bold text-foreground outline-none focus:border-accent transition-colors"
                  />
                  {(marca.logo || marca.previewUrl) && (
                    <button onClick={() => handleDeleteBrandImage(i)} className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Eliminar Logo">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleRemoveBrand(i)} className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Eliminar Marca">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleAddBrand} className="mt-4 w-full flex items-center justify-center gap-2 bg-foreground/5 border border-accent/30 text-accent p-3 rounded-lg text-xs font-bold uppercase hover:bg-accent/10 transition-all">
                <Plus className="w-4 h-4" /> Añadir Marca
            </button>
        </SectionCard>


        <div className="pt-10 border-t border-border">
            <h3 className="text-foreground font-black font-headline text-2xl mb-8 flex items-center gap-3 uppercase">
                <Database className="text-accent w-8 h-8" /> Catálogo de Servicios
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesForm.map((s, i) => (
                    <div key={s.id} className="tech-glass p-6 border-border hover:border-accent/40 transition-all group relative bg-background/40">
                        <span className="absolute top-2 right-2 text-[10px] font-code text-muted-foreground bg-background/50 px-2 py-1 rounded border border-border">
                            ID: {s.id.slice(0,6)}
                        </span>

                        <div className="relative aspect-video mb-5 bg-zinc-900 rounded-lg overflow-hidden border border-border group-hover:border-accent/30 transition-colors">
                            <img src={s.previewUrl || s.img || `https://placehold.co/600x400/242853/a4c851?text=SIN+IMAGEN`} alt={s.t || s.titulo} className="w-full h-full object-cover" />
                            
                            {(s.img || s.previewUrl) && (
                                <button 
                                    onClick={() => handleDeleteImage(i)}
                                    className="absolute top-2 right-2 bg-destructive/80 text-destructive-foreground p-1.5 rounded-full hover:bg-destructive transition-all z-10"
                                    title="Eliminar Imagen"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 bg-background/70 transition-all duration-300">
                                <Upload className="w-8 h-8 text-accent mb-2" />
                                <span className="text-[10px] uppercase font-bold text-foreground tracking-widest">Cambiar Imagen</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageFile(i, e.target.files[0])} />
                            </label>
                        </div>

                        <div className="space-y-4">
                            <input 
                                value={s.t || s.titulo} 
                                onChange={(e) => handleServiceChange(i, "t", e.target.value)} 
                                className="w-full bg-transparent border-b border-border pb-2 font-headline text-lg font-bold uppercase text-accent outline-none focus:border-accent transition-colors placeholder:text-muted-foreground" 
                                placeholder="TÍTULO DEL SERVICIO" 
                            />
                            
                            <div>
                                <Label text="Descripción Corta" />
                                <TextArea value={s.d} onChange={(e: any) => handleServiceChange(i, "d", e.target.value)} rows={3} />
                            </div>
                            
                            <div>
                                <Label text="Tags de Búsqueda" />
                                <div className="flex items-center gap-2 bg-background/40 border border-border rounded p-2 focus-within:border-accent/50 transition-colors">
                                    <Tag className="w-4 h-4 text-accent/50" />
                                    <input value={s.tags} onChange={(e) => handleServiceChange(i, "tags", e.target.value)} className="w-full bg-transparent text-xs text-accent font-code outline-none" placeholder="camara, sensor, alarma..." />
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-emerald-900/10 p-3 rounded border border-emerald-500/20">
                                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Precio Base ($)</span>
                                <input 
                                    type="number" 
                                    value={s.p || s.precio_base} 
                                    onChange={(e) => handleServiceChange(i, "p", e.target.value)} 
                                    className="bg-transparent text-right font-code text-foreground font-bold outline-none w-24 text-lg" 
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
        <section className="tech-glass p-8 border-border bg-background/20 hover:bg-background/40 transition-colors">
            <h3 className="text-accent font-bold font-code text-sm mb-6 flex items-center gap-3 uppercase tracking-[0.15em] border-b border-accent/10 pb-4">
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
                className="w-full bg-background/40 border border-border p-3 text-sm text-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all font-medium" 
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
            className="w-full bg-background/40 border border-border p-3 text-sm text-muted-foreground rounded outline-none focus:border-accent/60 focus:bg-background/60 transition-all resize-none leading-relaxed" 
        />
    )
}

function Label({ text }: { text: string }) {
    return (
        <label className="text-[10px] text-muted-foreground font-bold uppercase mb-2 block tracking-widest">{text}</label>
    )
}

    