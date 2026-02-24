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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="tech-glass p-10 max-w-md w-full border-accent/30 bg-background/90 shadow-2xl">
          <Lock className="w-12 h-12 text-accent mx-auto mb-6" />
          <h1 className="text-3xl font-headline text-center mb-8 uppercase text-foreground">Proyecciones CRM</h1>
          <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-background border border-accent/50 p-4 text-accent outline-none mb-6 text-center font-code text-lg rounded" 
              placeholder="CLAVE DE ACCESO..." 
          />
          <button type="submit" className="w-full bg-accent text-accent-foreground font-bold py-4 uppercase text-sm tracking-[0.2em] hover:brightness-110 transition-all rounded shadow-[0_0_20px_theme(colors.accent/0.4)]">
              ACCEDER
          </button>
          {authError && <p className="text-destructive text-center mt-6 text-xs font-code animate-pulse">CLAVE INCORRECTA</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen text-foreground font-code">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black font-headline text-accent">PROYECCIONES / CRM</h1>
        <button onClick={() => setIsAuthenticated(false)} className="p-3 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Cerrar Sesión</span>
        </button>
      </header>

      <div className="mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-accent"/>
        <select 
          onChange={(e) => setStatusFilter(e.target.value)} 
          value={statusFilter}
          className="bg-background border border-accent/30 p-2 rounded text-accent outline-none"
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="contactado">Contactado</option>
          <option value="visita_agendada">Visita Agendada</option>
          <option value="finalizado">Finalizado</option>
          <option value="descartado">Descartado</option>
        </select>
      </div>
      
      <div className="overflow-x-auto border border-accent/30 rounded-lg tech-glass bg-background/50">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-secondary/50 border-b border-accent/30">
            <tr className="text-accent uppercase tracking-widest">
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
                <tr><td colSpan={7} className="text-center p-8 text-accent animate-pulse">Cargando proyecciones...</td></tr>
            ) : filteredMessages.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">No hay registros que coincidan con el filtro.</td></tr>
            ) : (
                filteredMessages.map((msg) => (
                <tr key={msg.id} className="border-b border-border hover:bg-accent/10 transition-colors">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="p-4 font-bold text-foreground">{msg.name}</td>
                    <td className="p-4 text-accent font-medium">{msg.email}</td>
                    <td className="p-4 text-green-400 font-medium">{msg.phone}</td>
                    <td className="p-4 text-muted-foreground min-w-[300px]">{msg.message}</td>
                    <td className="p-4">
                    <select 
                        className="bg-background border border-muted rounded p-2 text-foreground outline-none focus:border-accent transition-colors"
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
                        className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
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
