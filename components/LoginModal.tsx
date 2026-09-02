'use client';

import React, { useState } from 'react';
import { UserRole, UserSession } from '@/types/maintenance';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { MOCK_USERS } from '@/lib/mockDatabase';
import { sounds } from '@/lib/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserSession) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [email, setEmail] = useState('admin@zx2026.com.br');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg('');

    const matchedUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      // Allow flexible login based on role keyword
      if (email.includes('tecnico')) onLoginSuccess(MOCK_USERS[2]);
      else if (email.includes('cliente') || email.includes('sindico')) onLoginSuccess(MOCK_USERS[3]);
      else if (email.includes('gestor')) onLoginSuccess(MOCK_USERS[1]);
      else onLoginSuccess(MOCK_USERS[0]);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    sounds.playClick();
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-blue-900/50 shadow-2xl shadow-blue-950/50 p-6 sm:p-8 space-y-6 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-sky-200 to-indigo-400 bg-clip-text text-transparent">
            ZX 360º PRO
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Plataforma de Manutenção Predial 4.0 & Facilities
          </p>
        </div>

        {/* 1-Click Fast Profile Switcher */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
            Entrada Rápida por Perfil (1 Clique)
          </span>

          <div className="grid grid-cols-2 gap-2">
            
            <button
              onClick={() => handleQuickLogin('CLIENTE')}
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-indigo-500/40 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs mb-0.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Cliente / Síndico</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Rei Randor (/portal)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('GESTOR')}
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-cyan-500/40 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs mb-0.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Gestor Operação</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">Teela (Facilities)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('TECNICO')}
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-sky-500/40 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs mb-0.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Técnico de Campo</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Duncan / Mentor (/campo)</span>
            </button>

            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-blue-500/40 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-1.5 text-blue-300 font-bold text-xs mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Master</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">He-Man (Adam)</span>
            </button>

          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-mono">ou credenciais</span>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-3">
          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">E-mail corporativo:</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@zx2026.com.br"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Senha de acesso:</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Entrar na Plataforma</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
