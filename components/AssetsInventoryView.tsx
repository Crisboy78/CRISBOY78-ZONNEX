'use client';

import React, { useState } from 'react';
import { Asset, InventoryItem, UserRole } from '@/types/maintenance';
import { 
  QrCode, 
  Boxes, 
  Wrench, 
  Search, 
  Printer, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface AssetsInventoryViewProps {
  assets: Asset[];
  inventory: InventoryItem[];
  userRole: UserRole;
  onOpenCopilot: (symptom?: string, asset?: Asset) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const AssetsInventoryView: React.FC<AssetsInventoryViewProps> = ({
  assets,
  inventory,
  userRole,
  onOpenCopilot,
  onSelectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'ATIVOS' | 'ESTOQUE'>('ATIVOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1920px] mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-100">
              Gestão de Ativos Técnicos & Estoque de Peças
            </h1>
            <p className="text-xs text-zinc-400">
              Inventário patrimonial com etiquetas QR Code, telemetria e controle de insumos críticos
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => setActiveTab('ATIVOS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ATIVOS' ? 'bg-cyan-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Ativos & QR Codes ({assets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ESTOQUE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ESTOQUE' ? 'bg-cyan-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Estoque & Peças ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por código, modelo, localização ou insumo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* TAB 1: ATIVOS */}
      {activeTab === 'ATIVOS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const hasAlert = asset.status === 'ALERTA' || asset.status === 'CRITICO';

            return (
              <div
                key={asset.id}
                className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-cyan-500/40 transition-all shadow-md space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">{asset.code}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        hasAlert ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-100">{asset.name}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedAssetForQR(asset)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700"
                    title="Imprimir Etiqueta QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-400 space-y-1 font-mono">
                  <div>Localização: <strong className="text-zinc-200">{asset.location}</strong></div>
                  <div>Fabricante: <strong className="text-zinc-200">{asset.brand} ({asset.model})</strong></div>
                  <div>Instalação: <strong className="text-zinc-200">{asset.installDate}</strong></div>
                </div>

                {/* Specs */}
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                  <span className="text-zinc-500 font-mono text-[10px] block">Especificações Técnicas:</span>
                  {Object.entries(asset.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span className="font-mono text-cyan-300">{String(val)}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCopilot(`Diagnosticar ativo ${asset.name} (${asset.code})`, asset)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Copilot IA</span>
                  </button>

                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                  >
                    Detalhes Completos
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ESTOQUE & PEÇAS */}
      {activeTab === 'ESTOQUE' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Item / Peça de Reposição</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Qtd Atual</th>
                  <th className="px-4 py-3">Estoque Mínimo</th>
                  <th className="px-4 py-3">Valor Unitário</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.minQuantity;

                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-zinc-100">{item.code}</td>
                      <td className="px-4 py-3 font-semibold text-zinc-200">
                        {item.name}
                        <span className="text-[10px] text-zinc-500 block font-mono">Local: {item.location}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-400">{item.category}</td>
                      <td className="px-4 py-3 font-mono font-bold text-zinc-100">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-400">
                        {item.minQuantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 font-mono text-emerald-400">
                        R$ {item.unitCost.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                          isLow ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {isLow ? 'CRÍTICO' : 'NORMAL'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => alert(`Solicitação de compra gerada para ${item.name} (${item.code})!`)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700 text-[11px] font-semibold"
                        >
                          Repor Estoque
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Tag Modal */}
      {selectedAssetForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 space-y-4 text-center text-zinc-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold text-cyan-400">Etiqueta de Patrimônio 4.0</span>
              <button
                onClick={() => setSelectedAssetForQR(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Fechar
              </button>
            </div>

            {/* Simulated Printed Tag */}
            <div className="p-4 rounded-xl bg-white text-zinc-950 space-y-2 border-2 border-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1 text-[10px] font-mono font-extrabold tracking-wider">
                <span>ZX 360º PRO</span>
                <span>FACILITIES 4.0</span>
              </div>

              {/* QR Code Graphic simulation */}
              <div className="w-36 h-36 mx-auto bg-zinc-950 rounded-lg p-2 flex items-center justify-center text-white">
                <QrCode className="w-28 h-28 text-white" />
              </div>

              <div className="space-y-0.5 text-left">
                <div className="font-mono text-xs font-extrabold">{selectedAssetForQR.code}</div>
                <div className="font-bold text-xs leading-tight">{selectedAssetForQR.name}</div>
                <div className="text-[10px] text-zinc-700">{selectedAssetForQR.location}</div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Comando de impressão enviado para a impressora térmica de etiquetas (Zebra/Brother).`);
                setSelectedAssetForQR(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Etiqueta Térmica</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
