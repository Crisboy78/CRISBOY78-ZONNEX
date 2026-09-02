'use client';

import React, { useState } from 'react';
import { Asset, IoTSensor, WorkOrder } from '@/types/maintenance';
import { 
  Layers, 
  Activity, 
  Zap, 
  Droplets, 
  Wind, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  Radio, 
  RefreshCw, 
  Wrench,
  CheckCircle2,
  Gauge
} from 'lucide-react';

interface DigitalTwinProps {
  assets: Asset[];
  onOpenCopilot: (symptom?: string, asset?: Asset) => void;
  onSelectAsset: (asset: Asset) => void;
  onCreatePredictiveOS: (asset: Asset, sensor: IoTSensor) => void;
}

type FloorLevel = 'COBERTURA' | 'ANDAR_TIPO' | 'TERREO' | 'SUBSOLO_1' | 'SUBSOLO_2';

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  assets,
  onOpenCopilot,
  onSelectAsset,
  onCreatePredictiveOS,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<FloorLevel>('SUBSOLO_2');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[1]?.id || assets[0]?.id);
  const [isSimulating, setIsSimulating] = useState(false);

  // Filter assets for current floor
  const floorAssets = assets.filter(a => {
    if (selectedLevel === 'COBERTURA') return a.floorLevel === 'COBERTURA' || a.floorLevel === 'CASA_MAQUINAS';
    if (selectedLevel === 'ANDAR_TIPO') return a.floorLevel === 'ANDAR_TIPO';
    if (selectedLevel === 'TERREO') return a.floorLevel === 'TERREO';
    if (selectedLevel === 'SUBSOLO_1') return a.floorLevel === 'SUBSOLO_1';
    if (selectedLevel === 'SUBSOLO_2') return a.floorLevel === 'SUBSOLO_2';
    return true;
  });

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleSimulateAnomaly = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 max-w-[1920px] mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-900 to-blue-900 text-cyan-300 border border-cyan-700/50">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-zinc-100">
                Gêmeo Digital & Telemetria IoT 4.0
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Planta interativa dos sistemas do condomínio com telemetria contínua e gatilhos de manutenção preditiva
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handleSimulateAnomaly}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isSimulating 
                ? 'bg-amber-500 text-zinc-950 border-amber-400'
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-amber-500/40'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simular Telemetria</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Floor Selector + Blueprint + Live Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col (3 cols): Floor Level Selector & Systems Tree */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Níveis do Empreendimento
            </h3>

            <div className="space-y-1.5">
              {[
                { level: 'COBERTURA', label: 'Cobertura / Barrilete', desc: 'Chillers 350TR, Caixa Superior, SPDA', icon: Wind, badge: 'PMOC' },
                { level: 'ANDAR_TIPO', label: 'Torres & Prumadas', desc: 'Elevadores Atlas Schindler, Hidrantes', icon: Layers, badge: '28 Pav.' },
                { level: 'TERREO', label: 'Térreo & Portaria', desc: 'Central de Alarme Notifier, PCF', icon: Flame, badge: 'AVCB' },
                { level: 'SUBSOLO_1', label: 'Subsolo 1 - Sala Gerador', desc: 'Grupo Gerador Stemac 500kVA, QTA', icon: Zap, badge: 'Standby' },
                { level: 'SUBSOLO_2', label: 'Subsolo 2 - Casa Bombas', desc: 'Bombas Recalque 15CV, Bomba Incêndio', icon: Droplets, badge: '1 Alerta', alert: true },
              ].map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = selectedLevel === lvl.level;

                return (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevel(lvl.level as FloorLevel)}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-500/10'
                        : 'bg-zinc-950/60 hover:bg-zinc-800/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                        <span className={isSelected ? 'text-zinc-100' : 'text-zinc-300'}>{lvl.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        lvl.alert 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          : isSelected ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}>
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">{lvl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Col (5 cols): Interactive 2D/3D Smart Floorplan Blueprint */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            
            {/* Blueprint Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  PLANTA TÉCNICA: {selectedLevel.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Escala 1:100 | Telemetria IoT Ativa
              </span>
            </div>

            {/* Simulated Interactive Blueprint Graphic */}
            <div className="relative flex-1 my-4 min-h-[340px] rounded-xl bg-zinc-950/90 border border-cyan-500/20 p-4 flex flex-col items-center justify-center overflow-hidden">
              {/* Grid Lines Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Architectural Outline Map Representation */}
              <div className="relative w-full h-full border border-dashed border-zinc-700/60 rounded-lg p-3 flex flex-col justify-between">
                
                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>SALA TÉCNICA A</span>
                  <span>BARRILETE HIDRÁULICO</span>
                  <span>SALA TÉCNICA B</span>
                </div>

                {/* Hotspot Pins on the Floorplan */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto z-10">
                  {floorAssets.length === 0 ? (
                    <div className="col-span-3 text-center text-xs text-zinc-500 py-12">
                      Nenhum ativo crítico parametrizado neste piso.
                    </div>
                  ) : (
                    floorAssets.map((asset) => {
                      const isSelected = selectedAsset.id === asset.id;
                      const hasAlert = asset.status === 'ALERTA' || asset.status === 'CRITICO';

                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAssetId(asset.id)}
                          className={`relative p-3 rounded-xl cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30 shadow-lg scale-105'
                              : hasAlert
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/50 text-amber-200'
                              : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300'
                          }`}
                        >
                          {/* Pulsating status point */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono font-bold">{asset.code}</span>
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                hasAlert ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                hasAlert ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                            </span>
                          </div>

                          <h5 className="text-[11px] font-bold truncate leading-tight">{asset.name}</h5>
                          <p className="text-[9px] text-zinc-400 truncate mt-0.5">{asset.location}</p>

                          {/* Quick Sensor Value */}
                          {asset.sensors[0] && (
                            <div className="mt-2 pt-1.5 border-t border-zinc-800 flex justify-between text-[10px] font-mono">
                              <span className="text-zinc-500">{asset.sensors[0].type.slice(0, 4)}:</span>
                              <span className={hasAlert ? 'text-amber-300 font-bold' : 'text-cyan-300'}>
                                {asset.sensors[0].value} {asset.sensors[0].unit}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                  <span>ACESSO PRINCIPAL</span>
                  <span>QUADRO GERAL QDF</span>
                  <span>RESERVA TÉCNICA</span>
                </div>

              </div>

            </div>

            {/* Blueprint Footer */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <span className="font-mono text-[11px]">
                Ativo Selecionado: <strong className="text-cyan-300">{selectedAsset.code}</strong>
              </span>
              <button
                onClick={() => onSelectAsset(selectedAsset)}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
              >
                Ficha Técnica <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Col (4 cols): Live Telemetry Gauges & Predictive OS Trigger */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl">
            
            {/* Header of Active Asset */}
            <div className="pb-3 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400">{selectedAsset.code}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  selectedAsset.status === 'ALERTA' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedAsset.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100 leading-snug">
                {selectedAsset.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedAsset.brand} {selectedAsset.model} | {selectedAsset.location}
              </p>
            </div>

            {/* Telemetry Sensor Gauges */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Sensores de Telemetria em Tempo Real
              </h4>

              {selectedAsset.sensors.map((sensor) => {
                const isWarning = sensor.status === 'WARNING' || sensor.status === 'ALARM';
                const percentage = Math.min(100, Math.max(0, ((sensor.value - sensor.minThreshold) / (sensor.maxThreshold - sensor.minThreshold)) * 100));

                return (
                  <div
                    key={sensor.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isWarning
                        ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{sensor.label}</span>
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className={`text-base font-bold ${isWarning ? 'text-amber-300' : 'text-cyan-300'}`}>
                          {sensor.value}
                        </span>
                        <span className="text-xs text-zinc-400">{sensor.unit}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 my-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Min: {sensor.minThreshold} {sensor.unit}</span>
                      <span>Max Seguro: {sensor.maxThreshold} {sensor.unit}</span>
                    </div>

                    {isWarning && (
                      <div className="mt-2 pt-2 border-t border-amber-500/30 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Limiar Excedido
                        </span>
                        <button
                          onClick={() => onCreatePredictiveOS(selectedAsset, sensor)}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-bold transition-colors"
                        >
                          Disparar OS Preditiva
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Diagnostics CTA */}
            <div className="pt-2">
              <button
                onClick={() => onOpenCopilot(`Avalie o ativo ${selectedAsset.name} localizado em ${selectedAsset.location} com especificações ${JSON.stringify(selectedAsset.specifications)}`, selectedAsset)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-zinc-950" />
                <span>Diagnosticar com Copilot IA</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
