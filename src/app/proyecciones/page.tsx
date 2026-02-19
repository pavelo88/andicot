"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"

export default function ProyeccionesPage() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Escucha en tiempo real los mensajes de Firebase
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(data)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="p-8 bg-black min-h-screen text-white font-mono">
      <h1 className="text-3xl font-black mb-8 font-orbitron text-cyan-500">TABLA DE PROYECCIONES / CRM IA</h1>
      
      <div className="overflow-x-auto border border-cyan-500/30 rounded-lg">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-cyan-950/50 border-b border-cyan-500/30">
            <tr>
              <th className="p-4 uppercase">Cliente</th>
              <th className="p-4 uppercase">Origen</th>
              <th className="p-4 uppercase">Estado / Seguimiento</th>
              <th className="p-4 uppercase">Observación IA</th>
              <th className="p-4 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">{msg.name} <br/><span className="text-gray-500 font-normal">{msg.email}</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded ${msg.phone ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                    {msg.phone ? 'WhatsApp' : 'Formulario'}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="bg-black border border-gray-700 rounded p-1 text-cyan-300"
                    defaultValue={msg.status || "pendiente"}
                    onChange={(e) => updateDoc(doc(db, "contact_messages", msg.id), { status: e.target.value })}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="visita_agencia">Visita en Agencia</option>
                    <option value="visita_domicilio">Visita a Domicilio</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </td>
                <td className="p-4 text-gray-400 italic">
                  {msg.ia_note || "IA analizando..."}
                </td>
                <td className="p-4">
                  <button className="text-cyan-500 hover:underline">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
