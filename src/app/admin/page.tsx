"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Loader2, Sparkles, UploadCloud, Plus, Trash2, Globe, LayoutDashboard, Settings, BarChart3, TrendingUp, Users as UsersIcon, Save } from 'lucide-react';
import { doc, onSnapshot, writeBatch, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Dashboard } from '@/components/admin/Dashboard';
import { CRMLeads } from '@/components/admin/CRMLeads';
import { useSystemData } from "@/hooks/useStarkData"
import { generateSeoMetadata } from '@/ai/flows/generate-seo-metadata-flow';
import { generateServiceDescription } from '@/ai/flows/generate-service-description';

const ImagePreview = ({ src, alt, fallbackIcon: Icon }: { src: string, alt: string, fallbackIcon: any }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl"><Icon size={32}/></div>;
  return <img src={src} alt={alt} onError={() => setError(true)} className="w-full h-full object-cover" />;
};

const BrandPreview = ({ src, name }: { src: string, name: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="h-full flex items-center justify-center p-4 bg-gray-50 w-full rounded border text-xs font-bold text-gray-400 uppercase">{name}</div>;
  // IMPROVEMENT: Added w-full for better scaling
  return <img src={src} alt={name} onError={() => setError(true)} className="max-h-full h-full w-full object-contain" />;
};


export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('metrics');
  
  const { data, services, loading } = useSystemData();
  const [configForm, setConfigForm] = useState<any>(null);
  const [servicesForm, setServicesForm] = useState<any[]>([]);
  const [leadsCount, setLeadsCount] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && data) {
      const safeData: any = {
        ...data,
        hero: data.hero || { titulo_principal: "", titulo_resaltado: "", subtitulo: "" },
        garantia: data.garantia || { titulo: "Garantía STARK", desc: "", btn: "VER PÓLIZA" },
        estadisticas: data.estadisticas || { proyectos: "500+", años: "15+", uptime: "99.9%", soporte: "24/7" },
        contacto: data.contacto || { email: "", tel: "", direccion: "" },
        redes: data.redes || { facebook: "", instagram: "", tiktok: "" },
        finanzas: data.finanzas || { iva: "15", descuento: "0" },
        seo: data.seo || { title: '', description: '', keywords: '' },
      };
      
      const initialMarcas = (data.marcas || []).map((m: any) => 
        typeof m === 'string' 
        ? { name: m, logo: '', newFile: null, previewUrl: null }
        : { ...m, newFile: null, previewUrl: null }
      );
      safeData.marcas = initialMarcas;
      setConfigForm(safeData);
    }
  }, [data, loading]);

  useEffect(() => {
    if (services.length > 0) {
      const mappedServices = services.map(s => ({
        ...s,
        t: s.titulo || "",
        d: s.descripcion || "",
        p: s.precio_base || 0,
        tags: s.tags || "",
        img: s.img || "",
        newFile: null,
        previewUrl: null
      }));
      setServicesForm(mappedServices);
    }
  }, [services]);

  useEffect(() => {
    const unsubLeads = onSnapshot(collection(db, 'contact_messages'), (snapshot) => {
      setLeadsCount(snapshot.size);
    });
    return () => unsubLeads();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Andicot2026";
    if (password === adminPass) setIsLogged(true);
    else alert('Clave incorrecta');
  };

  const handleSave = async () => {
    if (!configForm || !servicesForm) return alert('Datos no cargados.');
    setIsSaving(true);
    try {
      const batch = writeBatch(db);

      // Guardar servicios
      const finalServices = await Promise.all(servicesForm.map(async (service) => {
        let imageUrl = service.img;
        if (service.newFile) {
          const storageRef = ref(storage, `servicios/${service.id}/${Date.now()}_${service.newFile.name}`);
          await uploadBytes(storageRef, service.newFile);
          imageUrl = await getDownloadURL(storageRef);
        }
        return {
          id: service.id,
          titulo: service.t || "",
          descripcion: service.d || "",
          precio_base: Number(service.p || 0),
          tags: service.tags || "",
          img: imageUrl,
        };
      }));

      finalServices.forEach(s => {
        const { id, ...dataToSave } = s;
        if (id) batch.update(doc(db, "servicios", id), dataToSave);
      });

      // Guardar marcas
      const finalMarcas = await Promise.all(configForm.marcas.map(async (marca: any) => {
        let logoUrl = marca.logo;
        if (marca.newFile) {
          const storageRef = ref(storage, `marcas/${Date.now()}_${marca.newFile.name}`);
          await uploadBytes(storageRef, marca.newFile);
            logoUrl = await getDownloadURL(storageRef);
        }
        return { name: marca.name, logo: logoUrl || '' };
      }));

      // FIX: Cloning to remove temporary fields before saving
      const finalConfig = { ...configForm, marcas: finalMarcas };
      delete finalConfig.newFile;
      delete finalConfig.previewUrl;
      finalConfig.marcas.forEach((m:any) => {
          delete m.newFile;
          delete m.previewUrl;
      });
      
      batch.update(doc(db, "configuracion", "web_data"), finalConfig);

      await batch.commit();
      alert('Publicado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleGenSEO = async () => {
    if (!configForm) return;
    setLoadingAI('seo');
    try {
      const res = await generateSeoMetadata({ heroTitle: configForm.hero.titulo_principal, heroSubtitle: configForm.hero.subtitulo });
      setConfigForm({
        ...configForm,
        seo: {
          ...configForm.seo,
          description: res.metaDescription,
          keywords: res.keywords.join(', ')
        }
      });
    } finally {
      setLoadingAI(null);
    }
  };
  
  const handleGenDesc = async (serviceIndex: number) => {
    const service = servicesForm[serviceIndex];
    if (!service) return;
    setLoadingAI(`desc-${service.id}`);
    try {
        const { description } = await generateServiceDescription({ title: service.t });
        const updatedServices = [...servicesForm];
        updatedServices[serviceIndex].d = description;
        setServicesForm(updatedServices);
    } finally {
        setLoadingAI(null);
    }
  };

  const handleConfigChange = (section: string, field: string, value: string) => {
    if (!configForm) return;
    if (section === "root") {
        setConfigForm((prev: any) => ({ ...prev, [field]: value }));
    } else {
        setConfigForm((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    }
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updated = [...servicesForm];
    updated[index] = { ...updated[index], [field]: value };
    setServicesForm(updated);
  };
  
  const handleImageFile = (index: number, file: File) => {
    const updated = [...servicesForm];
    updated[index].newFile = file;
    updated[index].previewUrl = URL.createObjectURL(file);
    setServicesForm(updated);
  };

  const handleRemoveServiceImage = (index: number) => {
    const updatedServices = [...servicesForm];
    updatedServices[index].img = '';
    updatedServices[index].previewUrl = null;
    updatedServices[index].newFile = null;
    setServicesForm(updatedServices);
  };
  
  const handleAddBrand = () => {
    if (!configForm) return;
    const newBrand = { name: "NUEVA MARCA", logo: "", newFile: null, previewUrl: null };
    setConfigForm({ ...configForm, marcas: [...configForm.marcas, newBrand] });
  };

  const handleRemoveBrand = (index: number) => {
    if (!configForm) return;
    const updatedMarcas = configForm.marcas.filter((_: any, i: number) => i !== index);
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };
  
  const handleBrandImageFile = (index: number, file: File) => {
    if (!configForm) return;
    const updatedMarcas = [...configForm.marcas];
    updatedMarcas[index].newFile = file;
    updatedMarcas[index].previewUrl = URL.createObjectURL(file);
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };

  const handleRemoveBrandImage = (index: number) => {
    if (!configForm) return;
    const updatedMarcas = [...configForm.marcas];
    updatedMarcas[index].logo = '';
    updatedMarcas[index].previewUrl = null;
    updatedMarcas[index].newFile = null;
    setConfigForm({ ...configForm, marcas: updatedMarcas });
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md p-10 rounded-3xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-background/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-primary/50">
              <Lock size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-8 text-white font-headline">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-background/50 border border-gray-700 rounded-lg p-4 text-center text-xl focus:border-primary outline-none text-white font-code" 
              placeholder="••••••••" 
            />
            <button type="submit" className="w-full bg-primary text-secondary font-bold py-4 rounded-lg hover:brightness-110 transition-all">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !configForm) {
      return (
          <div className="h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-code text-lg animate-pulse">
              <Loader2 className="w-8 h-8 mr-4 animate-spin"/>
              SINCRONIZANDO CON FIREBASE...
          </div>
      )
  }

  return (
      <Dashboard 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSave={handleSave} 
        onLogout={() => setIsLogged(false)}
        isSaving={isSaving}
      >
        <main className="w-full">
          
          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><UsersIcon size={24} /></div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Usuarios Hoy</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">0</p>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1"><TrendingUp size={12} /> +0% vs ayer</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><LayoutDashboard size={24} /></div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Leads Totales</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">{leadsCount}</p>
                  <p className="text-xs text-orange-600 font-bold mt-2">Prospectos en CRM</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart3 size={20} className="text-primary" /> Rendimiento de la Página</h3><div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed flex items-center justify-center text-gray-400"><p className="text-center p-6">Aquí se visualizarán las gráficas de Google Analytics <br/><span className="text-xs">(Próxima integración con API de Google)</span></p></div></div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">Textos Principales (Hero)</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título Principal</label><input value={configForm.hero.titulo_principal} onChange={e => handleConfigChange("hero", "titulo_principal", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título Resaltado (Color)</label><input value={configForm.hero.titulo_resaltado} onChange={e => handleConfigChange("hero", "titulo_resaltado", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtítulo Hero</label><textarea value={configForm.hero.subtitulo} onChange={e => handleConfigChange("hero", "subtitulo", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" rows={3} /></div>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">Contacto & Redes</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Corporativo</label><input value={configForm.contacto.email} onChange={e => handleConfigChange("contacto", "email", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono / WhatsApp</label><input value={configForm.contacto.tel} onChange={e => handleConfigChange("contacto", "tel", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook URL</label><input value={configForm.redes.facebook} onChange={e => handleConfigChange("redes", "facebook", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                    </div>
                  </div>
              </div>

               <div className="bg-white p-8 rounded-3xl border shadow-sm w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                     <h3 className="font-bold text-lg border-b pb-2 w-full sm:w-auto">Optimización SEO Global</h3>
                     <button onClick={handleGenSEO} disabled={loadingAI === 'seo'} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors">
                        {loadingAI === 'seo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Sugerir con IA
                     </button>
                  </div>
                  <div className="space-y-6">
                    <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Meta Descripción</label><textarea value={configForm.seo?.description || ''} onChange={e => setConfigForm({...configForm, seo: {...configForm.seo, description: e.target.value}})} className="w-full border p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={4} /><p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Límite: 160 caracteres.</p></div>
                    <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Palabras Clave</label><textarea value={configForm.seo?.keywords || ''} onChange={e => setConfigForm({...configForm, seo: {...configForm.seo, keywords: e.target.value}})} className="w-full border p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={3} /></div>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'ecosystems' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servicesForm.map((s, i) => (
                  <div key={s.id} className="bg-white p-6 rounded-3xl border flex flex-col sm:flex-row gap-6 hover:border-primary/50 transition-all">
                    <div className="shrink-0">
                      <div className="relative w-44 h-44 bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 group">
                        <ImagePreview src={s.previewUrl || s.img} alt={s.t} fallbackIcon={Cpu} />
                        {(s.previewUrl || s.img) &&
                            <button onClick={() => handleRemoveServiceImage(i)} className="absolute top-2 right-2 p-1.5 bg-black/40 text-white/80 rounded-full hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100" aria-label="Eliminar imagen">
                                <Trash2 size={14}/>
                            </button>
                        }
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        <label className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"><UploadCloud size={14} /> Subir Foto<input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handleImageFile(i, e.target.files[0])} /></label>
                        <button onClick={() => handleGenDesc(i)} disabled={loadingAI === `desc-${s.id}`} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">{loadingAI === `desc-${s.id}` ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generar Desc</button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre del Servicio</label>
                        <input value={s.t} onChange={e => handleServiceChange(i, "t", e.target.value)} className="w-full font-bold text-xl border-b-2 border-slate-100 py-2 outline-none focus:border-primary bg-transparent" placeholder="Ej: CCTV Avanzado" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción Comercial</label>
                        <textarea value={s.d} onChange={e => handleServiceChange(i, "d", e.target.value)} className="w-full text-sm border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={3} placeholder="Describe el impacto..." />
                      </div>
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tags (separados por comas)</label>
                        <input value={s.tags} onChange={e => handleServiceChange(i, "tags", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none text-xs" placeholder="cámara, ia, seguridad..." />
                      </div>
                       <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Base ($)</label>
                        <input type="number" value={s.p} onChange={e => handleServiceChange(i, "p", e.target.value)} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary">Aliados Estratégicos</h3>
                <button onClick={handleAddBrand} className="bg-secondary text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-opacity-90 shadow-lg"><Plus size={18} /> Nueva Marca</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {configForm.marcas.map((b: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border relative flex flex-col items-center gap-4 shadow-sm group hover:border-primary/50 transition-all">
                    <button onClick={() => handleRemoveBrand(i)} className="absolute top-2 right-2 text-red-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"><Trash2 size={16}/></button>
                    <div className="h-28 flex items-center justify-center p-2 bg-slate-50 w-full rounded-xl border border-slate-100 overflow-hidden relative">
                       <BrandPreview src={b.previewUrl || b.logo} name={b.name} />
                       {(b.previewUrl || b.logo) &&
                          <button onClick={() => handleRemoveBrandImage(i)} className="absolute top-1 right-1 p-1.5 bg-black/40 text-white/80 rounded-full hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100" aria-label="Eliminar logo">
                              <Trash2 size={14}/>
                          </button>
                       }
                    </div>
                    <input value={b.name} onChange={e => { const items = [...configForm.marcas]; items[i].name = e.target.value; setConfigForm({...configForm, marcas: items}); }} className="w-full text-center font-bold text-xs p-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                    <label className="cursor-pointer bg-secondary text-white px-6 py-2 rounded-full text-[10px] font-bold hover:bg-opacity-90 transition-all w-full text-center">Subir Logo<input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handleBrandImageFile(i, e.target.files[0])} /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'crm' && <CRMLeads />}
          
        </main>
      </Dashboard>
  );
}
