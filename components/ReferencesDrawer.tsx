'use client';

import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  HardDrive, 
  Link2, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  Code
} from 'lucide-react';
import { CitationReference } from '@/types/conversation';

interface ReferencesDrawerProps {
  references: CitationReference[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReferencesDrawer({
  references,
  isOpen,
  onClose,
}: ReferencesDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filePaths = references.filter((r) => r.type === 'filepath');
  const urls = references.filter((r) => r.type === 'url');
  const docsAndOthers = references.filter((r) => r.type !== 'filepath' && r.type !== 'url');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-lg flex-col bg-[#09090B] text-[#FAFAFA] border-l border-[#27272A] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4 bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAFAFA]">
                Referenced Paths & Citations
              </h2>
              <p className="text-xs text-[#71717A]">
                {references.length} references detected across conversation
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

        {/* References List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0F0F12]">
          {/* File Paths & Local Workspaces */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2.5 flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Referenced File Paths ({filePaths.length})</span>
            </h3>
            <div className="space-y-2">
              {filePaths.map((ref) => (
                <div
                  key={ref.id}
                  className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 text-xs flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#FAFAFA] font-mono text-[11px]">
                      {ref.label}
                    </span>
                    <button
                      onClick={() => handleCopy(ref.id, ref.value)}
                      className="p-1 text-[#71717A] hover:text-[#FAFAFA]"
                      title="Copy path"
                    >
                      {copiedId === ref.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-[#38BDF8] select-all bg-[#09090B] p-2 rounded border border-[#27272A] break-all">
                    {ref.value}
                  </div>
                  {ref.contextSnippet && (
                    <p className="text-[11px] text-[#71717A] italic mt-0.5">
                      {ref.contextSnippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* URLs & Web Links */}
          {urls.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2.5 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span>Web Links & Documentation ({urls.length})</span>
              </h3>
              <div className="space-y-2">
                {urls.map((ref) => (
                  <div
                    key={ref.id}
                    className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#FAFAFA] truncate">
                        {ref.label}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate font-mono">
                        {ref.value}
                      </div>
                    </div>
                    <a
                      href={ref.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#71717A] hover:text-[#38BDF8] transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs & Documentation Citations */}
          {docsAndOthers.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2.5 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Specifications & Symbols ({docsAndOthers.length})</span>
              </h3>
              <div className="space-y-2">
                {docsAndOthers.map((ref) => (
                  <div
                    key={ref.id}
                    className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 text-xs"
                  >
                    <span className="font-semibold text-[#FAFAFA]">
                      {ref.label}:
                    </span>{' '}
                    <span className="text-[#A1A1AA] font-mono text-[11px]">
                      {ref.value}
                    </span>
                    {ref.contextSnippet && (
                      <p className="text-[11px] text-[#71717A] mt-1">
                        {ref.contextSnippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
