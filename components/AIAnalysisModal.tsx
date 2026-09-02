'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, 
  Sparkles, 
  ListChecks, 
  FileText, 
  Cpu, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  GitFork,
  ArrowRight
} from 'lucide-react';
import { ConversationSession, ConversationTurn } from '@/types/conversation';

interface AIAnalysisModalProps {
  session: ConversationSession;
  isOpen: boolean;
  onClose: () => void;
  onAppendTurn: (newTurn: ConversationTurn) => void;
  initialPrompt?: string;
}

export function AIAnalysisModal({
  session,
  isOpen,
  onClose,
  onAppendTurn,
  initialPrompt,
}: AIAnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'action_items' | 'architecture' | 'ask'>('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [askInput, setAskInput] = useState(initialPrompt || '');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const runAnalysis = async (action: string, customPrompt?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          messages: session.messages,
          prompt: customPrompt || askInput,
          conversationTitle: session.title,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate analysis.');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'summary' | 'action_items' | 'architecture' | 'ask') => {
    setActiveTab(tab);
    setResult('');
    if (tab !== 'ask') {
      runAnalysis(tab);
    }
  };

  const handleForkAndContinue = () => {
    if (!result) return;
    const newTurn: ConversationTurn = {
      id: `gemini-fork-${Date.now()}`,
      role: 'assistant',
      content: result,
      timestamp: new Date().toLocaleTimeString(),
      model: 'gemini-3.7-flash',
      tokenCount: Math.ceil(result.length / 4),
      bookmarked: true,
      notes: 'Generated via Gemini AI Analysis Hub fork.',
    };
    onAppendTurn(newTurn);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-[#27272A] bg-[#09090B] text-[#FAFAFA] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-6 py-4 bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#FAFAFA]">
                  Gemini AI Transcript Intelligence
                </h2>
                <span className="rounded bg-[#27272A] px-2 py-0.5 text-[10px] font-mono text-[#38BDF8] border border-[#3F3F46]">
                  gemini-3.7-flash
                </span>
              </div>
              <p className="text-xs text-[#71717A] truncate max-w-md">
                Analyzing {session.messages.length} turns in &quot;{session.title}&quot;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#27272A] hover:text-[#FAFAFA] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1 border-b border-[#27272A] bg-[#141417] px-6 py-2.5 overflow-x-auto">
          <button
            onClick={() => handleTabChange('summary')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'summary'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Executive Briefing</span>
          </button>

          <button
            onClick={() => handleTabChange('action_items')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'action_items'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]'
            }`}
          >
            <ListChecks className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sprint Action Items</span>
          </button>

          <button
            onClick={() => handleTabChange('architecture')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'architecture'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]'
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>Architecture & DAG</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ask');
              setResult('');
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'ask'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Ask / Fork Turn</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0F0F12]">
          {activeTab === 'ask' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#A1A1AA]">
                Ask Gemini to clarify, review code, or continue this referenced conversation:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. How do we add redis distributed locking to this orchestrator?"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && askInput.trim()) {
                      runAnalysis('ask', askInput);
                    }
                  }}
                  className="flex-1 rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2 text-xs text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  disabled={loading || !askInput.trim()}
                  onClick={() => runAnalysis('ask', askInput)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#38BDF8] px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Generate</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-[#71717A] space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
              <p className="text-xs font-medium">Analyzing transcript with Gemini 3.7 Flash...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-4 text-xs text-red-300">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Render Result */}
          {result && !loading && (
            <div className="rounded-xl border border-[#27272A] bg-[#09090B] p-5 text-[#FAFAFA] text-sm leading-relaxed space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  Generated Analysis
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleForkAndContinue}
                    className="inline-flex items-center gap-1.5 rounded bg-[#38BDF8] px-2.5 py-1 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] shadow-xs transition"
                    title="Append this response to the active conversation"
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    <span>Fork into Chat</span>
                  </button>
                </div>
              </div>

              <div className="prose prose-sm prose-invert max-w-none text-xs sm:text-sm text-[#D4D4D8]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {!result && !loading && activeTab !== 'ask' && (
            <div className="flex flex-col items-center justify-center py-12 text-[#71717A] text-xs">
              <Sparkles className="h-8 w-8 mb-2 opacity-40 text-[#38BDF8]" />
              <p>Click below to generate instant architectural insights.</p>
              <button
                onClick={() => runAnalysis(activeTab)}
                className="mt-3 rounded-lg bg-[#38BDF8] text-zinc-950 font-bold px-4 py-2 text-xs hover:bg-[#0284C7] transition"
              >
                Start Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
