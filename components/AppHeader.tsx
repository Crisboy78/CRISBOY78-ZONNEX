'use client';

import React from 'react';
import Image from 'next/image';
import { UserSession, UserRole } from '@/types/maintenance';
import { 
  Building2, 
  Search, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  Wrench, 
  UserCheck, 
  Activity,
  Layers,
  LogOut,
  ChevronDown,
  Navigation,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface AppHeaderProps {
  currentUser: UserSession;
  onSwitchUser: (role: UserRole) => void;
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
  onOpenGPSModal?: () => void;
  onOpenCommandHub?: () => void;
  onLogout: () => void;
  activeSensorsAlertsCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  onSwitchUser,
  onOpenCommandPalette,
  onOpenCopilot,
  onOpenNotifications,
  onOpenGPSModal,
  onOpenCommandHub,
  onLogout,
  activeSensorsAlertsCount,
  onSelectTab,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'ADMIN MASTER', color: 'bg-blue-950/80 text-blue-300 border-blue-500/50', icon: ShieldCheck };
      case 'GESTOR':
        return { label: 'GESTOR OPERACIONAL', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50', icon: Layers };
      case 'TECNICO':
        return { label: 'TÉCNICO DE CAMPO', color: 'bg-sky-950/80 text-sky-300 border-sky-500/50', icon: Wrench };
      case 'CLIENTE':
        return { label: 'SÍNDICO / CLIENTE', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50', icon: UserCheck };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-4 lg:px-6 py-2 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-[1920px] mx-auto">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => { sounds.playClick(); onSelectTab('dashboard'); }}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400 bg-clip-text text-transparent">
                  ZX 360º
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  4.0
                </span>
              </div>
              <span className="hidden xl:inline-block text-[10px] text-zinc-400 font-medium tracking-wide">
                Smart Facilities & Engenharia Predial
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search & Command Palette Trigger */}
        <div className="flex-1 max-w-sm sm:max-w-md mx-1 sm:mx-2">
          <button
            onClick={() => { sounds.playClick(); onOpenCommandPalette(); }}
            className="w-full flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              <span className="truncate text-[11px] sm:text-xs">Buscar OS, ativo, norma...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 rounded shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, GPS, Commands, AI Copilot, Profiles */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* GPS / Geolocation Button */}
          {onOpenGPSModal && (
            <button
              onClick={() => { sounds.playClick(); onOpenGPSModal(); }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-mono transition"
              title="Geolocalização & Check-in GPS"
            >
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden md:inline text-[11px]">GPS</span>
            </button>
          )}

          {/* Interactive Command Hub Button */}
          {onOpenCommandHub && (
            <button
              onClick={() => { sounds.playClick(); onOpenCommandHub(); }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-mono transition"
              title="Comandos Rápidos, QR Code e Ferramentas"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Comandos</span>
            </button>
          )}

          {/* AI Copilot Trigger */}
          <button
            onClick={() => { sounds.playClick(); onOpenCopilot(); }}
            className="relative flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Copilot IA de Manutenção & PMOC"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden lg:inline font-mono">Copilot IA</span>
          </button>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => { sounds.playClick(); setProfileDropdownOpen(!profileDropdownOpen); }}
              className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-1 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all"
              suppressHydrationWarning
            >
              <div className="relative" suppressHydrationWarning>
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={28}
                  height={28}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-zinc-950"></span>
              </div>
              <div className="hidden lg:flex flex-col" suppressHydrationWarning>
                <span className="text-xs font-semibold text-zinc-200 leading-tight truncate max-w-[100px]" suppressHydrationWarning>
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${badge.color} inline-flex items-center gap-0.5 mt-0.5`}>
                  <BadgeIcon className="w-2.5 h-2.5" />
                  {badge.label.split(' ')[0]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 shadow-2xl p-2 z-50 text-zinc-200 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800 mb-1.5">
                  <p className="text-xs font-semibold text-zinc-100">{currentUser.name}</p>
                  <p className="text-[11px] text-zinc-400">{currentUser.email}</p>
                  <div className="mt-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color} inline-flex items-center gap-1`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Troca Rápida de Perfil (RBAC)
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { sounds.playClick(); onSwitchUser('ADMIN'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.role === 'ADMIN' ? 'bg-blue-950 text-blue-200 font-semibold border border-blue-500/40' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Admin Master</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Diretor</span>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); onSwitchUser('GESTOR'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.role === 'GESTOR' ? 'bg-cyan-950 text-cyan-200 font-semibold border border-cyan-500/40' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Gestor Operacional</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Facilities</span>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); onSwitchUser('TECNICO'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.role === 'TECNICO' ? 'bg-sky-950 text-sky-200 font-semibold border border-sky-500/40' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-sky-400" />
                      <span>Técnico de Campo 4.0</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Rota /campo</span>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); onSwitchUser('CLIENTE'); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      currentUser.role === 'CLIENTE' ? 'bg-indigo-950 text-indigo-200 font-semibold border border-indigo-500/40' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>Síndico / Cliente</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">Portal</span>
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-zinc-800">
                  <button
                    onClick={() => { sounds.playClick(); onLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

