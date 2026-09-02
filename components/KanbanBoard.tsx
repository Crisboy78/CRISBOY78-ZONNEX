'use client';

import React, { useState } from 'react';
import { 
  WorkOrder, 
  OSStatus, 
  OSPriority, 
  AssetCategory, 
  Asset,
  UserRole
} from '@/types/maintenance';
import { 
  KanbanSquare, 
  Table, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  userRole: UserRole;
  selectedWorkOrder: WorkOrder | null;
  onSelectWorkOrder: (wo: WorkOrder | null) => void;
  onUpdateWorkOrderStatus: (id: string, newStatus: OSStatus) => void;
  onOpenFieldExecution: (wo: WorkOrder) => void;
  onOpenCopilotWithContext: (wo: WorkOrder) => void;
  onTriggerNewOS: () => void;
}

const COLUMNS: { status: OSStatus; label: string; color: string; border: string; bg: string }[] = [
  { status: 'ABERTA', label: 'Abertas / Triagem', color: 'text-zinc-300', border: 'border-zinc-700', bg: 'bg-zinc-900/60' },
  { status: 'AGENDADA', label: 'Agendadas (PMOC)', color: 'text-blue-300', border: 'border-blue-500/40', bg: 'bg-blue-950/20' },
  { status: 'EM_ANDAMENTO', label: 'Em Andamento', color: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-950/20' },
  { status: 'AGUARDANDO_APROVACAO', label: 'Aguardando Aprovação', color: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-950/20' },
  { status: 'CONCLUIDA', label: 'Concluídas & Laudos', color: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-950/20' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workOrders,
  assets,
  userRole,
  selectedWorkOrder,
  onSelectWorkOrder,
  onUpdateWorkOrderStatus,
  onOpenFieldExecution,
  onOpenCopilotWithContext,
  onTriggerNewOS,
}) => {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABELA'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // Filtered list
  const filteredOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || wo.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityBadge = (priority: OSPriority) => {
    switch (priority) {
      case 'CRITICA':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      case 'ALTA':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold';
      case 'MEDIA':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'BAIXA':
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-4 max-w-[1920px] mx-auto pb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <KanbanSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-zinc-100">
              Gestão de Ordens de Serviço & Manutenções
            </h1>
            <p className="text-xs text-zinc-400">
              {filteredOrders.length} OSs listadas | Fluxo automatizado de abertura a laudo assinado
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center flex-wrap gap-2.5 self-end md:self-center">
          
          <div className="flex items-center p-1 rounded-lg bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'KANBAN' ? 'bg-cyan-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('TABELA')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'TABELA' ? 'bg-cyan-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabela</span>
            </button>
          </div>

          <button
            onClick={onTriggerNewOS}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nova OS</span>
          </button>
        </div>

      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Filtrar por código, título, descrição ou ativo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Categoria:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="CLIMATIZACAO">Climatização (PMOC)</option>
            <option value="INCENDIO_AVCB">Incêndio & AVCB</option>
            <option value="ELETRICA_SPDA">Elétrica & SPDA</option>
            <option value="HIDRAULICA">Hidráulica & Bombas</option>
            <option value="GERADORES">Geradores</option>
            <option value="ELEVADORES">Elevadores (RIA)</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Todas as Prioridades</option>
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
          {COLUMNS.map((col) => {
            const columnOrders = filteredOrders.filter(wo => wo.status === col.status);

            return (
              <div 
                key={col.status} 
                className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-3 min-h-[500px] max-h-[calc(100vh-250px)]`}
              >
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${col.color}`}>
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {columnOrders.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center text-[11px] text-zinc-600 border border-dashed border-zinc-800/80 rounded-xl p-4">
                      Nenhuma OS nesta etapa
                    </div>
                  ) : (
                    columnOrders.map((wo) => {
                      const priorityStyle = getPriorityBadge(wo.priority);
                      const relatedAsset = assets.find(a => a.id === wo.assetId);

                      return (
                        <div
                          key={wo.id}
                          onClick={() => onSelectWorkOrder(wo)}
                          className="group relative p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
                        >
                          {/* Code & Priority */}
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <span className="text-xs font-mono font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                              {wo.code}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${priorityStyle}`}>
                              {wo.priority}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-semibold text-zinc-200 leading-snug mb-1.5 line-clamp-2">
                            {wo.title}
                          </h4>

                          {/* Asset and Location */}
                          {relatedAsset && (
                            <div className="text-[11px] text-zinc-400 mb-2 truncate flex items-center gap-1">
                              <span className="text-cyan-400">📍</span>
                              <span>{relatedAsset.location}</span>
                            </div>
                          )}

                          {/* Checklist status */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              {wo.checklist.filter(c => c.checked).length}/{wo.checklist.length} itens
                            </span>
                            <span>{wo.scheduledDate}</span>
                          </div>

                          {/* Action Hover Strip */}
                          <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenFieldExecution(wo);
                              }}
                              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Executar</span>
                            </button>

                            {/* Move forward helper */}
                            {col.status !== 'CONCLUIDA' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStatus: Record<OSStatus, OSStatus> = {
                                    ABERTA: 'AGENDADA',
                                    AGENDADA: 'EM_ANDAMENTO',
                                    EM_ANDAMENTO: 'AGUARDANDO_APROVACAO',
                                    AGUARDANDO_APROVACAO: 'CONCLUIDA',
                                    CONCLUIDA: 'CONCLUIDA',
                                    CANCELADA: 'CANCELADA',
                                  };
                                  onUpdateWorkOrderStatus(wo.id, nextStatus[wo.status]);
                                }}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1"
                                title="Avançar etapa"
                              >
                                <span>Avançar</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Título da OS</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data Prevista</th>
                  <th className="px-4 py-3">Técnico</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((wo) => {
                  const priorityStyle = getPriorityBadge(wo.priority);

                  return (
                    <tr 
                      key={wo.id}
                      onClick={() => onSelectWorkOrder(wo)}
                      className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-zinc-100">{wo.code}</td>
                      <td className="px-4 py-3 font-semibold text-zinc-200 max-w-xs truncate">{wo.title}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">{wo.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${priorityStyle}`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-300">{wo.status.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-mono text-zinc-400">{wo.scheduledDate}</td>
                      <td className="px-4 py-3 text-zinc-300 truncate">{wo.assignedTechName || '-'}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFieldExecution(wo);
                          }}
                          className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold"
                        >
                          Executar
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

      {/* WORK ORDER DETAILS DRAWER / MODAL */}
      {selectedWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-extrabold text-cyan-400">
                    {selectedWorkOrder.code}
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${getPriorityBadge(selectedWorkOrder.priority)}`}>
                    {selectedWorkOrder.priority}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {selectedWorkOrder.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-zinc-100">
                  {selectedWorkOrder.title}
                </h2>
              </div>

              <button
                onClick={() => onSelectWorkOrder(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
              <span className="font-bold text-zinc-200 block mb-1">Descrição do Serviço / Escopo:</span>
              {selectedWorkOrder.description}
            </div>

            {/* AI Diagnostic Card if present */}
            {selectedWorkOrder.aiDiagnostic && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-900 border border-cyan-500/40 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-cyan-300">Diagnóstico Preditivo Copilot IA</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Tempo estimado: ~{selectedWorkOrder.aiDiagnostic.estimatedHours}h</span>
                </div>
                <p className="text-xs text-zinc-300">
                  <strong className="text-zinc-200">Causa Raiz Provável:</strong> {selectedWorkOrder.aiDiagnostic.probableCause}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-cyan-900/40">
                  <div>
                    <span className="text-cyan-400 font-semibold block">Peças Recomendadas:</span>
                    <ul className="list-disc list-inside text-zinc-400 mt-0.5 space-y-0.5">
                      {selectedWorkOrder.aiDiagnostic.suggestedParts.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-semibold block">Segurança & NRs:</span>
                    <ul className="list-disc list-inside text-zinc-400 mt-0.5 space-y-0.5">
                      {selectedWorkOrder.aiDiagnostic.safetyRequirements.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Checklist items */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider">
                Checklist Normativo de Execução ({selectedWorkOrder.checklist.length} Itens)
              </h3>
              <div className="space-y-2">
                {selectedWorkOrder.checklist.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                          item.checked ? 'bg-emerald-500 text-zinc-950 font-bold' : 'border border-zinc-700 bg-zinc-900'
                        }`}>
                          {item.checked ? '✓' : ''}
                        </span>
                        <span className="text-xs font-bold text-zinc-200">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 pl-6">{item.description}</p>
                      {item.measuredValue && (
                        <p className="text-[11px] font-mono text-cyan-400 pl-6">
                          Medição Registrada: <strong>{item.measuredValue}</strong>
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                      {item.normativeRef}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature if completed */}
            {selectedWorkOrder.signature && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Assinatura Digital Coletada em Campo
                  </span>
                  <p className="text-xs text-zinc-300">
                    Signatário: <strong>{selectedWorkOrder.signature.name}</strong> ({selectedWorkOrder.signature.document})
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Data/Hora: {selectedWorkOrder.signature.timestamp} | Local: {selectedWorkOrder.signature.gpsCoordinates}
                  </p>
                </div>
              </div>
            )}

            {/* Footer Action buttons */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => onOpenCopilotWithContext(selectedWorkOrder)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Analisar com IA</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectWorkOrder(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onOpenFieldExecution(selectedWorkOrder);
                    onSelectWorkOrder(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Abrir no Modo Campo 4.0</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
