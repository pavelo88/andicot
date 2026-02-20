"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore"
import { Lock, LogOut, Trash2, Filter } from "lucide-react"

// Tipado para los mensajes
interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pendiente' | 'contactado' | 'visita_agendada' | 'finalizado' | 'descartado';
  createdAt: Timestamp;
}

export default function ProyeccionesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState(false)

  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [statusFilter, setStatusFilter] = useState('todos')
  const [loading, setLoading] = useState(true)

  // --- EFECTOS ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setAllMessages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (statusFilter === 'todos') {
      setFilteredMessages(allMessages);
    } else {
      setFilteredMessages(allMessages.filter(msg => msg.status === statusFilter));
    }
  }, [statusFilter, allMessages]);


  // --- MANEJADORES ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // La única validación es contra la variable de entorno
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const docRef = doc(db, "contact_messages", id);
    await updateDoc(docRef, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.")) {
        try {
            await deleteDoc(doc(db, "contact_messages", id));
        } catch (error) {
            console.error("Error al eliminar el documento:", error);
            alert("Hubo un error al eliminar el registro.");
        }
    }
  };
  
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    return new Date(timestamp.seconds * 1000).toLocaleString('es-EC', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
  }

  // --- RENDERIZADO ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="tech-glass p-10 max-w-md w-full border border-cyan-500/30 bg-black/90 shadow-2xl">
          <Lock className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
          <h1 className="text-3xl font-orbitron text-center mb-8 uppercase text-white">Proyecciones CRM</h1>
          <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black border border-cyan-500/50 p-4 text-cyan-400 outline-none mb-6 text-center font-mono text-lg rounded" 
              placeholder="CLAVE DE ACCESO..." 
          />
          <button type="submit" className="w-full bg-cyan-500 text-black font-bold py-4 uppercase text-sm tracking-[0.2em] hover:bg-cyan-400 transition-all rounded shadow-[0_0_20px_rgba(0,242,255,0.4)]">
              ACCEDER
          </button>
          {authError && <p className="text-red-500 text-center mt-6 text-xs font-mono animate-pulse">CLAVE INCORRECTA</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white font-mono">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black font-orbitron text-cyan-500">PROYECCIONES / CRM</h1>
        <button onClick={() => setIsAuthenticated(false)} className="p-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-cyan-400"/>
        <select 
          onChange={(e) => setStatusFilter(e.target.value)} 
          value={statusFilter}
          className="bg-black border border-cyan-500/30 p-2 rounded text-cyan-300 outline-none"
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="contactado">Contactado</option>
          <option value="visita_agendada">Visita Agendada</option>
          <option value="finalizado">Finalizado</option>
          <option value="descartado">Descartado</option>
        </select>
      </div>
      
      <div className="overflow-x-auto border border-cyan-500/30 rounded-lg tech-glass bg-black/50">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-cyan-950/50 border-b border-cyan-500/30">
            <tr className="text-cyan-400 uppercase tracking-widest">
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Email</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4 min-w-[300px]">Petición</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={7} className="text-center p-8 text-cyan-500 animate-pulse">Cargando proyecciones...</td></tr>
            ) : filteredMessages.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-gray-500">No hay registros que coincidan con el filtro.</td></tr>
            ) : (
                filteredMessages.map((msg) => (
                <tr key={msg.id} className="border-b border-white/10 hover:bg-cyan-500/10 transition-colors">
                    <td className="p-4 text-gray-400 whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="p-4 font-bold text-white">{msg.name}</td>
                    <td className="p-4 text-cyan-300 font-medium">{msg.email}</td>
                    <td className="p-4 text-green-400 font-medium">{msg.phone}</td>
                    <td className="p-4 text-gray-300 min-w-[300px]">{msg.message}</td>
                    <td className="p-4">
                    <select 
                        className="bg-black border border-gray-600 rounded p-2 text-white outline-none focus:border-cyan-500 transition-colors"
                        value={msg.status || "pendiente"}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="contactado">Contactado</option>
                        <option value="visita_agendada">Visita Agendada</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="descartado">Descartado</option>
                    </select>
                    </td>
                    <td className="p-4 text-center">
                    <button 
                        onClick={() => handleDelete(msg.id)} 
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        title="Eliminar Registro"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
