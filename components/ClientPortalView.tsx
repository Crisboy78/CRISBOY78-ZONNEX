'use client';

import React, { useState } from 'react';
import { Condominium, WorkOrder, NormativeCompliance, FinancialInvoice } from '@/types/maintenance';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  DollarSign, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Flame,
  Wind,
  Droplets,
  Zap,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface ClientPortalViewProps {
  condominium: Condominium;
  workOrders: WorkOrder[];
  normatives: NormativeCompliance[];
  invoices: FinancialInvoice[];
  onOpenNewTicket: () => void;
  onSelectWorkOrder: (wo: WorkOrder) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  condominium,
  workOrders,
  normatives,
  invoices,
  onOpenNewTicket,
  onSelectWorkOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'SOLICITACOES' | 'LAUDOS' | 'FATURAS'>('SOLICITACOES');

  const condoOrders = workOrders.filter(w => w.condominiumId === condominium.id);
  const condoInvoices = invoices.filter(i => i.condominiumId === condominium.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Condominium Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PORTAL DO SÍNDICO
                </span>
                <span className="text-xs text-zinc-400 font-mono">CNPJ: {condominium.cnpj}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-zinc-100">
                {condominium.name}
              </h1>
              <p className="text-xs text-zinc-400">
                {condominium.address} | Síndico(a): <strong className="text-zinc-200">{condominium.managerName}</strong>
              </p>
            </div>
          </div>

          {/* Quick Ticket Action */}
          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Abrir Solicitação / Chamado</span>
          </button>

        </div>

        {/* Health Score and Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-zinc-800/80">
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">Índice de Conformidade</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">{condominium.healthScore}% OK</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">AVCB Bombeiros</span>
            <span className="text-xs font-mono font-bold text-zinc-200">Válido até 20/11/26</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">Plano PMOC 13.589</span>
            <span className="text-xs font-mono font-bold text-zinc-200">100% em dia</span>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 block font-mono">Suporte Engenharia 24h</span>
            <span className="text-xs font-mono font-bold text-cyan-400">(11) 98765-4321</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
        <button
          onClick={() => setActiveTab('SOLICITACOES')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'SOLICITACOES' 
              ? 'bg-amber-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Chamados & Ordens ({condoOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LAUDOS')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'LAUDOS' 
              ? 'bg-amber-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Laudos & Certificados ({normatives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FATURAS')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'FATURAS' 
              ? 'bg-amber-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Faturas & Contrato ({condoInvoices.length})</span>
        </button>
      </div>

      {/* TAB 1: SOLICITAÇÕES */}
      {activeTab === 'SOLICITACOES' && (
        <div className="space-y-3">
          {condoOrders.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm bg-zinc-900/60 rounded-2xl border border-zinc-800">
              Nenhuma solicitação em andamento no momento.
            </div>
          ) : (
            condoOrders.map((wo) => {
              const statusColor = 
                wo.status === 'CONCLUIDA' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                wo.status === 'EM_ANDAMENTO' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                'bg-zinc-800 text-zinc-300 border-zinc-700';

              return (
                <div
                  key={wo.id}
                  onClick={() => onSelectWorkOrder(wo)}
                  className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-zinc-100">{wo.code}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {wo.category}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusColor} font-semibold`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-100 mb-1">{wo.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {wo.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
                    <span>Data: {wo.scheduledDate}</span>
                    <span>Técnico Responsável: {wo.assignedTechName || 'Plantão Facilities'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: LAUDOS E CERTIFICADOS */}
      {activeTab === 'LAUDOS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {normatives.map((norm) => (
            <div
              key={norm.id}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{norm.code}</span>
                  <h4 className="text-sm font-bold text-zinc-100">{norm.title}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {norm.status}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {norm.legalBasis}
              </p>

              <div className="text-[11px] text-zinc-400 space-y-1 font-mono pt-2 border-t border-zinc-800">
                <div>Eng. Responsável: <strong className="text-zinc-200">{norm.responsibleEngineer}</strong></div>
                <div>ART / CREA: <strong className="text-zinc-200">{norm.artNumber || norm.creaRrt}</strong></div>
                <div className="text-emerald-400">Validade: {norm.validityDate}</div>
              </div>

              <button
                onClick={() => alert(`Baixando cópia oficial autenticada do laudo ${norm.code}...`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Certificado em PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FATURAS E CONTRATO */}
      {activeTab === 'FATURAS' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Histórico de Mensalidades & Faturas do Contrato
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Descrição dos Serviços</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Valor Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {condoInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-zinc-100">{inv.code}</td>
                    <td className="px-4 py-3 text-zinc-200">{inv.description}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{inv.dueDate}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                        inv.status === 'PAGO' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Baixando boleto e NF-e da fatura ${inv.code}...`)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Boleto / NF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
