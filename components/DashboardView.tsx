'use client';

import React, { useState } from 'react';
import { 
  ReliabilityKPIs, 
  WorkOrder, 
  Asset, 
  NormativeCompliance, 
  Condominium, 
  UserRole 
} from '@/types/maintenance';
import { 
  Activity, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  Flame, 
  Zap, 
  Droplets, 
  Wind, 
  Gauge, 
  AlertCircle,
  BarChart3,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface DashboardViewProps {
  kpis: ReliabilityKPIs;
  workOrders: WorkOrder[];
  assets: Asset[];
  normatives: NormativeCompliance[];
  condominiums: Condominium[];
  userRole: UserRole;
  onSelectTab: (tab: string) => void;
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onOpenCopilot: () => void;
  onTriggerNewOS: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  kpis,
  workOrders,
  assets,
  normatives,
  condominiums,
  onSelectTab,
  onSelectWorkOrder,
  onOpenCopilot,
  onTriggerNewOS,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'systems' | 'orders'>('all');

  // Find critical/warning sensors
  const alertedAssets = assets.filter(a => 
    a.status === 'ALERTA' || a.status === 'CRITICO' || a.sensors.some(s => s.status !== 'NORMAL')
  );

  return (
    <div className="space-y-5 max-w-[1800px] mx-auto pb-10">
      
      {/* Top Banner: Smart Facilities Control Hub */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-950 border border-blue-900/50 p-4 sm:p-6 shadow-xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-950 text-blue-300 border border-blue-600/50">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                SISTEMA OPERACIONAL 4.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {condominiums.length} Condomínios Monitorados
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-100">
              Centro de Controle & Engenharia Predial
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Telemetria IoT em tempo real, conformidade estrita às normas técnicas (PMOC, AVCB, NBR/NRs) e inteligência preditiva.
            </p>
          </div>

          {/* Quick Hub Buttons */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                onTriggerNewOS();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Nova OS</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenCopilot();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Diagnóstico IA</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onSelectTab('digital-twin');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Gêmeo Digital</span>
            </button>
          </div>

        </div>
      </div>

      {/* Internal View Switcher: Menus to keep screen clean */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto bg-slate-900/80 border border-slate-800 p-1.5 rounded-xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSection('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'all'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Visão Geral Completa
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSection('systems');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'systems'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Sistemas & Telemetria
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSection('orders');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'orders'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Pipeline de Ordens de Serviço
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden md:inline px-2">
          {condominiums.length} condomínios ativos
        </span>
      </div>

      {/* KPI Ribbon: Reliability & Compliance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">MTTR (Reparo)</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-100 font-mono">{kpis.mttrHours}</span>
            <span className="text-xs text-slate-400 font-mono">h</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">↓ 18% vs anterior</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">MTBF (Falhas)</span>
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-100 font-mono">{kpis.mtbfDays}</span>
            <span className="text-xs text-slate-400 font-mono">dias</span>
          </div>
          <span className="text-[10px] text-sky-300 font-mono mt-0.5 block">↑ 12% confiab.</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">Aderência PMOC</span>
            <Wind className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-blue-300 font-mono">{kpis.pmocComplianceRate}%</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Lei 13.589/18</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">AVCB / Bombeiros</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-300 font-mono">{kpis.avcbComplianceRate}%</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">Laudos Válidos</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">SLA Contratual</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-100 font-mono">{kpis.slaAdherenceRate}%</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">No prazo legal</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-700/50 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider">Sensores IoT</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-cyan-300 font-mono">{kpis.totalMonitoredSensors}</span>
            <span className="text-xs text-slate-400 font-mono">canais</span>
          </div>
          <span className="text-[10px] text-sky-300 font-mono mt-0.5 block">1 Alerta Ativo</span>
        </div>

      </div>

      {/* Live Telemetry Critical Alert Section (Blue-Themed without Yellow) */}
      {alertedAssets.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border border-blue-500/60 shadow-xl shadow-blue-950/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-900/60 border border-blue-500/60 text-sky-300 shrink-0">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow">
                    ALERTA PREDITIVO IoT
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Subsolo 2 - Casa de Bombas e Fosso (Castelo de Grayskull)
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  {alertedAssets[0].name} ({alertedAssets[0].code})
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Sensor de Vibração RMS acusou <span className="font-mono font-bold text-sky-300">4.82 mm/s</span> (limite de segurança: 4.5 mm/s). 
                  Indica desgaste no rolamento SKF dianteiro. OS-2026-089 já despachada para o técnico Duncan / Mentor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => {
                  sounds.playClick();
                  const targetWo = workOrders.find(w => w.assetId === alertedAssets[0].id) || workOrders[0];
                  onSelectWorkOrder(targetWo);
                  onSelectTab('kanban');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Ver OS em Campo</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('digital-twin');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Gêmeo Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Areas with Section Filter */}
      <div className={`grid gap-6 ${activeSection === 'all' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        
        {/* Left: Engineering Systems Health Matrix */}
        {(activeSection === 'all' || activeSection === 'systems') && (
          <div className={`${activeSection === 'all' ? 'lg:col-span-2' : ''} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm sm:text-base font-bold text-slate-100">
                  Matriz de Sistemas Prediais & Telemetria
                </h2>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('ativos');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                Ver todos os ativos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Climatização */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Climatização & PMOC</h3>
                      <p className="text-[10px] text-slate-400">Chillers, VRF, Filtros G4/F7</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-600/50 font-semibold">
                    100% OK
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Temp. Água Gelada:</span>
                    <span className="font-mono text-slate-200 font-semibold">6.8 °C (Nominal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validade do Laudo PMOC:</span>
                    <span className="font-mono text-blue-300">31/12/2026</span>
                  </div>
                </div>
              </div>

              {/* Incêndio AVCB */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Incêndio & AVCB</h3>
                      <p className="text-[10px] text-slate-400">Bombas, Hidrantes, PCF, Alarme</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-600/50 font-semibold">
                    AVCB Vigente
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Pressão da Rede:</span>
                    <span className="font-mono text-slate-200 font-semibold">9.8 bar (Pressurizada)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validade AVCB CBMESP:</span>
                    <span className="font-mono text-rose-300">20/11/2026</span>
                  </div>
                </div>
              </div>

              {/* Elétrica & Geradores */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Elétrica, SPDA & Gerador</h3>
                      <p className="text-[10px] text-slate-400">QTA 500kVA, NBR 5419, NR-10</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-600/50 font-semibold">
                    Standby OK
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Tempo de Comutação:</span>
                    <span className="font-mono text-slate-200 font-semibold">6.4s (Automático)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medição Ôhmica SPDA:</span>
                    <span className="font-mono text-sky-300">&lt; 10 Ω (Conforme)</span>
                  </div>
                </div>
              </div>

              {/* Hidráulica */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Hidráulica & Reservatórios</h3>
                      <p className="text-[10px] text-slate-400">Recalque, Esgoto, Potabilidade</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-600/50 font-semibold">
                    1 Em Reparo
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Nível Reservatório:</span>
                    <span className="font-mono text-slate-200 font-semibold">84.5% (42.250 L)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próx. Higienização:</span>
                    <span className="font-mono text-blue-300">15/10/2026</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Right: Active Work Orders Pipeline */}
        {(activeSection === 'all' || activeSection === 'orders') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm sm:text-base font-bold text-slate-100">
                  Pipeline de Ordens de Serviço
                </h2>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectTab('kanban');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                Abrir Kanban <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {workOrders.slice(0, 4).map((wo) => {
                const priorityColor = 
                  wo.priority === 'CRITICA' ? 'text-rose-300 bg-rose-950 border-rose-800' :
                  wo.priority === 'ALTA' ? 'text-sky-300 bg-sky-950 border-sky-800' :
                  'text-blue-300 bg-blue-950 border-blue-800';

                const statusColor = 
                  wo.status === 'EM_ANDAMENTO' ? 'bg-blue-950 text-blue-300 border-blue-600/50' :
                  wo.status === 'CONCLUIDA' ? 'bg-indigo-950 text-indigo-300 border-indigo-600/50' :
                  wo.status === 'AGENDADA' ? 'bg-sky-950 text-sky-300 border-sky-600/50' :
                  'bg-slate-900 text-slate-300 border-slate-700';

                return (
                  <div
                    key={wo.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectWorkOrder(wo);
                      onSelectTab('kanban');
                    }}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-600/40 cursor-pointer transition-all hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-100">{wo.code}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${priorityColor}`}>
                          {wo.priority}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusColor}`}>
                        {wo.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                      {wo.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">
                        {wo.assignedTechName ? `Técnico: ${wo.assignedTechName.split(' ')[0]}` : 'Aguardando técnico'}
                      </span>
                      <span className="font-mono text-slate-500">{wo.scheduledDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
