"use client";

import React, { useState } from 'react';
import { Settings, Server, ImageIcon, Users, LogOut, Cpu, Save, Menu, X, BarChart3 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: () => void;
  onLogout: () => void;
  isSaving: boolean;
}

export const Dashboard = ({ children, activeTab, setActiveTab, onSave, onLogout, isSaving }: DashboardProps) => {
  const [open, setOpen] = useState(false);

  const navItems = (
    <div className="flex-1 py-6 px-4 space-y-6">
      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Rendimiento</p>
        <button onClick={() => { setActiveTab('metrics'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'metrics' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
          <BarChart3 size={18} /> Estadísticas
        </button>
      </div>

      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Editor Web (CMS)</p>
        <div className="space-y-1">
          <button onClick={() => { setActiveTab('general'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'general' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
            <Settings size={18} /> General
          </button>
          <button onClick={() => { setActiveTab('ecosystems'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'ecosystems' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
            <Server size={18} /> Ecosistemas
          </button>
          <button onClick={() => { setActiveTab('brands'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'brands' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
            <ImageIcon size={18} /> Marcas
          </button>
        </div>
      </div>

      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ventas (CRM)</p>
        <button onClick={() => { setActiveTab('crm'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'crm' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
          <Users size={18} /> Prospectos
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-headline text-gray-900 bg-slate-50 w-full overflow-x-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-secondary text-white flex-col flex-shrink-0 sticky top-0 h-screen shadow-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#1e2246]">
          <div className="flex items-center gap-2">
            <Cpu className="text-primary" size={24} />
            <span className="font-bold text-xl">Admin<span className="text-primary">Portal</span></span>
          </div>
        </div>
        {navItems}
        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 text-sm transition-colors">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden h-16 bg-secondary text-white flex items-center justify-between px-4 sticky top-0 z-50 border-b border-white/10 shadow-md">
        <div className="flex items-center gap-2">
          <Cpu className="text-primary" size={20} />
          <span className="font-bold text-lg">Admin<span className="text-primary">Portal</span></span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-secondary text-white border-none">
            <SheetHeader className="h-16 flex flex-row items-center px-6 border-b border-white/10 bg-[#1e2246] space-y-0 text-left">
               <SheetTitle className="text-xl font-bold text-primary">Navegación</SheetTitle>
               <SheetDescription className="sr-only">Menú lateral para gestionar contenido y ventas.</SheetDescription>
            </SheetHeader>
            {navItems}
            <div className="p-4 border-t border-white/10 mt-auto">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 text-sm">
                <LogOut size={16} /> Salir
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="h-20 bg-white border-b border-gray-200 hidden md:flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-secondary capitalize">
            {activeTab === 'metrics' && 'Panel de Estadísticas'}
            {activeTab === 'general' && 'Configuración General'}
            {activeTab === 'ecosystems' && 'Gestión de Ecosistemas'}
            {activeTab === 'brands' && 'Aliados Estratégicos'}
            {activeTab === 'crm' && 'CRM de Prospectos'}
          </h2>
          {activeTab !== 'crm' && activeTab !== 'metrics' && (
            <button 
              onClick={onSave} 
              disabled={isSaving} 
              className="flex items-center gap-2 bg-primary text-secondary px-6 py-2.5 rounded-lg hover:bg-[#8eb340] transition-colors disabled:opacity-70 font-bold shadow-md"
            >
              <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar y Publicar'}
            </button>
          )}
        </header>

        {/* Floating Save Button Mobile */}
        {activeTab !== 'crm' && activeTab !== 'metrics' && (
          <div className="md:hidden fixed bottom-6 right-6 z-50">
             <Button 
                onClick={onSave} 
                disabled={isSaving} 
                className="rounded-full h-14 w-14 shadow-2xl bg-primary text-secondary hover:scale-105 active:scale-95 transition-transform"
             >
                {isSaving ? <Cpu className="animate-spin" size={24} /> : <Save size={24} />}
             </Button>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="md:hidden mb-6">
            <h2 className="text-2xl font-bold text-secondary capitalize">
              {activeTab === 'metrics' && 'Estadísticas'}
              {activeTab === 'general' && 'Configuración'}
              {activeTab === 'ecosystems' && 'Ecosistemas'}
              {activeTab === 'brands' && 'Marcas'}
              {activeTab === 'crm' && 'Prospectos'}
            </h2>
          </div>
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
