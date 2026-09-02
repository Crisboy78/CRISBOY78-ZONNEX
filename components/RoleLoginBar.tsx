'use client';

import React from 'react';
import { UserRole, UserSession } from '@/types/maintenance';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  UserCheck, 
  Check, 
  LogIn,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MOCK_USERS } from '@/lib/mockDatabase';
import { sounds } from '@/lib/soundEffects';

interface RoleLoginBarProps {
  currentUser: UserSession;
  onSelectRole: (role: UserRole) => void;
  onOpenFullLogin?: () => void;
}

export const RoleLoginBar: React.FC<RoleLoginBarProps> = ({
  currentUser,
  onSelectRole,
  onOpenFullLogin,
}) => {
  const rolesConfig: {
    role: UserRole;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badge: string;
    colorClasses: {
      activeBg: string;
      inactiveBg: string;
      border: string;
      text: string;
      iconColor: string;
      glow: string;
    };
    description: string;
  }[] = [
    {
      role: 'CLIENTE',
      title: 'Cliente / Síndico',
      subtitle: 'Portal & Chamados',
      icon: UserCheck,
      badge: 'Visão Síndico',
      colorClasses: {
        activeBg: 'bg-gradient-to-r from-blue-900/60 to-indigo-950/70 border-blue-400 text-blue-100',
        inactiveBg: 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-blue-600/40 text-slate-300',
        border: 'border-blue-500/40',
        text: 'text-blue-300',
        iconColor: 'text-blue-400',
        glow: 'shadow-blue-500/20',
      },
      description: 'Aprovações de orçamentos, laudos PMOC, chamados e transparência predial.'
    },
    {
      role: 'GESTOR',
      title: 'Gestor Operacional',
      subtitle: 'Facilities & SLA',
      icon: Layers,
      badge: 'Visão Gestão',
      colorClasses: {
        activeBg: 'bg-gradient-to-r from-cyan-900/60 to-blue-950/70 border-cyan-400 text-cyan-100',
        inactiveBg: 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-600/40 text-slate-300',
        border: 'border-cyan-500/40',
        text: 'text-cyan-300',
        iconColor: 'text-cyan-400',
        glow: 'shadow-cyan-500/20',
      },
      description: 'Painel executivo, alocação de técnicos, telemetria predial e contratos.'
    },
    {
      role: 'TECNICO',
      title: 'Técnico de Campo',
      subtitle: 'OS 4.0 & Manutenção',
      icon: Wrench,
      badge: 'Visão Operacional',
      colorClasses: {
        activeBg: 'bg-gradient-to-r from-sky-900/60 to-blue-950/70 border-sky-400 text-sky-100',
        inactiveBg: 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-sky-600/40 text-slate-300',
        border: 'border-sky-500/40',
        text: 'text-sky-300',
        iconColor: 'text-sky-400',
        glow: 'shadow-sky-500/20',
      },
      description: 'Execução de Ordens de Serviço, checklists normativos, fotos e QR Code.'
    },
    {
      role: 'ADMIN',
      title: 'Administrador Master',
      subtitle: 'Engenharia & Auditoria',
      icon: ShieldCheck,
      badge: 'Controle Total',
      colorClasses: {
        activeBg: 'bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-slate-900 border-indigo-400 text-indigo-100',
        inactiveBg: 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-indigo-600/40 text-slate-300',
        border: 'border-indigo-500/40',
        text: 'text-indigo-300',
        iconColor: 'text-indigo-400',
        glow: 'shadow-indigo-500/20',
      },
      description: 'Diretoria de engenharia, governança PMOC/AVCB, auditoria e finanças.'
    },
  ];

  const handleRoleClick = (role: UserRole) => {
    sounds.playClick();
    onSelectRole(role);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-slate-950 border border-blue-900/40 p-3.5 sm:p-4 shadow-xl shadow-blue-950/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-blue-950/80">
        
        {/* Left: Section Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-inner">
            <LogIn className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-300 font-mono">
                Acesso & Login por Perfil
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
                1 Clique
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Alterne instantaneamente a visualização da tela para o perfil desejado:
            </p>
          </div>
        </div>

        {/* Right: Active User Info & Full Login trigger */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] text-slate-400">Logado como:</span>
            <span className="text-[11px] font-bold text-blue-200">
              {currentUser.name.split(' ')[0]} ({currentUser.role})
            </span>
          </div>

          {onOpenFullLogin && (
            <button
              onClick={() => { sounds.playClick(); onOpenFullLogin(); }}
              className="text-[11px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/50 hover:bg-blue-900/50 border border-blue-800/40 transition"
            >
              <span>Outro Usuário</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* 4 Fast Login Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {rolesConfig.map((item) => {
          const isSelected = currentUser.role === item.role;
          const Icon = item.icon;
          const matchedUser = MOCK_USERS.find(u => u.role === item.role);

          return (
            <button
              key={item.role}
              onClick={() => handleRoleClick(item.role)}
              className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 group ${
                isSelected 
                  ? `${item.colorClasses.activeBg} shadow-lg ${item.colorClasses.glow} ring-1 ring-blue-400/40` 
                  : `${item.colorClasses.inactiveBg}`
              }`}
            >
              {/* Active Indicator Pin */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500 text-slate-950 font-mono text-[9px] font-bold shadow">
                  <Check className="w-2.5 h-2.5" />
                  <span>ATIVO</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-950/90 text-blue-300 border border-blue-500/40' : 'bg-slate-950 text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 pr-12">
                  <h4 className="text-xs font-bold truncate text-slate-100 group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {matchedUser?.name.split(' ')[0]} • {item.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 mt-1">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
