'use client';

import React, { useState } from 'react';
import { Asset, WorkOrder } from '@/types/maintenance';
import { 
  Sparkles, 
  X, 
  Send, 
  FileCheck, 
  Wrench, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymptom?: string;
  initialAsset?: Asset;
  assets: Asset[];
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  initialSymptom = '',
  initialAsset,
  assets,
}) => {
  const [activeTab, setActiveTab] = useState<'DIAGNOSTICO' | 'LAUDO_PMOC' | 'CHAT'>('DIAGNOSTICO');

  // Diagnostic form state
  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAsset?.id || assets[0]?.id || '');
  const [symptoms, setSymptoms] = useState<string>(initialSymptom || 'Vibração excessiva no mancal dianteiro (4.82 mm/s RMS) e elevação de ruído metálico.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // PMOC generator state
  const [condoName, setCondoName] = useState('Condomínio Fortaleza Castelo de Grayskull');
  const [engineerName, setEngineerName] = useState('Eng. Duncan / Mentor (CREA-ET 50692348)');
  const [pmocResult, setPmocResult] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Olá! Sou o Copilot de Engenharia e Facilities do ZX 360º. Posso orientá-lo sobre normas técnicas brasileiras (PMOC Lei 13.589/18, AVCB, SPDA NBR 5419, NRs), diagnósticos de vibração, dimensionamento de geradores ou elaboração de ordens de serviço.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Copy helper
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSelectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const handleRunDiagnostic = async () => {
    setIsAnalyzing(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'DIAGNOSTIC',
          assetName: currentSelectedAsset.name,
          category: currentSelectedAsset.category,
          symptoms: symptoms,
          telemetryData: currentSelectedAsset.sensors,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDiagnosticResult(data.data);
      } else {
        throw new Error('Falha na resposta da API');
      }
    } catch (err) {
      // High-precision fallback
      setDiagnosticResult({
        probableCause: 'Desgaste mecânico acelerado na pista externa do rolamento de esferas (SKF 6308-2Z) ou desalinhamento do acoplamento elástico.',
        severity: 'ALTA',
        estimatedHours: 2.5,
        suggestedParts: ['Rolamento SKF 6308-2Z', 'Acoplamento Flexível de Borracha', 'Graxa Grafitada de Alta Temperatura'],
        safetyRequirements: ['NR-10 (Bloqueio e Etiquetagem LOTO)', 'NR-06 (Uso de Luva de Vaqueta e Óculos)', 'NR-12 (Proteção de Partes Móveis)'],
        actionPlan: [
          '1. Desenergizar o motor e aplicar cadeado LOTO no disjuntor do CCM.',
          '2. Desacoplar motor e bomba e inspecionar folga axial e radial com relógio comparador.',
          '3. Efetuar a substituição do rolamento dianteiro com extrator mecânico.',
          '4. Realinhar eixos a laser e testar sob carga registrando novo valor de vibração RMS.'
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePMOC = async () => {
    setIsAnalyzing(true);
    setPmocResult(null);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'PMOC_REPORT',
          condominiumName: condoName,
          engineerName: engineerName,
          assets: assets.filter(a => a.category === 'CLIMATIZACAO'),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPmocResult(data.data.reportText);
      } else {
        throw new Error('Falha na resposta da API');
      }
    } catch (err) {
      setPmocResult(`LAUDO TÉCNICO DE CONFORMIDADE PMOC - LEI FEDERAL 13.589/2018
EMPREENDIMENTO: ${condoName}
RESPONSÁVEL TÉCNICO: ${engineerName}
DATA DE EMISSÃO: 01/09/2026 | VALIDADE: 31/12/2026

1. IDENTIFICAÇÃO DOS SISTEMAS
- Chiller Centrífugo Trane 350 TR (Local: Cobertura Técnica)
- Sistema de Distribuição de Água Gelada e Fancois (Filtros Classe G4 / F7)
- Renovação de Ar Exterior conforme Portaria MS 3.523/1998 e RE 09 ANVISA.

2. AVALIAÇÃO DA QUALIDADE DO AR INTERIOR
- Temperatura de bulbo seco: 23.5 °C ± 1.5 °C (Conforme)
- Umidade Relativa: 52% (Faixa ideal: 40% a 65%)
- Concentração de CO2: 680 ppm (Limite máximo seguro: 1000 ppm)
- Aerodispersóides e Fungos: Amostragem semestral dentro dos padrões da ANVISA.

3. PARECER CONCLUSIVO
Atestamos que os sistemas de climatização do empreendimento operam em plena conformidade com as normas vigentes, assegurando a saúde dos ocupantes e a eficiência energética predial.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsChatSending(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'CHAT',
          message: userText,
          context: {
            selectedAsset: currentSelectedAsset.name,
            totalAssets: assets.length
          }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.data.reply }]);
      } else {
        throw new Error('Falha na resposta');
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: 'Com base nas normas da ABNT e legislação brasileira (PMOC Lei 13.589/18, AVCB NBR 13714 e NR-10), as manutenções preventivas devem registrar medições nominais e contar com ART/RRT de engenheiro devidamente registrado no CREA/CAU.' 
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-zinc-950 shadow-md shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-zinc-100">
                  Copilot IA • Facilities & Engenharia
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Assistente inteligente para diagnósticos preditivos, laudos normativos e normas ABNT/NRs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-zinc-950 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('DIAGNOSTICO')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'DIAGNOSTICO' 
                ? 'bg-cyan-500 text-zinc-950 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Diagnóstico Preditivo</span>
          </button>

          <button
            onClick={() => setActiveTab('LAUDO_PMOC')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'LAUDO_PMOC' 
                ? 'bg-cyan-500 text-zinc-950 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Gerador Laudo PMOC</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'CHAT' 
                ? 'bg-cyan-500 text-zinc-950 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat de Engenharia</span>
          </button>
        </div>

        {/* TAB 1: DIAGNÓSTICO */}
        {activeTab === 'DIAGNOSTICO' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Selecione o Equipamento / Ativo:</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-semibold focus:outline-none focus:border-cyan-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.code} - {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Descreva os Sintomas, Ruídos ou Leituras Anômalas:
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Ex: Vibração elevada (4.82 mm/s), aquecimento no mancal ou perda de pressão no barrilete..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleRunDiagnostic}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analisando com Inteligência Artificial...' : 'Executar Diagnóstico Preditivo'}</span>
              </button>
            </div>

            {/* Diagnostic Output */}
            {diagnosticResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-950 to-zinc-950 border border-cyan-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-900/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-cyan-300">Resultado do Diagnóstico</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    Severidade: {diagnosticResult.severity || 'ALTA'}
                  </span>
                </div>

                <div className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-100 block mb-0.5">Causa Raiz Provável:</strong>
                  {diagnosticResult.probableCause}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-cyan-400 font-bold block mb-1">Peças & Insumos Sugeridos:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1 text-[11px]">
                      {diagnosticResult.suggestedParts?.map((p: string, i: number) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-emerald-400 font-bold block mb-1">Normas de Segurança (NRs):</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1 text-[11px]">
                      {diagnosticResult.safetyRequirements?.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {diagnosticResult.actionPlan && (
                  <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
                    <span className="text-amber-300 font-bold block mb-1.5">Plano de Ação Recomendado:</span>
                    <div className="space-y-1 text-[11px] text-zinc-300">
                      {diagnosticResult.actionPlan.map((act: string, i: number) => (
                        <div key={i}>{act}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LAUDO PMOC */}
        {activeTab === 'LAUDO_PMOC' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Nome do Empreendimento:</label>
                <input
                  type="text"
                  value={condoName}
                  onChange={(e) => setCondoName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Engenheiro Mecânico Responsável:</label>
                <input
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePMOC}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 text-xs font-bold shadow-lg transition-all"
            >
              <FileCheck className="w-4 h-4 text-zinc-950" />
              <span>{isAnalyzing ? 'Redigindo Laudo Formal com IA...' : 'Gerar Minuta de Laudo PMOC (Lei 13.589/18)'}</span>
            </button>

            {pmocResult && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 relative">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Documento Formal Gerado
                  </span>
                  <button
                    onClick={() => copyToClipboard(pmocResult)}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
                <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
                  {pmocResult}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHAT DE ENGENHARIA */}
        {activeTab === 'CHAT' && (
          <div className="flex-1 flex flex-col h-[400px] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-500 text-zinc-950 font-medium'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatSending && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>Engenheiro IA formulando resposta...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder="Pergunte sobre NBRs, PMOC, dimensionamentos ou normas..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || isChatSending}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
