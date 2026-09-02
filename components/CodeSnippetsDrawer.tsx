'use client';

import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FileCode, 
  FolderDown,
  Terminal
} from 'lucide-react';
import { ExtractedCodeSnippet } from '@/lib/conversationParser';

interface CodeSnippetsDrawerProps {
  snippets: ExtractedCodeSnippet[];
  isOpen: boolean;
  onClose: () => void;
  onScrollToMessage: (msgId: string) => void;
}

export function CodeSnippetsDrawer({
  snippets,
  isOpen,
  onClose,
  onScrollToMessage,
}: CodeSnippetsDrawerProps) {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const languages = Array.from(new Set(snippets.map((s) => s.language)));

  const filtered = snippets.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      (s.fileName && s.fileName.toLowerCase().includes(search.toLowerCase())) ||
      s.language.toLowerCase().includes(search.toLowerCase());
    const matchesLang = selectedLang === 'all' || s.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSnippet = (s: ExtractedCodeSnippet) => {
    const blob = new Blob([s.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = s.fileName || `snippet_${s.id}.${s.language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllAsMarkdown = () => {
    let combined = `# Extracted Code Repository Artifacts\n\n`;
    snippets.forEach((s) => {
      combined += `## File: ${s.fileName || s.id}\n`;
      combined += `Language: \`${s.language}\` | Extracted from Turn ${s.messageIndex + 1}\n\n`;
      combined += `\`\`\`${s.language}\n${s.code}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([combined], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codex-code-bundle-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-2xl flex-col bg-[#09090B] text-[#FAFAFA] border-l border-[#27272A] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4 bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46]">
              <FileCode className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAFAFA]">
                Extracted Code Artifacts
              </h2>
              <p className="text-xs text-[#71717A]">
                {snippets.length} code blocks indexed from session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAllAsMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#141417] px-2.5 py-1.5 text-xs font-medium text-[#E4E4E7] hover:bg-[#27272A] transition"
              title="Download all code blocks in bundle"
            >
              <FolderDown className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Export All</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#27272A] hover:text-[#FAFAFA] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 border-b border-[#27272A] bg-[#141417] px-5 py-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search code or filenames..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-[#27272A] bg-[#09090B] pl-8 pr-3 py-1 text-xs text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedLang('all')}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                selectedLang === 'all'
                  ? 'bg-[#38BDF8] text-zinc-950 font-bold'
                  : 'bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              All
            </button>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium uppercase font-mono transition ${
                  selectedLang === l
                    ? 'bg-[#38BDF8] text-zinc-950 font-bold'
                    : 'bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0F0F12]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#71717A] text-xs text-center">
              <Code2 className="h-8 w-8 mb-2 opacity-40 text-[#38BDF8]" />
              <p>No code snippets found matching your query.</p>
            </div>
          ) : (
            filtered.map((snippet) => (
              <div
                key={snippet.id}
                className="overflow-hidden rounded-xl border border-[#27272A] bg-[#09090B] text-[#FAFAFA] shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#27272A] bg-[#18181B] px-3.5 py-2 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="rounded bg-[#27272A] text-[#38BDF8] border border-[#3F3F46] px-1.5 py-0.5 text-[10px] uppercase font-semibold">
                      {snippet.language}
                    </span>
                    <span className="font-semibold text-[#FAFAFA] truncate">
                      {snippet.fileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onScrollToMessage(snippet.messageId);
                        onClose();
                      }}
                      className="text-[11px] text-[#A1A1AA] hover:text-[#38BDF8] transition"
                      title="Jump to message turn"
                    >
                      Turn #{snippet.messageIndex + 1}
                    </button>
                    <button
                      onClick={() => handleCopy(snippet.id, snippet.code)}
                      className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] transition"
                      title="Copy snippet"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadSnippet(snippet)}
                      className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] transition"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <pre className="max-h-72 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#D4D4D8] bg-[#09090B]">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
