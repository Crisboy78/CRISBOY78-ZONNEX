'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Compass,
  Zap,
  Activity
} from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface ModuleNavigationMenuProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  activeSensorsAlertsCount: number;
}

export const ModuleNavigationMenu: React.FC<ModuleNavigationMenuProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  activeSensorsAlertsCount,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  interface ModuleItem {
    id: string;
    label: string;
    shortDesc: string;
    icon: React.ElementType;
    category: 'operacoes' | 'engenharia' | 'conformidade' | 'gestao';
    badge?: string;
    allowedRoles: UserRole[];
  }

  const modules: ModuleItem[] = [
    // Operações & Campo
    {
      id: 'dashboard',
      label: 'Centro de Controle',
      shortDesc: 'Visão executiva e alertas',
      icon: LayoutDashboard,
      category: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR'],
    },
    {
      id: 'kanban',
      label: 'Ordens de Serviço (Kanban)',
      shortDesc: 'Pipeline e distribuição',
      icon: KanbanSquare,
      badge: '5 Abertas',
      category: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },
    {
      id: 'campo',
      label: 'Execução em Campo 4.0',
      shortDesc: 'Checklists, fotos e LOTO',
      icon: Wrench,
      badge: userRole === 'TECNICO' ? 'Modo Técnico' : undefined,
      category: 'operacoes',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },

    // Engenharia & IoT
    {
      id: 'digital-twin',
      label: 'Gêmeo Digital & IoT',
      shortDesc: 'Telemetria predial 3D',
      icon: Layers,
      badge: activeSensorsAlertsCount > 0 ? `${activeSensorsAlertsCount} Alerta` : 'Live',
      category: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO', 'CLIENTE'],
    },
    {
      id: 'ativos',
      label: 'Ativos & QR Codes',
      shortDesc: 'Inventário e tags ópticas',
      icon: QrCode,
      category: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },
    {
      id: 'estoque',
      label: 'Estoque & Peças',
      shortDesc: 'Rolamentos, filtros e peças',
      icon: Boxes,
      badge: '1 Crítico',
      category: 'engenharia',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO'],
    },

    // Conformidade & Normas
    {
      id: 'normativas',
      label: 'Normativas, NRs & PMOC',
      shortDesc: 'Lei 13.589/18, AVCB, NR-10/12',
      icon: FileCheck2,
      badge: 'Lei 13.589',
      category: 'conformidade',
      allowedRoles: ['ADMIN', 'GESTOR', 'TECNICO', 'CLIENTE'],
    },
    {
      id: 'auditoria',
      label: 'Usuários & Auditoria',
      shortDesc: 'Logs e controle de permissões',
      icon: ShieldCheck,
      category: 'conformidade',
      allowedRoles: ['ADMIN'],
    },

    // Gestão & Clientes
    {
      id: 'portal',
      label: 'Portal do Síndico',
      shortDesc: 'Aprovações e chamados',
      icon: UserSquare2,
      badge: userRole === 'CLIENTE' ? 'Principal' : undefined,
      category: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR', 'CLIENTE'],
    },
    {
      id: 'condominios',
      label: 'Condomínios Conectados',
      shortDesc: 'Edifícios e torres',
      icon: Building2,
      category: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR'],
    },
    {
      id: 'financeiro',
      label: 'Financeiro & Faturas',
      shortDesc: 'Contratos e mensalidades',
      icon: DollarSign,
      category: 'gestao',
      allowedRoles: ['ADMIN', 'GESTOR', 'CLIENTE'],
    },
  ];

  const categories = [
    { id: 'all', label: 'Todos os Módulos' },
    { id: 'operacoes', label: 'Operações & Campo' },
    { id: 'engenharia', label: 'Engenharia & IoT' },
    { id: 'conformidade', label: 'Conformidade & NRs' },
    { id: 'gestao', label: 'Gestão & Clientes' },
  ];

  // Filter by user role and selected category
  const visibleModules = modules.filter(m => {
    const roleAllowed = m.allowedRoles.includes(userRole);
    if (!roleAllowed) return false;
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 sm:p-4 shadow-lg">
      
      {/* Category Filter Pills (Avoid Overload) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono mr-1">
            Menu de Módulos:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clean Action Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {visibleModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => {
                sounds.playClick();
                onSelectTab(mod.id);
              }}
              className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-950/70 border-blue-500/80 text-blue-100 shadow-md shadow-blue-900/20 ring-1 ring-blue-400/30'
                  : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-900 text-blue-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {mod.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    isActive 
                      ? 'bg-blue-900 text-blue-200 border-blue-600'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {mod.badge}
                  </span>
                )}
              </div>

              <span className={`text-xs font-bold leading-snug line-clamp-1 ${isActive ? 'text-blue-200' : 'text-slate-200'}`}>
                {mod.label}
              </span>
              <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                {mod.shortDesc}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
