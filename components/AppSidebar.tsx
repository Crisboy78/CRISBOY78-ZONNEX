'use client';

import React from 'react';
import { UserRole } from '@/types/maintenance';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Wrench, 
  Layers, 
  FileCheck2, 
  QrCode, 
  Boxes, 
  Building2, 
  DollarSign, 
  UserSquare2, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface AppSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onOpenCopilot: () => void;
  activeSensorsAlertsCount: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  onOpenCopilot,
  activeSensorsAlertsCount,
}) => {
  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    section: 'operacoes' | 'engenharia' | 'gestao';
    allowedRoles: UserRole[];
    isHighlight?: boolean;
  }

  const navItems: NavItem[] = [
    // Seção: Operações
    {
      id: 'dashboard',
      label: 'Centro de Controle',
      icon: LayoutDashboard,
      section: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR'],
    },
    {
      id: 'kanban',
      label: 'Quadro de OS & Kanban',
      icon: KanbanSquare,
      badge: '5 Ativas',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-600/50',
      section: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },
    {
      id: 'campo',
      label: 'Execução em Campo 4.0',
      icon: Wrench,
      badge: userRole === 'TECNICO' ? 'Principal' : undefined,
      badgeColor: 'bg-sky-950 text-sky-300 border-sky-600/50',
      section: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
      isHighlight: userRole === 'TECNICO',
    },

    // Seção: Engenharia & IoT
    {
      id: 'digital-twin',
      label: 'Gêmeo Digital & IoT',
      icon: Layers,
      badge: activeSensorsAlertsCount > 0 ? `${activeSensorsAlertsCount} Alerta` : 'Live',
      badgeColor: activeSensorsAlertsCount > 0 
        ? 'bg-blue-900/60 text-sky-200 border-sky-500/50 animate-pulse'
        : 'bg-blue-950 text-blue-300 border-blue-700/50',
      section: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO', 'CLIENTE'],
    },
    {
      id: 'ativos',
      label: 'Ativos & QR Codes',
      icon: QrCode,
      section: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },
    {
      id: 'estoque',
      label: 'Estoque & Peças',
      icon: Boxes,
      badge: 'Crítico: 1',
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-600/40',
      section: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },

    // Seção: Governança & Gestão
    {
      id: 'normativas',
      label: 'Normativas, NRs & PMOC',
      icon: FileCheck2,
      badge: 'Lei 13.589',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-600/50',
      section: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO', 'CLIENTE'],
    },
    {
      id: 'portal',
      label: 'Portal do Síndico',
      icon: UserSquare2,
      badge: userRole === 'CLIENTE' ? 'Principal' : 'Portal',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-600/50',
      section: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR', 'CLIENTE'],
      isHighlight: userRole === 'CLIENTE',
    },
    {
      id: 'condominios',
      label: 'Condomínios & Clientes',
      icon: Building2,
      section: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR'],
    },
    {
      id: 'financeiro',
      label: 'Financeiro & Faturas',
      icon: DollarSign,
      section: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR', 'CLIENTE'],
    },
    {
      id: 'auditoria',
      label: 'Usuários & Auditoria',
      icon: ShieldCheck,
      section: 'gestao',
      allowedRoles: ['ADMIN'],
    },
  ];

  // Sections configuration
  const sections = [
    { id: 'operacoes', title: 'Operações' },
    { id: 'engenharia', title: 'Engenharia & IoT' },
    { id: 'gestao', title: 'Gestão & Normas' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/90 p-3 shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      
      {/* Role Banner */}
      <div className="px-3 py-2 mb-3 rounded-lg bg-slate-900/90 border border-blue-900/30 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono">Modo de Acesso:</span>
          <span className="text-xs font-bold text-blue-200">{userRole}</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
      </div>

      {/* Navigation List Grouped by Sections */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {sections.map(sec => {
          const itemsInSection = navItems.filter(
            item => item.section === sec.id && item.allowedRoles.includes(userRole)
          );

          if (itemsInSection.length === 0) return null;

          return (
            <div key={sec.id} className="space-y-1">
              <div className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {sec.title}
              </div>

              {itemsInSection.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectTab(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-950/80 text-blue-200 border border-blue-500/60 shadow-md shadow-blue-950/30 font-semibold'
                        : item.isHighlight
                        ? 'bg-sky-950/50 hover:bg-sky-950/80 text-sky-200 border border-sky-600/30'
                        : 'hover:bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive 
                          ? 'text-blue-400' 
                          : item.isHighlight 
                          ? 'text-sky-400' 
                          : 'text-slate-400 group-hover:text-blue-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor || 'bg-slate-900 text-slate-300 border-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Copilot Card */}
      <div className="pt-2 border-t border-slate-800/80 mt-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-indigo-950/40 border border-blue-800/40 shadow-lg">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold text-slate-200">Copilot IA Facilities</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
            Diagnóstico preditivo, conformidade PMOC e normas NBR/NR.
          </p>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCopilot();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span>Consultar Copilot</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
