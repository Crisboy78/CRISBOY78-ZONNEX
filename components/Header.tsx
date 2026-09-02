'use client';

import React from 'react';
import { 
  Terminal, 
  FileCode, 
  Sparkles, 
  Download, 
  FolderSearch, 
  Search, 
  Bookmark, 
  Moon, 
  Sun, 
  ExternalLink,
  Cpu,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { ConversationSession } from '@/types/conversation';

interface HeaderProps {
  session: ConversationSession;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCodeDrawer: () => void;
  onOpenReferencesDrawer: () => void;
  onOpenAIModal: () => void;
  onOpenExportModal: () => void;
  onOpenLoadModal: () => void;
  codeCount: number;
  refCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({
  session,
  searchQuery,
  onSearchChange,
  onOpenCodeDrawer,
  onOpenReferencesDrawer,
  onOpenAIModal,
  onOpenExportModal,
  onOpenLoadModal,
  codeCount,
  refCount,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  // Parse path elements for top breadcrumbs
  const pathParts = session.filePath.replace(/\\/g, '/').split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 border-b border-[#27272A] bg-[#18181B] text-[#FAFAFA] transition-colors shrink-0">
      {/* Top System Ribbon */}
      <div className="flex h-11 items-center justify-between px-4 sm:px-6 border-b border-[#27272A]/70 text-xs bg-[#141417]">
        {/* Breadcrumb Path Navigator */}
        <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] overflow-x-auto py-1 scrollbar-none">
          <span className="bg-[#27272A] px-2 py-0.5 rounded font-mono text-[11px] text-[#FAFAFA] shrink-0">
            {pathParts[0] || 'C:'}
          </span>
          {pathParts.slice(1, -1).map((part, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[#52525B]">/</span>
              <span className="shrink-0 hover:text-white transition cursor-default">
                {part === 'Codex' ? <span className="text-[#38BDF8] font-medium">{part}</span> : part}
              </span>
            </React.Fragment>
          ))}
          {pathParts.length > 1 && (
            <>
              <span className="text-[#52525B]">/</span>
              <span className="shrink-0 text-[#38BDF8] font-mono text-[11px] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20">
                {pathParts[pathParts.length - 1]}
              </span>
            </>
          )}
        </div>

        {/* Sync & Live Health Indicators */}
        <div className="flex items-center gap-3 shrink-0 pl-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#A1A1AA]">
              System Sync: Active
            </span>
          </div>
          <span className="text-[#3F3F46]">|</span>
          <span className="px-2 py-0.5 bg-[#27272A] border border-[#3F3F46] text-[10px] rounded text-[#38BDF8] font-mono">
            REF_LOG_V1
          </span>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46] shadow-sm shrink-0">
            <Terminal className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded bg-[#27272A] px-2 py-0.5 text-[11px] font-mono text-[#38BDF8] border border-[#3F3F46]">
                <Cpu className="h-3 w-3" />
                {session.model}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#27272A] px-2 py-0.5 text-[11px] font-mono text-[#A1A1AA] border border-[#3F3F46]">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                {session.platform}
              </span>
              <span className="text-[11px] text-[#71717A] italic">
                {session.date}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-medium text-[#F4F4F5] tracking-tight truncate mt-0.5">
              {session.title}
            </h1>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-44 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search session turns..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-[#27272A] bg-[#09090B] pl-8 pr-3 py-1.5 text-xs text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#38BDF8] focus:outline-none transition"
            />
          </div>

          <button
            id="btn-load-path"
            onClick={onOpenLoadModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] px-3 py-1.5 text-xs font-medium text-[#E4E4E7] transition shadow-xs"
            title="Load custom file or paste directory path"
          >
            <FolderSearch className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Open Path</span>
          </button>

          <button
            id="btn-code-artifacts"
            onClick={onOpenCodeDrawer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] px-3 py-1.5 text-xs font-medium text-[#E4E4E7] transition shadow-xs"
          >
            <FileCode className="h-3.5 w-3.5 text-emerald-400" />
            <span>Code ({codeCount})</span>
          </button>

          <button
            id="btn-references"
            onClick={onOpenReferencesDrawer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] px-3 py-1.5 text-xs font-medium text-[#E4E4E7] transition shadow-xs"
          >
            <Layers className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Citations ({refCount})</span>
          </button>

          <button
            id="btn-ai-insights"
            onClick={onOpenAIModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-sm transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Intelligence</span>
          </button>

          <button
            id="btn-export-session"
            onClick={onOpenExportModal}
            className="inline-flex items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] p-2 text-xs font-medium text-[#E4E4E7] transition"
            title="Export conversation"
          >
            <Download className="h-3.5 w-3.5 text-[#A1A1AA]" />
          </button>
        </div>
      </div>
    </header>
  );
}
