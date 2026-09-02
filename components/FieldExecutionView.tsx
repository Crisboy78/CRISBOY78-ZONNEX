'use client';

import React, { useState, useRef } from 'react';
import { WorkOrder, Asset, UserRole } from '@/types/maintenance';
import { 
  Wrench, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PenTool, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  UploadCloud,
  FileCheck,
  ChevronDown,
  Navigation,
  Mic,
  MicOff,
  Zap,
  Volume2
} from 'lucide-react';
import { sounds } from '@/lib/soundEffects';

interface FieldExecutionViewProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  userRole: UserRole;
  activeWorkOrderId?: string;
  isOnline?: boolean;
  onCompleteWorkOrder: (woId: string, signatureData: { name: string; document: string; signatureBase64: string; gpsCoordinates?: string }) => void;
  onOpenCopilot: () => void;
  onOpenGPSModal?: () => void;
}

export const FieldExecutionView: React.FC<FieldExecutionViewProps> = ({
  workOrders,
  assets,
  userRole,
  activeWorkOrderId,
  isOnline = true,
  onCompleteWorkOrder,
  onOpenCopilot,
  onOpenGPSModal,
}) => {
  const [selectedWoId, setSelectedWoId] = useState<string>(
    activeWorkOrderId || workOrders.find(w => w.status === 'EM_ANDAMENTO')?.id || workOrders[0]?.id
  );

  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'FOTOS' | 'ASSINATURA'>('CHECKLIST');
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [qrScanSuccess, setQrScanSuccess] = useState(false);
  const [photoBeforeAdded, setPhotoBeforeAdded] = useState(false);
  const [photoAfterAdded, setPhotoAfterAdded] = useState(false);

  // Voice note
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string>('');

  // Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signerName, setSignerName] = useState('Rei Randor (Síndico Geral)');
  const [signerDoc, setSignerDoc] = useState('CPF: 123.456.789-00');

  // Active WO
  const currentWo = workOrders.find(w => w.id === selectedWoId) || workOrders[0];
  const relatedAsset = assets.find(a => a.id === currentWo?.assetId);

  // Simulated checklist local state
  const [checklistItems, setChecklistItems] = useState(currentWo?.checklist || []);

  const handleToggleChecklist = (itemId: string) => {
    sounds.playClick();
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleMeasurementChange = (itemId: string, val: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, measuredValue: val } : item
    ));
  };

  const handleToggleVoiceNote = () => {
    if (isRecordingVoice) {
      sounds.playSuccessFanfare();
      setIsRecordingVoice(false);
    } else {
      sounds.playClick();
      setIsRecordingVoice(true);
      setTimeout(() => {
        setVoiceNote('Inspeção realizada conforme norma ABNT NBR 5674 e Lei 13.589/18. Tensão e amperagem balanceadas sem desvios.');
      }, 2000);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#22d3ee'; // cyan
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleFinishOS = () => {
    if (!hasSignature) {
      sounds.playAlarm();
      setActiveTab('ASSINATURA');
      return;
    }

    sounds.playSuccessFanfare();
    onCompleteWorkOrder(currentWo.id, {
      name: signerName,
      document: signerDoc,
      signatureBase64: 'data:image/png;base64,simulated_touch_signature',
      gpsCoordinates: '-23.587416, -46.681532 (Precisão ±4.2m)'
    });
  };

  const simulateQRScan = () => {
    sounds.playClick();
    setIsScanningQR(true);
    setTimeout(() => {
      sounds.playScanBeep();
      setIsScanningQR(false);
      setQrScanSuccess(true);
      setTimeout(() => setQrScanSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-16">
      
      {/* Field Execution Header */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-zinc-100">
                Execução em Campo 4.0
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                MODO TÉCNICO
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Operação 100% autônoma em subsolos e áreas sem sinal. Sincronização automática via internet.
            </p>
          </div>
        </div>

        {/* QR Code Scanner Button */}
        <button
          onClick={simulateQRScan}
          disabled={isScanningQR}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>{isScanningQR ? 'Lendo QR Code...' : 'Escanear QR do Ativo'}</span>
        </button>
      </div>

      {/* Network & Local Storage Operational Banner */}
      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono ${
        !isOnline 
          ? 'bg-blue-950/80 border-blue-600/40 text-blue-200' 
          : 'bg-slate-900/80 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
              <span className="font-bold text-sky-300">MODO LOCAL ATIVO (SEM INTERNET):</span>
              <span className="text-slate-300">Checklists, fotos e laudos estão sendo salvos no dispositivo e serão transmitidos assim que houver rede.</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span className="font-semibold text-blue-300">REDE ATIVA:</span>
              <span className="text-slate-300">Dados sendo salvos e transmitidos em tempo real para o servidor via internet.</span>
            </>
          )}
        </div>
      </div>

      {/* QR Scan Success Alert */}
      {qrScanSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>QR Code validado com sucesso! Ativo <strong>{relatedAsset?.name} ({relatedAsset?.code})</strong> reconhecido em <strong>{relatedAsset?.location}</strong>.</span>
        </div>
      )}

      {/* Select Active Work Order dropdown */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-zinc-300 uppercase font-mono shrink-0">
          OS em Execução:
        </span>
        <select
          value={selectedWoId}
          onChange={(e) => {
            setSelectedWoId(e.target.value);
            const targetWo = workOrders.find(w => w.id === e.target.value);
            if (targetWo) setChecklistItems(targetWo.checklist);
          }}
          className="w-full max-w-md px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-cyan-500 truncate"
        >
          {workOrders.map((wo) => (
            <option key={wo.id} value={wo.id}>
              {wo.code}: {wo.title} ({wo.priority})
            </option>
          ))}
        </select>
      </div>

      {/* Current OS Summary Card */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-cyan-400">{currentWo.code}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {currentWo.category}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {currentWo.status}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-100">{currentWo.title}</h2>
          </div>

          <div className="text-left sm:text-right text-xs text-zinc-400 font-mono">
            <div>Local: <strong className="text-zinc-200">{relatedAsset?.location || 'Área Técnica'}</strong></div>
            <div>Ativo: <strong className="text-cyan-300">{relatedAsset?.code} - {relatedAsset?.name}</strong></div>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {currentWo.description}
        </p>
      </div>

      {/* Tabs Switcher: Checklist, Fotos, Assinatura */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
        <button
          onClick={() => setActiveTab('CHECKLIST')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'CHECKLIST' 
              ? 'bg-cyan-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>1. Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('FOTOS')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'FOTOS' 
              ? 'bg-cyan-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>2. Fotos & Evidências</span>
        </button>

        <button
          onClick={() => setActiveTab('ASSINATURA')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ASSINATURA' 
              ? 'bg-cyan-500 text-zinc-950 shadow-md' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>3. Assinatura Digital</span>
        </button>
      </div>

      {/* TAB 1: CHECKLIST */}
      {activeTab === 'CHECKLIST' && (
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Itens Normativos do Procedimento Técnico
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              {checklistItems.filter(i => i.checked).length}/{checklistItems.length} executados
            </span>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div 
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.checked 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-200' 
                    : 'bg-zinc-950/70 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        item.checked ? 'bg-emerald-500 text-zinc-950 font-bold' : 'border border-zinc-700 bg-zinc-900 hover:border-cyan-400'
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100">{item.title}</span>
                        {item.required && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            OBRIGATÓRIO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">{item.description}</p>
                      
                      {/* Measurement input */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400">Medição / Valor Coletado:</span>
                        <input
                          type="text"
                          value={item.measuredValue || ''}
                          onChange={(e) => handleMeasurementChange(item.id, e.target.value)}
                          placeholder="Ex: 4.82 mm/s RMS ou 6.8 °C"
                          className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 w-48"
                        />
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                    {item.normativeRef}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              onClick={() => setActiveTab('FOTOS')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all"
            >
              Avançar para Fotos & Evidências →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: FOTOS & EVIDENCIAS */}
      {activeTab === 'FOTOS' && (
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              Registro Fotográfico Georreferenciado
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              GPS: -23.5505, -46.6333 (São Paulo, SP)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Foto Antes */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">1. Foto do Equipamento (Antes)</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playScanBeep();
                  setPhotoBeforeAdded(!photoBeforeAdded);
                }}
                className={`w-full relative h-44 rounded-lg border flex flex-col items-center justify-center text-center p-3 overflow-hidden transition-all ${
                  photoBeforeAdded 
                    ? 'bg-zinc-900 border-cyan-500/50' 
                    : 'bg-zinc-900/60 border-dashed border-zinc-700 hover:border-cyan-500/50'
                }`}
              >
                {photoBeforeAdded ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-cyan-300">Evidência Fotográfica Registrada</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Chiller_Condensador_01_raw.jpg (2.4MB)</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-zinc-600 mb-1" />
                    <span className="text-xs text-zinc-400 font-medium">Toque para capturar foto</span>
                    <span className="text-[10px] text-zinc-500 mt-1">Carimbo de data/hora e GPS embutidos</span>
                  </>
                )}
              </button>
              <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
                <span>Timestamp: 01/09/2026 14:30:15</span>
                <span>GPS: -23.5874, -46.6815</span>
              </div>
            </div>

            {/* Foto Depois */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block">2. Foto do Equipamento (Depois do Reparo)</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playScanBeep();
                  setPhotoAfterAdded(!photoAfterAdded);
                }}
                className={`w-full relative h-44 rounded-lg border flex flex-col items-center justify-center text-center p-3 overflow-hidden transition-all ${
                  photoAfterAdded 
                    ? 'bg-zinc-900 border-emerald-500/50' 
                    : 'bg-zinc-900/60 border-dashed border-emerald-500/40 hover:border-emerald-400'
                }`}
              >
                {photoAfterAdded ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-300">Foto Conclusiva Homologada</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Chiller_Reparo_Final_01.jpg (2.8MB)</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-emerald-500 mb-1" />
                    <span className="text-xs text-emerald-300 font-medium">Toque para capturar foto final</span>
                    <span className="text-[10px] text-zinc-500 mt-1">Evidência de conclusão do serviço</span>
                  </>
                )}
              </button>
              <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
                <span>Timestamp: 01/09/2026 15:45:22</span>
                <span>GPS: -23.5874, -46.6815</span>
              </div>
            </div>

          </div>

          {/* Voice Memo Record section */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                Nota de Voz do Técnico (Transcrição Automática)
              </span>
              <button
                type="button"
                onClick={handleToggleVoiceNote}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecordingVoice ? 'Gravando áudio...' : 'Gravar Nota de Voz'}</span>
              </button>
            </div>

            {voiceNote ? (
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between gap-2">
                <p className="italic font-mono text-[11px]">&quot;{voiceNote}&quot;</p>
                <button
                  type="button"
                  onClick={() => sounds.playVoiceBeep()}
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-cyan-400 shrink-0"
                  title="Ouvir áudio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500">
                Grave um resumo em áudio para anexar ao laudo da OS e alimentar o histórico do Gêmeo Digital.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-between">
            <button
              onClick={() => setActiveTab('CHECKLIST')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              ← Voltar ao Checklist
            </button>
            <button
              onClick={() => setActiveTab('ASSINATURA')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all"
            >
              Avançar para Assinatura →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ASSINATURA DIGITAL */}
      {activeTab === 'ASSINATURA' && (
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <PenTool className="w-4 h-4 text-cyan-400" />
              Coleta de Assinatura Digital do Síndico / Zelador
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Validade Jurídica MP 2.200-2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nome do Signatário:</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Documento (CPF / RG / CREA):</label>
              <input
                type="text"
                value={signerDoc}
                onChange={(e) => setSignerDoc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Touch Canvas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Assine no retângulo abaixo (com o dedo ou caneta touch):</span>
              <button
                onClick={clearSignature}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar Assinatura
              </button>
            </div>

            <div className="relative rounded-xl border border-dashed border-cyan-500/50 bg-zinc-950 p-1">
              <canvas
                ref={canvasRef}
                width={700}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 bg-zinc-950 rounded-lg cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-zinc-600 text-xs font-mono">
                  [ Toque ou arraste aqui para assinar ]
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('FOTOS')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              ← Voltar às Fotos
            </button>

            <button
              onClick={handleFinishOS}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 text-xs font-extrabold shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-zinc-950" />
              <span>FINALIZAR ORDEM DE SERVIÇO & GERAR LAUDO</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
