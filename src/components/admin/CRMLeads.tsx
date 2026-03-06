"use client";

import React, { useState, useEffect } from 'react';
import { Users, Loader2, Sparkles, FileText, Copy, Trash2, Send } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { analyzeLead } from '@/ai/flows/analyze-lead-flow';
import { generateProposal } from '@/ai/flows/generate-proposal-flow';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pendiente' | 'contactado' | 'visita_agendada' | 'finalizado' | 'descartado';
  createdAt: Timestamp;
}

export const CRMLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [proposingId, setProposingId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [proposals, setProposals] = useState<Record<string, string>>({});

  useEffect(() => {
    const q = query(collection(db, 'contact_messages'), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      setLeads(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzingId(lead.id);
    try {
      const res = await analyzeLead({ message: lead.message });
      setAnalyses(prev => ({ ...prev, [lead.id]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handlePropose = async (lead: Lead) => {
    setProposingId(lead.id);
    try {
      const { proposal } = await generateProposal({ leadMessage: lead.message });
      setProposals(prev => ({ ...prev, [lead.id]: proposal }));
    } catch (err) {
      console.error(err);
    } finally {
      setProposingId(null);
    }
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    await updateDoc(doc(db, 'contact_messages', id), { status });
  };

  const deleteLead = async (id: string) => {
    if (confirm('¿Eliminar prospecto? Esta acción no se puede deshacer.')) {
      await deleteDoc(doc(db, 'contact_messages', id));
    }
  };
  
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    // FIX: Changed to toLocaleString which accepts timeStyle.
    return new Date(timestamp.seconds * 1000).toLocaleString('es-EC', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="max-w-full mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {leads.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border">
          <Users size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-gray-400">Sin prospectos registrados.</p>
        </div>
      ) : (
        // IMPROVEMENT: Added overflow-x-auto for responsiveness on small screens.
        <div className="bg-white rounded-2xl border overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-secondary text-white uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 w-1/2">Requerimiento & IA</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs align-top">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="font-bold text-secondary text-base">{lead.name}</p>
                    {/* IMPROVEMENT: Added mailto link */}
                    <a href={`mailto:${lead.email}`} className="text-blue-600 text-xs hover:underline">{lead.email}</a>
                    {/* IMPROVEMENT: Added WhatsApp link */}
                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs block hover:underline">{lead.phone}</a>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 mb-4">{lead.message}</div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button onClick={() => handleAnalyze(lead)} disabled={!!analyzingId} className="flex items-center gap-2 bg-[#0369a1] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-opacity-90 disabled:opacity-50">
                        {analyzingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Analizar
                      </button>
                      <button onClick={() => handlePropose(lead)} disabled={!!proposingId} className="flex items-center gap-2 bg-primary text-secondary px-3 py-1.5 rounded-md text-xs font-bold hover:bg-opacity-90 disabled:opacity-50">
                        {proposingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} Propuesta
                      </button>
                    </div>

                    {analyses[lead.id] && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4 text-xs">
                        <p className="font-bold text-blue-800 mb-1">Categoría: <span className="font-normal">{analyses[lead.id].suggestedCategory}</span></p>
                        <p className="text-blue-700 italic mb-2">{analyses[lead.id].intentEvaluation}</p>
                        <div className="bg-white p-3 rounded border border-blue-200 relative">
                          <p className="font-bold mb-1">Borrador de Respuesta:</p>
                          {analyses[lead.id].draftResponse}
                           {/* IMPROVEMENT: Added Send mail button */}
                           <a href={`mailto:${lead.email}?subject=Re: Contacto desde Andicot&body=${encodeURIComponent(analyses[lead.id].draftResponse)}`} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Send size={12}/></a>
                        </div>
                      </div>
                    )}

                    {proposals[lead.id] && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-xs relative">
                        <button className="absolute top-2 right-2 p-1.5 text-yellow-800 hover:text-black" onClick={() => { navigator.clipboard.writeText(proposals[lead.id]); alert('Copiado'); }}><Copy size={14} /></button>
                        <p className="font-bold text-yellow-800 mb-2">Propuesta Comercial IA:</p>
                        <div className="whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-2">{proposals[lead.id]}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    <select 
                      value={lead.status || 'pendiente'}
                      onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                      className="border rounded-full px-3 py-1 text-xs font-bold bg-white outline-none mb-4 w-full max-w-[150px]"
                    >
                      <option value="pendiente">🔴 Pendiente</option>
                      <option value="contactado">🔵 Contactado</option>
                      <option value="visita_agendada">📅 Visita</option>
                      <option value="finalizado">✅ Finalizado</option>
                      <option value="descartado">✖️ Descartado</option>
                    </select>
                    <button onClick={() => deleteLead(lead.id)} className="block mx-auto text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
