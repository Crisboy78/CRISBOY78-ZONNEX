import { ConversationSession, ConversationTurn, CitationReference } from '@/types/conversation';

export interface ExtractedCodeSnippet {
  id: string;
  language: string;
  code: string;
  fileName?: string;
  messageId: string;
  messageRole: string;
  messageIndex: number;
}

export class ConversationHelper {
  /**
   * Extracts all code blocks from conversation messages
   */
  public static extractCodeSnippets(messages: ConversationTurn[]): ExtractedCodeSnippet[] {
    const snippets: ExtractedCodeSnippet[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]+)?\s*(?:\(([^)]+)\)|\[([^\]]+)\])?\n([\s\S]*?)```/g;

    messages.forEach((msg, msgIndex) => {
      let match: RegExpExecArray | null;
      let counter = 1;
      // Reset regex index
      codeBlockRegex.lastIndex = 0;

      while ((match = codeBlockRegex.exec(msg.content)) !== null) {
        const lang = match[1] || 'text';
        const fileParam = match[2] || match[3] || '';
        const codeContent = match[4].trim();

        // Extract possible file name from code header comment or prompt (e.g. // engine/types.ts or /* file.ts */)
        let inferredFileName = fileParam;
        if (!inferredFileName) {
          const firstLine = codeContent.split('\n')[0];
          const commentFileMatch = firstLine.match(/^(?:\/\/|\/\*|#)\s*([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+)/);
          if (commentFileMatch) {
            inferredFileName = commentFileMatch[1];
          } else {
            inferredFileName = `snippet_${msgIndex + 1}_${counter}.${lang === 'typescript' ? 'ts' : lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'json' ? 'json' : 'txt'}`;
          }
        }

        snippets.push({
          id: `snippet-${msg.id}-${counter}`,
          language: lang,
          code: codeContent,
          fileName: inferredFileName,
          messageId: msg.id,
          messageRole: msg.role,
          messageIndex: msgIndex,
        });

        counter++;
      }
    });

    return snippets;
  }

  /**
   * Extracts all referenced file paths, urls, and mentions from text
   */
  public static extractReferences(session: ConversationSession): CitationReference[] {
    const refs: CitationReference[] = [];
    const seen = new Set<string>();

    // Add session root file path if exists
    if (session.filePath) {
      refs.push({
        id: 'ref-root-file',
        type: 'filepath',
        label: 'Referenced Session Path',
        value: session.filePath,
        contextSnippet: 'Direct file path on local filesystem / Codex root',
      });
      seen.add(session.filePath);
    }

    const pathRegex = /(?:[a-zA-Z]:\\[a-zA-Z0-9_.\-\\]+|(?:\/|[a-zA-Z0-9_.-]+\/)[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/g;
    const urlRegex = /(https?:\/\/[^\s)"]+)/g;

    session.messages.forEach((msg) => {
      // Check for predefined references
      if (msg.references) {
        msg.references.forEach((r) => {
          if (!seen.has(r.value)) {
            refs.push(r);
            seen.add(r.value);
          }
        });
      }

      // Match paths in content
      let pathMatch;
      while ((pathMatch = pathRegex.exec(msg.content)) !== null) {
        const p = pathMatch[0];
        if (!seen.has(p) && p.length > 4 && !p.startsWith('http')) {
          refs.push({
            id: `ref-path-${refs.length + 1}`,
            type: 'filepath',
            label: p.split(/[\\/]/).pop() || p,
            value: p,
            contextSnippet: `Mentioned in ${msg.role.toUpperCase()} turn`,
          });
          seen.add(p);
        }
      }

      // Match URLs in content
      let urlMatch;
      while ((urlMatch = urlRegex.exec(msg.content)) !== null) {
        const u = urlMatch[0];
        if (!seen.has(u)) {
          refs.push({
            id: `ref-url-${refs.length + 1}`,
            type: 'url',
            label: new URL(u).hostname || u,
            value: u,
            contextSnippet: `Web reference cited in ${msg.role.toUpperCase()} turn`,
          });
          seen.add(u);
        }
      }
    });

    return refs;
  }

  /**
   * Generates a clean Markdown export of the entire session
   */
  public static exportToMarkdown(session: ConversationSession): string {
    let md = `# ${session.title}\n\n`;
    md += `**Referenced Path:** \`${session.filePath}\`  \n`;
    md += `**Date:** ${session.date}  \n`;
    md += `**Model:** ${session.model}  \n`;
    md += `**Platform:** ${session.platform}  \n\n`;
    md += `---\n\n`;

    if (session.systemPrompt) {
      md += `### 🛠️ System Prompt\n\n> ${session.systemPrompt.replace(/\n/g, '\n> ')}\n\n---\n\n`;
    }

    session.messages.forEach((msg, idx) => {
      const speaker = msg.role === 'user' ? '👤 User' : msg.role === 'assistant' ? '🤖 Assistant' : msg.role === 'system' ? '⚙️ System' : '🔧 Tool';
      md += `### ${speaker} (${msg.timestamp})\n\n`;

      if (msg.reasoningContent) {
        md += `<details><summary>💭 Thought Process (${msg.reasoningDurationSeconds || 0}s)</summary>\n\n${msg.reasoningContent}\n\n</details>\n\n`;
      }

      if (msg.tools && msg.tools.length > 0) {
        msg.tools.forEach((t) => {
          md += `> **Tool Executed:** \`${t.name}\`\n> **Input:** \`${t.input}\`\n> **Output:** \`${t.output}\`\n\n`;
        });
      }

      md += `${msg.content}\n\n`;
      if (msg.notes) {
        md += `*📌 Note: ${msg.notes}*\n\n`;
      }
      md += `---\n\n`;
    });

    return md;
  }

  /**
   * Parses uploaded JSON or text files into ConversationSession
   */
  public static parseFileContent(content: string, fileName: string): ConversationSession {
    try {
      const parsed = JSON.parse(content);

      // Standard OpenAI / ChatGPT Export Format
      if (parsed.title && Array.isArray(parsed.mapping || parsed.messages)) {
        const msgs: ConversationTurn[] = [];

        if (Array.isArray(parsed.messages)) {
          parsed.messages.forEach((m: any, i: number) => {
            msgs.push({
              id: m.id || `msg-${i}`,
              role: m.role || 'user',
              content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
              timestamp: m.timestamp || new Date().toLocaleTimeString(),
              model: m.model || parsed.model || 'Imported Model',
              tokenCount: m.tokens || Math.ceil((m.content?.length || 0) / 4),
            });
          });
        } else if (parsed.mapping) {
          Object.values(parsed.mapping).forEach((node: any, idx: number) => {
            if (node.message && node.message.content && node.message.content.parts) {
              const textParts = node.message.content.parts.filter((p: any) => typeof p === 'string').join('\n');
              if (textParts.trim()) {
                msgs.push({
                  id: node.id || `msg-${idx}`,
                  role: node.message.author?.role === 'user' ? 'user' : node.message.author?.role === 'assistant' ? 'assistant' : 'system',
                  content: textParts,
                  timestamp: new Date(node.message.create_time * 1000).toLocaleTimeString() || '00:00:00',
                  model: node.message.metadata?.model_slug || 'ChatGPT',
                  tokenCount: Math.ceil(textParts.length / 4),
                });
              }
            }
          });
        }

        return {
          id: `imported-${Date.now()}`,
          title: parsed.title || fileName,
          filePath: fileName.includes('\\') || fileName.includes('/') ? fileName : `C:\\Users\\Usuario\\Documents\\Codex\\${fileName}`,
          date: new Date().toISOString().slice(0, 10),
          platform: 'OpenAI Export',
          model: parsed.model || 'gpt-4o',
          messages: msgs,
          tags: ['Imported', 'JSON Export'],
        };
      }
    } catch {
      // Treat as plain text or Markdown
    }

    // Markdown / text parser fallback
    const lines = content.split('\n');
    const msgs: ConversationTurn[] = [];
    let currentRole: 'user' | 'assistant' | 'system' = 'user';
    let currentBuffer: string[] = [];
    let turnCount = 1;

    for (const line of lines) {
      if (line.match(/^#+\s*(User|Human|Prompt):?/i)) {
        if (currentBuffer.length > 0) {
          msgs.push({
            id: `msg-${turnCount++}`,
            role: currentRole,
            content: currentBuffer.join('\n').trim(),
            timestamp: new Date().toLocaleTimeString(),
          });
          currentBuffer = [];
        }
        currentRole = 'user';
      } else if (line.match(/^#+\s*(Assistant|ChatGPT|Codex|AI|Bot):?/i)) {
        if (currentBuffer.length > 0) {
          msgs.push({
            id: `msg-${turnCount++}`,
            role: currentRole,
            content: currentBuffer.join('\n').trim(),
            timestamp: new Date().toLocaleTimeString(),
          });
          currentBuffer = [];
        }
        currentRole = 'assistant';
      } else {
        currentBuffer.push(line);
      }
    }

    if (currentBuffer.length > 0) {
      msgs.push({
        id: `msg-${turnCount++}`,
        role: currentRole,
        content: currentBuffer.join('\n').trim(),
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    return {
      id: `imported-${Date.now()}`,
      title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      filePath: fileName.includes('\\') || fileName.includes('/') ? fileName : `C:\\Users\\Usuario\\Documents\\Codex\\${fileName}`,
      date: new Date().toISOString().slice(0, 10),
      platform: 'Codex',
      model: 'Custom Transcript',
      messages: msgs.length > 0 ? msgs : [
        {
          id: 'msg-1',
          role: 'assistant',
          content: content,
          timestamp: new Date().toLocaleTimeString(),
        }
      ],
      tags: ['Imported', 'Transcript'],
    };
  }
}
