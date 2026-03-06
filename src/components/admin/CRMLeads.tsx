"use client";

import React, { useState, useEffect } from 'react';
import { Users, Loader2, Sparkles, FileText, Copy, Trash2 } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/lib/types';
import { analyzeLead } from '@/ai/flows/analyze-lead-flow';
import { generateProposal } from '@/ai/flows/generate-proposal-flow';

export const CRMLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [proposingId, setProposingId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [proposals, setProposals] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      setLeads(fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
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
    await updateDoc(doc(db, 'leads', id), { status });
  };

  const deleteLead = async (id: string) => {
    if (confirm('¿Eliminar prospecto?')) {
      await deleteDoc(doc(db, 'leads', id));
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {leads.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-2xl border">
          <Users size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-gray-400">Sin prospectos registrados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
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
                    {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="font-bold text-secondary text-base">{lead.name}</p>
                    <p className="text-blue-600 text-xs">{lead.email}</p>
                    <p className="text-gray-400 text-xs">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-700 mb-4">{lead.message}</div>
                    
                    <div className="flex gap-2 mb-4">
                      <button 
                        onClick={() => handleAnalyze(lead)} 
                        disabled={!!analyzingId}
                        className="flex items-center gap-2 bg-[#0369a1] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-opacity-90 disabled:opacity-50"
                      >
                        {analyzingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Analizar IA
                      </button>
                      <button 
                        onClick={() => handlePropose(lead)} 
                        disabled={!!proposingId}
                        className="flex items-center gap-2 bg-primary text-secondary px-3 py-1.5 rounded-md text-xs font-bold hover:bg-opacity-90 disabled:opacity-50"
                      >
                        {proposingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} Generar Propuesta
                      </button>
                    </div>

                    {analyses[lead.id] && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4 text-xs">
                        <p className="font-bold text-blue-800 mb-1">Categoría: {analyses[lead.id].suggestedCategory}</p>
                        <p className="text-blue-700 italic mb-2">{analyses[lead.id].intentEvaluation}</p>
                        <div className="bg-white p-3 rounded border border-blue-200">
                          <p className="font-bold mb-1">Borrador:</p>
                          {analyses[lead.id].draftResponse}
                        </div>
                      </div>
                    )}

                    {proposals[lead.id] && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-xs relative">
                        <button 
                          className="absolute top-4 right-4 text-yellow-800 hover:text-black"
                          onClick={() => { navigator.clipboard.writeText(proposals[lead.id]); alert('Copiado'); }}
                        >
                          <Copy size={16} />
                        </button>
                        <p className="font-bold text-yellow-800 mb-2">Propuesta Comercial IA:</p>
                        <div className="whitespace-pre-wrap leading-relaxed">{proposals[lead.id]}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                      className="border rounded-full px-3 py-1 text-xs font-bold bg-white outline-none mb-4"
                    >
                      <option value="Nuevo">🔴 Nuevo</option>
                      <option value="En Proceso">⏳ En Proceso</option>
                      <option value="Venta Realizada">✅ Venta</option>
                      <option value="Cerrada">✖️ Cerrada</option>
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
