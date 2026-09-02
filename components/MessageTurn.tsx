'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  User, 
  Bot, 
  Terminal, 
  Wrench, 
  Copy, 
  Check, 
  Bookmark, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  BrainCircuit, 
  FileText,
  Pin,
  Clock,
  Code2
} from 'lucide-react';
import { ConversationTurn } from '@/types/conversation';

interface MessageTurnProps {
  message: ConversationTurn;
  index: number;
  onBookmarkToggle: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAskAIAboutTurn: (message: ConversationTurn) => void;
  onSwitchAlternative: (id: string, altIndex: number) => void;
}

export function MessageTurn({
  message,
  index,
  onBookmarkToggle,
  onUpdateNotes,
  onAskAIAboutTurn,
  onSwitchAlternative,
}: MessageTurnProps) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(message.notes || '');

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const isTool = message.role === 'tool';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(message.id, notesInput);
    setIsEditingNotes(false);
  };

  // Check if alternatives exist
  const hasAlternatives = message.alternatives && message.alternatives.length > 0;
  const currentAltIndex = message.activeAlternativeIndex || 0;
  const totalAlternatives = (message.alternatives?.length || 0) + 1;

  // Active content based on alternative
  const activeContent = (currentAltIndex > 0 && message.alternatives)
    ? message.alternatives[currentAltIndex - 1].content
    : message.content;

  const activeReasoning = (currentAltIndex > 0 && message.alternatives)
    ? message.alternatives[currentAltIndex - 1].reasoningContent || message.reasoningContent
    : message.reasoningContent;

  return (
    <div
      id={`turn-${message.id}`}
      className={`group relative rounded-xl border border-[#27272A] bg-[#09090B] p-5 shadow-2xl transition-all ${
        message.bookmarked ? 'ring-1 ring-[#38BDF8]/40' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Turn type tag matching the Elegant Dark theme */}
          {isUser && (
            <span className="text-blue-400 font-bold font-mono text-[11px] tracking-tight">
              [PROMPT]
            </span>
          )}
          {isAssistant && (
            <span className="text-emerald-400 font-bold font-mono text-[11px] tracking-tight">
              [COMPLETION]
            </span>
          )}
          {isSystem && (
            <span className="text-amber-400 font-bold font-mono text-[11px] tracking-tight">
              [SYSTEM]
            </span>
          )}
          {isTool && (
            <span className="text-purple-400 font-bold font-mono text-[11px] tracking-tight">
              [TOOL_EXEC]
            </span>
          )}

          <span className="text-[#52525B] font-mono text-[11px]">
            {message.timestamp}
          </span>

          {message.model && (
            <span className="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A] border border-[#27272A]">
              {message.model}
            </span>
          )}

          {message.tokenCount && (
            <span className="hidden sm:inline text-[10px] text-[#52525B] font-mono">
              • ~{message.tokenCount} tokens
            </span>
          )}
        </div>

        {/* Turn Actions & Alternative Branch Navigation */}
        <div className="flex items-center gap-1.5">
          {/* Branch Navigation */}
          {hasAlternatives && (
            <div className="flex items-center gap-1 rounded bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 text-[11px] font-mono text-[#A1A1AA] mr-1">
              <button
                disabled={currentAltIndex === 0}
                onClick={() => onSwitchAlternative(message.id, currentAltIndex - 1)}
                className="disabled:opacity-30 hover:text-[#38BDF8] transition"
                title="Previous generation"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span>{currentAltIndex + 1} / {totalAlternatives}</span>
              <button
                disabled={currentAltIndex >= totalAlternatives - 1}
                onClick={() => onSwitchAlternative(message.id, currentAltIndex + 1)}
                className="disabled:opacity-30 hover:text-[#38BDF8] transition"
                title="Next generation"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(message.id)}
            className={`p-1.5 rounded hover:bg-[#18181B] transition ${
              message.bookmarked ? 'text-[#38BDF8] fill-[#38BDF8]' : 'text-[#71717A] hover:text-[#FAFAFA]'
            }`}
            title={message.bookmarked ? 'Remove bookmark' : 'Bookmark turn'}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>

          {/* Ask AI / Inspect Turn */}
          {isAssistant && (
            <button
              onClick={() => onAskAIAboutTurn(message)}
              className="p-1.5 rounded text-[#71717A] hover:text-[#38BDF8] hover:bg-[#18181B] transition"
              title="Ask Gemini AI to explain or refactor this response"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(activeContent)}
            className="p-1.5 rounded text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18181B] transition"
            title="Copy message content"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Reasoning / Thinking Drawer (Chain-of-Thought) */}
      {activeReasoning && (
        <div className="mb-3 rounded-lg border border-[#27272A] bg-[#141417] text-xs overflow-hidden">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex w-full items-center justify-between px-3 py-2 text-[#A1A1AA] font-medium hover:bg-[#18181B] transition"
          >
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span className="text-[#FAFAFA]">Reasoning & Thought Traces {message.reasoningDurationSeconds ? `(${message.reasoningDurationSeconds}s)` : ''}</span>
            </span>
            {showReasoning ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showReasoning && (
            <div className="px-4 py-3 text-[#A1A1AA] border-t border-[#27272A] bg-[#09090B] whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {activeReasoning}
            </div>
          )}
        </div>
      )}

      {/* Tools Called Log */}
      {message.tools && message.tools.length > 0 && (
        <div className="mb-3 space-y-2">
          {message.tools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 text-xs font-mono shadow-inner"
            >
              <div className="flex items-center justify-between text-[#71717A] pb-1.5 border-b border-[#27272A] mb-2">
                <span className="flex items-center gap-1.5 text-[#38BDF8]">
                  <Terminal className="h-3 w-3" />
                  Tool Invocation: <span className="font-semibold text-white">{tool.name}</span>
                </span>
                {tool.durationMs && <span className="text-[10px] text-[#52525B]">{tool.durationMs}ms</span>}
              </div>
              <div className="text-[#71717A] text-[11px] mb-1">Input: <span className="text-[#D4D4D8]">{tool.input}</span></div>
              <div className="text-[#71717A] text-[11px]">Output: <span className="text-emerald-400">{tool.output}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* Message Content Body with elegant left border accent */}
      <div className={`pl-4 border-l border-[#27272A] ${isUser ? 'text-[#D4D4D8]' : 'text-[#A1A1AA]'} text-sm leading-relaxed space-y-2.5 break-words font-sans`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !String(children).includes('\n');

              if (isInline) {
                return (
                  <code className="rounded bg-[#18181B] px-1.5 py-0.5 font-mono text-[12px] text-[#38BDF8] border border-[#27272A] font-normal">
                    {children}
                  </code>
                );
              }

              const codeText = String(children).replace(/\n$/, '');

              return (
                <div className="my-3 overflow-hidden rounded-lg border border-[#27272A] bg-[#18181B] text-[#FAFAFA] shadow-lg">
                  {/* Code block header bar */}
                  <div className="flex items-center justify-between bg-[#141417] px-3.5 py-1.5 text-xs text-[#71717A] border-b border-[#27272A]">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#38BDF8]">
                      <Code2 className="h-3.5 w-3.5 text-[#38BDF8]" />
                      {match ? match[1] : 'code'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeText)}
                      className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] transition"
                      title="Copy code"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  {/* Code snippet */}
                  <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-[#D4D4D8] bg-[#09090B]">
                    <code>{codeText}</code>
                  </pre>
                </div>
              );
            },
            h1: ({ children }) => <h1 className="text-base font-semibold text-[#FAFAFA] mt-4 mb-2 tracking-tight">{children}</h1>,
            h2: ({ children }) => <h2 className="text-sm font-semibold text-[#FAFAFA] mt-3 mb-1.5 tracking-tight">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xs font-semibold text-[#FAFAFA] mt-2.5 mb-1">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2 text-[#D4D4D8]">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2 text-[#D4D4D8]">{children}</ol>,
            li: ({ children }) => <li className="text-[#D4D4D8]">{children}</li>,
            p: ({ children }) => <p className="my-1.5">{children}</p>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[#38BDF8] pl-3 py-1 my-2 text-[#A1A1AA] italic bg-[#18181B]/50 rounded-r">
                {children}
              </blockquote>
            ),
          }}
        >
          {activeContent}
        </ReactMarkdown>
      </div>

      {/* User Notes / Annotations */}
      <div className="mt-3 pt-2.5 border-t border-[#27272A]/70 text-xs">
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Add personal notes or remarks about this message..."
              className="w-full rounded-lg border border-[#27272A] bg-[#141417] p-2 text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#38BDF8]"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNotes}
                className="rounded bg-[#38BDF8] text-zinc-950 font-bold px-2.5 py-1 text-[11px] hover:bg-[#0284C7] transition"
              >
                Save Note
              </button>
              <button
                onClick={() => setIsEditingNotes(false)}
                className="rounded border border-[#27272A] px-2.5 py-1 text-[11px] text-[#A1A1AA] hover:bg-[#18181B] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {message.notes ? (
              <div className="flex items-center gap-1.5 text-[#38BDF8] bg-[#18181B] px-2.5 py-1 rounded border border-[#27272A] text-[11px]">
                <Pin className="h-3 w-3" />
                <span className="font-medium text-[#FAFAFA]">Note:</span> {message.notes}
              </div>
            ) : (
              <span />
            )}
            <button
              onClick={() => {
                setNotesInput(message.notes || '');
                setIsEditingNotes(true);
              }}
              className="text-[11px] text-[#71717A] hover:text-[#FAFAFA] transition"
            >
              {message.notes ? 'Edit note' : '+ Add note'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
