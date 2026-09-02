'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FileJson, 
  Printer, 
  Share2
} from 'lucide-react';
import { ConversationSession } from '@/types/conversation';
import { ConversationHelper } from '@/lib/conversationParser';

interface ExportModalProps {
  session: ConversationSession;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({
  session,
  isOpen,
  onClose,
}: ExportModalProps) {
  const [format, setFormat] = useState<'markdown' | 'json' | 'text'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = ConversationHelper.exportToMarkdown(session);
  const jsonContent = JSON.stringify(session, null, 2);

  const getExportText = () => {
    if (format === 'markdown') return markdownContent;
    if (format === 'json') return jsonContent;
    return session.messages
      .map((m) => `[${m.role.toUpperCase()}] (${m.timestamp})\n${m.content}`)
      .join('\n\n---\n\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportText();
    const ext = format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt';
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-[#27272A] bg-[#09090B] text-[#FAFAFA] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4 bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46]">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAFAFA]">
                Export & Share Transcript
              </h2>
              <p className="text-xs text-[#71717A]">
                Download formatted Markdown, OpenAI JSON, or printable document
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

        {/* Format Selector */}
        <div className="flex items-center justify-between border-b border-[#27272A] bg-[#141417] px-5 py-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
                format === 'markdown'
                  ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
                format === 'json'
                  ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              <FileJson className="h-3.5 w-3.5 text-amber-400" />
              <span>JSON (.json)</span>
            </button>

            <button
              onClick={() => setFormat('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
                format === 'text'
                  ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                  : 'text-[#71717A] hover:text-[#FAFAFA]'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Plain Text</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print View</span>
          </button>
        </div>

        {/* Preview code area */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#0F0F12]">
          <pre className="h-full w-full rounded-xl border border-[#27272A] bg-[#09090B] p-4 font-mono text-xs text-[#D4D4D8] leading-relaxed overflow-x-auto select-all">
            <code>{getExportText()}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#27272A] px-5 py-3 bg-[#18181B]">
          <span className="text-xs text-[#71717A]">
            {session.messages.length} conversation turns ready
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#141417] px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#38BDF8] px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
