'use client';

import React from 'react';
import { RefreshCw, CheckCircle2, Cloud, CloudOff, Database } from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface OfflineStatusBannerProps {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: string | null;
  onSync: () => void;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
  isOnline,
  pendingCount,
  isSyncing,
  lastSyncTime,
  onSync,
}) => {
  const handleSync = () => {
    sounds.playClick();
    onSync();
  };

  return (
    <div
      className={`w-full text-xs font-mono border-b transition-colors ${
        !isOnline
          ? 'bg-blue-950/95 border-blue-500/50 text-blue-200 shadow-inner'
          : pendingCount > 0
          ? 'bg-sky-950/90 border-sky-500/40 text-sky-200'
          : 'bg-slate-950/80 border-slate-800/80 text-slate-400'
      } px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2`}
    >
      {/* Left: Real Network Connectivity & Local Storage Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {!isOnline ? (
            <span className="flex items-center gap-1.5 font-bold text-sky-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <CloudOff className="w-3.5 h-3.5 text-sky-400" />
              <span>SEM INTERNET • MODO LOCAL ATIVO</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>CONECTADO À INTERNET</span>
            </span>
          )}
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Informative message for online vs offline */}
        {!isOnline ? (
          <span className="text-slate-300 text-[11px] flex items-center gap-1">
            <Database className="w-3 h-3 text-sky-400" />
            <span>Dados gravados localmente no dispositivo. Envio automático ao restabelecer rede.</span>
          </span>
        ) : pendingCount > 0 ? (
          <span className="flex items-center gap-1 text-sky-300 font-medium text-[11px]">
            <RefreshCw className={`w-3 h-3 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{pendingCount} alterações locais sendo transmitidas ao servidor...</span>
          </span>
        ) : (
          <span className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]" suppressHydrationWarning>
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>Dados salvos no servidor via internet</span>
            {lastSyncTime && (
              <span className="text-slate-500" suppressHydrationWarning>
                (às {lastSyncTime})
              </span>
            )}
          </span>
        )}
      </div>

      {/* Right: Cloud Sync Action / Status */}
      <div className="flex items-center gap-2">
        {isOnline && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-950/80 hover:bg-blue-900/80 text-blue-200 border border-blue-700/50 font-medium text-[11px] transition active:scale-95 disabled:opacity-50"
            title="Verificar e enviar dados pendentes para o servidor"
          >
            <RefreshCw className={`w-3 h-3 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Transmitindo...' : 'Sincronizar com Nuvem'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
