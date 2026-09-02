'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Wrench, 
  Layers, 
  UserSquare2, 
  Navigation,
  Zap,
  Menu 
} from 'lucide-react';
import { UserRole } from '@/types/maintenance';
import { sounds } from '@/lib/soundEffects';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onOpenMoreMenu: () => void;
  onOpenGPSModal?: () => void;
  onOpenCommandHub?: () => void;
  pendingOfflineCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onOpenMoreMenu,
  onOpenGPSModal,
  onOpenCommandHub,
  pendingOfflineCount = 0,
}) => {
  const handleTabClick = (tab: string) => {
    sounds.playClick();
    onSelectTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl pb-safe">
      
      {/* 1. Dashboard */}
      {(userRole === 'ADMIN' || userRole === 'GESTOR') && (
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Painel</span>
        </button>
      )}

      {/* 2. Campo (Técnico) */}
      <button
        onClick={() => handleTabClick('campo')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
          activeTab === 'campo' ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span>Campo</span>
        {pendingOfflineCount > 0 && (
          <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
        )}
      </button>

      {/* 3. Kanban */}
      <button
        onClick={() => handleTabClick('kanban')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono transition-colors ${
          activeTab === 'kanban' ? 'text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <KanbanSquare className="w-4 h-4" />
        <span>Ordens</span>
      </button>

      {/* 4. GPS Check-in */}
      {onOpenGPSModal && (
        <button
          onClick={() => { sounds.playClick(); onOpenGPSModal(); }}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
        >
          <Navigation className="w-4 h-4 animate-pulse" />
          <span>GPS</span>
        </button>
      )}

      {/* 5. Comandos & QR */}
      {onOpenCommandHub && (
        <button
          onClick={() => { sounds.playClick(); onOpenCommandHub(); }}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono text-emerald-400 hover:text-emerald-300"
        >
          <Zap className="w-4 h-4" />
          <span>Ações</span>
        </button>
      )}

      {/* 6. Mais Menu */}
      <button
        onClick={() => { sounds.playClick(); onOpenMoreMenu(); }}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
      >
        <Menu className="w-4 h-4" />
        <span>Menu</span>
      </button>

    </nav>
  );
};

