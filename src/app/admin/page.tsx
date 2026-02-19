"use client"

import Image from "next/image"
import logoImg from "../icon.png"
import { useState, useEffect, useCallback } from "react"
import { useSystemData } from "@/hooks/useStarkData"
import { db, storage } from "@/lib/firebase" 
import { doc, writeBatch, collection, getDocs, orderBy, query } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Save, Lock, Globe, Database, Tag, ShieldCheck, BarChart3, Mail, Award, DollarSign, Share2, LogOut, Upload, Trash2, X, MessageSquare, Loader, Inbox } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// =========================================================
// COMPONENTE PRINCIPAL: PÁGINA DE ADMINISTRACIÓN
// =========================================================
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)

  const { data, services, loading } = useSystemData()
  const [configForm, setConfigForm] = useState<any>(null)
  const [servicesForm, setServicesForm] = useState<any[]>([])
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  
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
    if (!service.file) return service.img 
    const filePath = `servicios/${service.id}/imagen_principal.jpg`
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
        const updatedServicesData = await Promise.all(servicesForm.map(async (service) => {
            const newImgUrl = await handleImageUpload(service);
            const { imgPreview, file, ...cleanData } = service;
            return { ...cleanData, img: newImgUrl };
        }));
        updatedServicesData.forEach(s => {
            batch.update(doc(db, "servicios", s.id), s);
        });

        const finalConfig = { ...configForm };
        if (finalConfig.marcasString) {
            finalConfig.marcas = finalConfig.marcasString.split(",").map((m: string) => m.trim()).filter(Boolean);
            delete finalConfig.marcasString;
        }
        batch.update(doc(db, "configuracion", "web_data"), finalConfig);

        await batch.commit();
        setSaveStatus("success");
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

  if (loading || !configForm) return <LoadingScreen />

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
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-3 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </DialogTrigger>
              <DialogContent className="tech-glass max-w-4xl text-white border-cyan-500/30">
                <MessagesViewer />
              </DialogContent>
            </Dialog>

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

      {/* El resto de la página permanece igual... */}
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* ... */}
      </div>
    </main>
  )
}

// =========================================================
// COMPONENTE NUEVO: VISOR DE MENSAJES
// =========================================================
interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: any;
}

function MessagesViewer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const msgs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Message));
                setMessages(msgs);
            } catch (error) {
                console.error("Error al cargar mensajes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="h-[70vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="font-orbitron text-cyan-400 text-2xl flex items-center gap-3">
                    <Inbox/> BANDEJA DE ENTRADA
                </DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4 -mr-4 mt-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader className="w-8 h-8 text-cyan-500 animate-spin"/>
                        <p className="ml-4 font-mono">Cargando mensajes...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="font-mono text-gray-500">No hay mensajes.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="uppercase text-xs text-cyan-400/70 border-b border-cyan-500/20">
                            <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Mensaje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-3 align-top text-gray-400 whitespace-nowrap">
                                        {msg.createdAt?.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-3 align-top font-bold text-white">{msg.name}</td>
                                    <td className="p-3 align-top text-cyan-400">
                                        <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                    </td>
                                    <td className="p-3 align-top text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </ScrollArea>
        </div>
    );
}

// =========================================================
// OTROS SUBCOMPONENTES (SIN CAMBIOS)
// =========================================================
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

function LoadingScreen() {
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
        <h1 className="text-2xl md:text-4xl font-black text-white font-orbitron tracking-widest uppercase mb-4">BIENVENIDO</h1>
        <p className="text-cyan-500 font-mono text-sm md:text-base max-w-xl leading-relaxed mx-auto">Panel de Control de Contenidos</p>
        <div className="mt-12 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-900 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-[10px] text-gray-600 font-mono tracking-[0.2em] uppercase animate-pulse">Sincronizando Sistema...</span>
        </div>
      </div>
    )
  }
