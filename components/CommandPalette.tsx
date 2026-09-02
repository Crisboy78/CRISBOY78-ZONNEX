'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Wrench, 
  Layers, 
  FileCheck2, 
  QrCode, 
  Boxes, 
  Building2, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { WorkOrder, Asset, Condominium, UserRole } from '@/types/maintenance';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  workOrders: WorkOrder[];
  assets: Asset[];
  condominiums: Condominium[];
  userRole: UserRole;
  onSelectTab: (tab: string) => void;
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenCopilot: () => void;
}

interface CommandItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  workOrders,
  assets,
  condominiums,
  userRole,
  onSelectTab,
  onSelectWorkOrder,
  onSelectAsset,
  onOpenCopilot,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo<CommandItem[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Return default quick actions based on role
      return [
        {
          id: 'action-copilot',
          type: 'ACTION',
          title: 'Abrir Copilot IA (Diagnóstico Preditivo)',
          category: 'Inteligência Artificial',
          icon: Sparkles,
          action: () => { onOpenCopilot(); onClose(); }
        },
        {
          id: 'action-campo',
          type: 'ACTION',
          title: 'Ir para Execução em Campo 4.0 (/campo)',
          category: 'Operação',
          icon: Wrench,
          action: () => { onSelectTab('campo'); onClose(); }
        },
        {
          id: 'action-twin',
          type: 'ACTION',
          title: 'Visualizar Gêmeo Digital & Telemetria IoT',
          category: 'Smart Building',
          icon: Layers,
          action: () => { onSelectTab('digital-twin'); onClose(); }
        },
        {
          id: 'action-pmoc',
          type: 'ACTION',
          title: 'Consultar Normas PMOC, AVCB & NRs',
          category: 'Engenharia & Compliance',
          icon: FileCheck2,
          action: () => { onSelectTab('normativas'); onClose(); }
        },
        {
          id: 'action-qr',
          type: 'ACTION',
          title: 'Escanear / Imprimir QR Codes de Ativos',
          category: 'Ativos',
          icon: QrCode,
          action: () => { onSelectTab('ativos'); onClose(); }
        }
      ];
    }

    const list: CommandItem[] = [];

    // Search Work Orders
    workOrders.forEach(wo => {
      if (
        wo.code.toLowerCase().includes(q) ||
        wo.title.toLowerCase().includes(q) ||
        wo.description.toLowerCase().includes(q)
      ) {
        list.push({
          id: `wo-${wo.id}`,
          type: 'OS',
          title: `${wo.code}: ${wo.title}`,
          subtitle: `Status: ${wo.status} | Prioridade: ${wo.priority}`,
          category: 'Ordens de Serviço',
          icon: Wrench,
          badge: wo.priority,
          action: () => {
            onSelectWorkOrder(wo);
            onSelectTab('kanban');
            onClose();
          }
        });
      }
    });

    // Search Assets
    assets.forEach(asset => {
      if (
        asset.code.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q)
      ) {
        list.push({
          id: `asset-${asset.id}`,
          type: 'ATIVO',
          title: `${asset.code} - ${asset.name}`,
          subtitle: `${asset.location} (${asset.brand} - ${asset.model})`,
          category: 'Ativos Técnicos',
          icon: QrCode,
          badge: asset.status,
          action: () => {
            onSelectAsset(asset);
            onSelectTab('ativos');
            onClose();
          }
        });
      }
    });

    // Search Condominiums
    condominiums.forEach(condo => {
      if (
        condo.name.toLowerCase().includes(q) ||
        condo.address.toLowerCase().includes(q)
      ) {
        list.push({
          id: `condo-${condo.id}`,
          type: 'CONDOMINIO',
          title: condo.name,
          subtitle: `${condo.address} | Síndico: ${condo.managerName}`,
          category: 'Condomínios',
          icon: Building2,
          badge: `${condo.healthScore}% Health`,
          action: () => {
            onSelectTab('condominios');
            onClose();
          }
        });
      }
    });

    // Add generic actions matching query
    if ('copilot ia diagnóstico laudo pmoc'.includes(q)) {
      list.push({
        id: 'action-copilot-search',
        type: 'ACTION',
        title: 'Copilot IA: Diagnosticar falha ou gerar laudo PMOC',
        category: 'Inteligência Artificial',
        icon: Sparkles,
        action: () => { onOpenCopilot(); onClose(); }
      });
    }

    return list;
  }, [query, workOrders, assets, condominiums, onOpenCopilot, onSelectTab, onSelectWorkOrder, onSelectAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Digite para buscar OS, ativos, normas, peças ou comandos..."
            className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded border border-zinc-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-zinc-800/40">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isSelected 
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200' 
                        : 'hover:bg-zinc-800/60 text-zinc-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'ACTION' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                        item.type === 'OS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        item.type === 'ATIVO' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{item.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-800">
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ navegar</span>
            <span>↵ selecionar</span>
            <span>ESC fechar</span>
          </div>
          <span className="text-cyan-400 font-semibold">ZX 360º Command Palette</span>
        </div>

      </div>
    </div>
  );
};
