'use client';

import React from 'react';
import { 
  Folder, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Clock, 
  Tag, 
  Layers, 
  ChevronRight,
  HardDrive,
  Hash,
  Database,
  Sliders,
  FileCode2,
  Cpu
} from 'lucide-react';
import { ConversationSession } from '@/types/conversation';

interface SidebarProps {
  sessions: ConversationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onOpenLoadModal: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onOpenLoadModal,
  onDeleteSession,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#27272A] bg-[#09090B] text-[#FAFAFA] transition-transform duration-200 md:static md:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#27272A] px-4 bg-[#09090B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#38BDF8] text-zinc-950 font-black text-[11px] tracking-tighter shadow-sm">
              ZX
            </div>
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-[#FAFAFA] font-bold">
                ZX 360º
              </h2>
              <p className="text-[9px] text-[#71717A] font-mono">WORKSPACE 2026-09-01</p>
            </div>
          </div>

          <button
            onClick={onOpenLoadModal}
            className="flex h-6 w-6 items-center justify-center rounded bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] border border-[#27272A] transition"
            title="Import / Load Path"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Explorer Sections Navigation */}
        <nav className="p-2 flex flex-col gap-0.5 border-b border-[#27272A] text-xs">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#18181B] text-[#FAFAFA] border border-[#27272A]/50">
            <div className="w-1 h-3.5 bg-[#38BDF8] rounded-full"></div>
            <span className="font-medium text-[11px]">Archive Viewer</span>
            <span className="ml-auto text-[9px] font-mono bg-[#27272A] text-[#38BDF8] px-1.5 py-0.2 rounded">LIVE</span>
          </div>
          <div 
            onClick={onOpenLoadModal}
            className="flex items-center gap-2.5 px-3 py-1.5 text-[#71717A] text-[11px] hover:text-white hover:bg-[#18181B]/50 rounded cursor-pointer transition"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Code Artifacts</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 text-[#71717A] text-[11px] hover:text-white hover:bg-[#18181B]/50 rounded cursor-pointer transition">
            <Cpu className="h-3.5 w-3.5" />
            <span>Model Weights</span>
          </div>
        </nav>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[9px] font-bold text-[#71717A] uppercase tracking-wider flex items-center justify-between">
            <span>Referenced Archives</span>
            <span className="font-mono text-[9px] text-[#52525B]">{sessions.length}</span>
          </div>

          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess.id);
                  onClose();
                }}
                className={`group relative flex flex-col gap-1 rounded-lg p-2.5 text-xs transition cursor-pointer border ${
                  isActive
                    ? 'border-[#27272A] bg-[#18181B] text-[#FAFAFA] shadow-sm'
                    : 'border-transparent hover:bg-[#18181B]/60 text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {isActive && <div className="w-1 h-3 bg-[#38BDF8] rounded-full shrink-0"></div>}
                    <span className="font-medium text-xs truncate">
                      {sess.title}
                    </span>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#71717A] hover:text-red-400 transition"
                      title="Remove session"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Path indicator */}
                <div className="flex items-center gap-1 text-[10px] text-[#52525B] font-mono truncate pl-0.5">
                  <HardDrive className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{sess.filePath.split(/[\\/]/).pop() || sess.filePath}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[9px] text-[#71717A]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {sess.date.slice(0, 10)}
                  </span>
                  <span className="rounded bg-[#27272A] px-1.5 py-0.2 font-mono text-[#A1A1AA]">
                    {sess.messages.length} turns
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Local Cache & Metrics Bar */}
        <div className="mt-auto p-3.5 border-t border-[#27272A] bg-[#09090B] text-[10px] text-[#52525B]">
          <div className="flex justify-between items-center mb-1">
            <span>LOCAL CACHE</span>
            <span className="font-mono text-[#38BDF8]">84%</span>
          </div>
          <div className="h-1 bg-[#27272A] rounded-full overflow-hidden">
            <div className="h-full bg-[#38BDF8] w-[84%] transition-all duration-500"></div>
          </div>
          <div className="mt-2 text-[9px] text-[#52525B] truncate font-mono">
            SYS: AES-256 ENCRYPTED
          </div>
        </div>
      </aside>
    </>
  );
}
