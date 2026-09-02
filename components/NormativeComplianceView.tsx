'use client';

import React, { useState } from 'react';
import { NormativeCompliance, NormativeType, UserRole } from '@/types/maintenance';
import { 
  FileCheck2, 
  Wind, 
  Flame, 
  Zap, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Scale,
  Award
} from 'lucide-react';

interface NormativeComplianceViewProps {
  normatives: NormativeCompliance[];
  userRole: UserRole;
  onGeneratePMOCReport: () => void;
}

export const NormativeComplianceView: React.FC<NormativeComplianceViewProps> = ({
  normatives,
  onGeneratePMOCReport,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const getNormIcon = (type: NormativeType) => {
    switch (type) {
      case 'PMOC':
        return Wind;
      case 'AVCB':
        return Flame;
      case 'SPDA_NBR5419':
      case 'NR10_ELETRICA':
        return Zap;
      case 'POTABILIDADE_AGUA':
        return Droplets;
      default:
        return FileCheck2;
    }
  };

  const filteredNormatives = normatives.filter(n => {
    if (activeFilter === 'ALL') return true;
    return n.normType === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-blue-950/30 to-zinc-900 border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 shadow-lg">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-extrabold text-zinc-100">
                Central de Conformidade Normativa & Engenharia Legal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                BRASIL NBR / NRs
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl mt-0.5 leading-relaxed">
              Gestão rigorosa de laudos técnicos, ARTs no CREA, certificados e cronogramas obrigatórios por Lei Federal (PMOC 13.589/18, AVCB, NBR 5419 e NRs).
            </p>
          </div>
        </div>

        {/* 1-Click AI PMOC Report Generator */}
        <button
          onClick={onGeneratePMOCReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-zinc-950" />
          <span>Gerar Laudo PMOC com IA</span>
        </button>
      </div>

      {/* Normative Matrix Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* PMOC Card */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>PMOC Climatização</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              Conforme
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Lei Federal 13.589/2018 + Portaria MS 3.523/1998 + RE 09 ANVISA. Laudo e ART registrados.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between">
            <span>Frequência: Mensal</span>
            <span className="text-cyan-300">Próx: 15/09/2026</span>
          </div>
        </div>

        {/* AVCB Card */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-rose-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>AVCB / CBMESP</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              Vigente
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            NBR 13714 (Hidrantes), NBR 12693 (Extintores), NBR 17240 (Alarme), NBR 11742 (PCF).
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between">
            <span>Frequência: Anual</span>
            <span className="text-rose-300">Validade: 20/11/2026</span>
          </div>
        </div>

        {/* SPDA & Elétrica */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SPDA & NR-10</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              Laudo Válido
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            NBR 5419:2015 (Medição Ôhmica de Aterramento & Descidas) + NR-10 Prontuário Elétrico.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between">
            <span>Frequência: Anual</span>
            <span className="text-amber-300">Validade: 10/02/2027</span>
          </div>
        </div>

        {/* Qualidade da Água */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-blue-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Qualidade da Água</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
              Potável
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Portaria GM/MS 888/2021 + NBR 5626 (Higienização semestral das caixas e análise laboratorial).
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex justify-between">
            <span>Frequência: Semestral</span>
            <span className="text-blue-300">Próx: 15/10/2026</span>
          </div>
        </div>

      </div>

      {/* Normative List Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Quadro de Certificados Técnicos & ARTs Ativas
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            {filteredNormatives.length} Documentos em Conformidade
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Norma / Certificação</th>
                <th className="px-4 py-3">Base Legal Brasileira</th>
                <th className="px-4 py-3">Responsável Técnico</th>
                <th className="px-4 py-3">Número da ART / CREA</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredNormatives.map((norm) => {
                const Icon = getNormIcon(norm.normType);

                return (
                  <tr key={norm.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-zinc-800 text-cyan-400 border border-zinc-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-100 block">{norm.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{norm.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">{norm.legalBasis}</td>
                    <td className="px-4 py-3 text-zinc-200">{norm.responsibleEngineer}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{norm.artNumber || norm.creaRrt || '-'}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-400">{norm.validityDate}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                        {norm.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Certificado ${norm.certNumber || norm.code} emitido e autenticado no sistema ZX 360º.`)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
