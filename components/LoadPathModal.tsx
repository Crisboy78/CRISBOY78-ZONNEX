'use client';

import React, { useState } from 'react';
import { 
  X, 
  FolderSearch, 
  Upload, 
  FileText, 
  HardDrive, 
  Check, 
  Code2,
  FileJson
} from 'lucide-react';
import { ConversationHelper } from '@/lib/conversationParser';
import { ConversationSession } from '@/types/conversation';

interface LoadPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSession: (session: ConversationSession) => void;
}

export function LoadPathModal({
  isOpen,
  onClose,
  onImportSession,
}: LoadPathModalProps) {
  const [tab, setTab] = useState<'path' | 'paste' | 'upload'>('path');
  const [pathInput, setPathInput] = useState('C:\\Users\\Usuario\\Documents\\Codex\\2026-09-01\\referenced-chatgpt-conversation-this-is-an');
  const [sessionTitle, setSessionTitle] = useState('Referenced Codex Session');
  const [rawText, setRawText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleLoadPath = () => {
    if (!pathInput.trim()) return;

    // Create session from path
    const fileName = pathInput.split(/[\\/]/).pop() || 'referenced-conversation';
    const newSession: ConversationSession = {
      id: `session-path-${Date.now()}`,
      title: sessionTitle || fileName.replace(/[-_]/g, ' '),
      filePath: pathInput,
      date: new Date().toISOString().slice(0, 10),
      platform: 'Codex',
      model: 'gpt-4o-codex-2026',
      tags: ['Local Workspace', 'Referenced Path'],
      messages: [
        {
          id: 'turn-init-1',
          role: 'system',
          content: `Imported reference path: \`${pathInput}\`\nWorkspace active. Session ready for inspection.`,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: 'turn-user-1',
          role: 'user',
          content: `Loaded session logs from \`${pathInput}\`. Analyze the primary module dependencies and state contracts.`,
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: 'turn-ast-1',
          role: 'assistant',
          content: `### Session Index Initialized for: \`${fileName}\`\n\n- **Target Path:** \`${pathInput}\`\n- **Status:** Ready for analysis\n- **Action:** Use the AI Insights & Fork tool or Ask Gemini to inspect specific components.`,
          timestamp: new Date().toLocaleTimeString(),
          model: 'gpt-4o-codex-2026',
        },
      ],
    };

    onImportSession(newSession);
    onClose();
  };

  const handleLoadRawText = () => {
    if (!rawText.trim()) return;
    const session = ConversationHelper.parseFileContent(rawText, sessionTitle || 'Imported Transcript');
    onImportSession(session);
    onClose();
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const session = ConversationHelper.parseFileContent(content, file.name);
        onImportSession(session);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex w-full max-w-xl flex-col rounded-2xl border border-[#27272A] bg-[#09090B] text-[#FAFAFA] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4 bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#38BDF8] border border-[#3F3F46]">
              <FolderSearch className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FAFAFA]">
                Load Referenced Conversation / Path
              </h2>
              <p className="text-xs text-[#71717A]">
                Open local Codex transcript, JSON export, or markdown file
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

        {/* Tab switcher */}
        <div className="flex border-b border-[#27272A] bg-[#141417] px-5 py-2 text-xs">
          <button
            onClick={() => setTab('path')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
              tab === 'path'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <HardDrive className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>File Path</span>
          </button>

          <button
            onClick={() => setTab('paste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
              tab === 'paste'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-blue-400" />
            <span>Paste JSON / Markdown</span>
          </button>

          <button
            onClick={() => setTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition ${
              tab === 'upload'
                ? 'bg-[#27272A] text-[#FAFAFA] border border-[#38BDF8]/50'
                : 'text-[#71717A] hover:text-[#FAFAFA]'
            }`}
          >
            <Upload className="h-3.5 w-3.5 text-emerald-400" />
            <span>Upload File</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 bg-[#0F0F12]">
          {tab === 'path' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Referenced File Path:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={pathInput}
                    onChange={(e) => setPathInput(e.target.value)}
                    placeholder="e.g. C:\Users\Usuario\Documents\Codex\2026-09-01\referenced-chatgpt-conversation-this-is-an"
                    className="w-full font-mono text-xs rounded-lg border border-[#27272A] bg-[#09090B] p-2.5 text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#38BDF8] select-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Session Title (Optional):
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Codex Agent Architecture Session"
                  className="w-full text-xs rounded-lg border border-[#27272A] bg-[#09090B] p-2 text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <button
                onClick={handleLoadPath}
                className="w-full rounded-lg bg-[#38BDF8] py-2 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] transition"
              >
                Load Path into Workspace
              </button>
            </div>
          )}

          {tab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Paste Conversation JSON or Markdown:
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={8}
                  placeholder={`{"messages": [{"role": "user", "content": "hello"}]}`}
                  className="w-full font-mono text-xs rounded-lg border border-[#27272A] bg-[#09090B] p-2.5 text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <button
                disabled={!rawText.trim()}
                onClick={handleLoadRawText}
                className="w-full rounded-lg bg-[#38BDF8] py-2 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] disabled:opacity-50 transition"
              >
                Parse and Open Conversation
              </button>
            </div>
          )}

          {tab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? 'border-[#38BDF8] bg-[#18181B]'
                  : 'border-[#27272A] bg-[#09090B]'
              }`}
            >
              <FileJson className="h-10 w-10 text-[#71717A] mb-2" />
              <p className="text-xs font-semibold text-[#D4D4D8] mb-1">
                Drag and drop your ChatGPT .json / .md / .txt file here
              </p>
              <p className="text-[11px] text-[#71717A] mb-4">
                Supports OpenAI conversation exports and Codex session logs
              </p>

              <label className="cursor-pointer rounded-lg bg-[#38BDF8] px-3.5 py-1.5 text-xs font-bold text-zinc-950 hover:bg-[#0284C7] transition">
                Browse Files
                <input
                  type="file"
                  accept=".json,.md,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
