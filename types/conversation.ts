export interface ToolExecution {
  id: string;
  name: string;
  input: string;
  output: string;
  durationMs?: number;
  status: 'success' | 'failed' | 'running';
}

export interface CitationReference {
  id: string;
  type: 'filepath' | 'url' | 'code_symbol' | 'doc_ref';
  label: string;
  value: string;
  contextSnippet?: string;
}

export interface ConversationTurn {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
  reasoningContent?: string; // Thought / Chain of Thought process
  reasoningDurationSeconds?: number;
  model?: string;
  tokenCount?: number;
  tools?: ToolExecution[];
  alternatives?: {
    id: string;
    content: string;
    reasoningContent?: string;
    model?: string;
    tokenCount?: number;
  }[];
  activeAlternativeIndex?: number;
  bookmarked?: boolean;
  notes?: string;
  references?: CitationReference[];
}

export interface ConversationSession {
  id: string;
  title: string;
  filePath: string;
  date: string;
  platform: 'ChatGPT' | 'Codex' | 'Claude' | 'Gemini' | 'OpenAI Export';
  model: string;
  systemPrompt?: string;
  messages: ConversationTurn[];
  tags: string[];
  summary?: string;
  contextWindowUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    maxContext: number;
  };
}
