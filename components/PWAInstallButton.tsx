'use client';

import React, { useState } from 'react';
import { Download, Share, PlusSquare, CheckCircle, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { sounds } from '@/lib/soundEffects';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile-banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If running in standalone installed PWA
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Aplicativo PWA Instalado & Ativo</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = () => {
    sounds.playClick();
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General prompt
      setShowIOSGuide(true);
    }
  };

  if (variant === 'mobile-banner') {
    return (
      <>
        <div className="md:hidden flex items-center justify-between p-3 bg-gradient-to-r from-cyan-950/70 via-zinc-900 to-zinc-950 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-100">Instalar ZX 360º App</p>
              <p className="text-[10px] text-zinc-400 font-mono">Funciona 100% Offline no celular</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-zinc-950 text-xs font-bold font-mono transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-zinc-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Instalar no Celular (iOS / Android)</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Sem necessidade de App Store</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Toque no botão <strong className="text-cyan-400 flex items-center gap-1 inline-flex"><Share className="w-3 h-3 inline" /> Compartilhar</strong> no navegador Safari/Chrome.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Role a lista e selecione <strong className="text-emerald-400 flex items-center gap-1 inline-flex"><PlusSquare className="w-3 h-3 inline" /> Adicionar à Tela de Início</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Pronto! O app abre em tela cheia mesmo sem sinal de internet.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium transition active:scale-95"
        title="Instalar App PWA no dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar PWA</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-zinc-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Instalar no Dispositivo</h3>
                <p className="text-[11px] text-zinc-400 font-mono">PWA Offline & Notificações</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Abra as opções do navegador ou toque em <strong className="text-cyan-400">Compartilhar</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Escolha <strong className="text-emerald-400">Instalar Aplicativo</strong> ou <strong className="text-emerald-400">Adicionar à Tela Inicial</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
