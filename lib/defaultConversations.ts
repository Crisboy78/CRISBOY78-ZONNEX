import { ConversationSession } from '@/types/conversation';

export const DEFAULT_CONVERSATIONS: ConversationSession[] = [
  {
    id: 'codex-2026-09-01-referenced-chat',
    title: 'Codex Architecture & Agentic Workflow Orchestrator',
    filePath: 'C:\\Users\\Usuario\\Documents\\Codex\\2026-09-01\\referenced-chatgpt-conversation-this-is-an',
    date: '2026-09-01 14:38:12',
    platform: 'Codex',
    model: 'gpt-4o-codex-2026',
    systemPrompt: `You are Codex Assistant, an expert software architecture agent specializing in distributed systems, high-concurrency event-driven workflows, and TypeScript Next.js full-stack implementations. Provide production-grade, mathematically verified patterns with comprehensive error handling.`,
    tags: ['Architecture', 'Codex Agent', 'Next.js 15', 'Orchestration', 'TypeScript', '2026-09-01'],
    summary: 'Deep architectural discussion defining the multi-agent task orchestrator, distributed state machine with optimistic locking, AST inspection tools, and low-latency client synchronization.',
    contextWindowUsage: {
      promptTokens: 11420,
      completionTokens: 5890,
      totalTokens: 17310,
      maxContext: 128000,
    },
    messages: [
      {
        id: 'msg-sys-0',
        role: 'system',
        content: `Session initialized with context from local repository workspace. Active directory set to \`C:\\Users\\Usuario\\Documents\\Codex\\2026-09-01\\\`. Environment supports Node.js 22 LTS, TypeScript 5.9, and Gemini / OpenAI model endpoints.`,
        timestamp: '14:38:12',
        tokenCount: 84,
      },
      {
        id: 'msg-usr-1',
        role: 'user',
        content: `I am refactoring our Codex agent pipeline for the 2026-09-01 release. 

We need to design a **deterministic agentic workflow engine** that handles:
1. Multi-step plan generation with dynamic DAG execution.
2. Safe AST-based code modifications without hallucinations.
3. State persistence with rollback support in case a build verification fails.
4. Real-time telemetry streaming to the Next.js App Router client.

Can you provide the complete TypeScript architecture, type definitions, and the core Orchestrator implementation?`,
        timestamp: '14:38:45',
        tokenCount: 142,
        references: [
          {
            id: 'ref-1',
            type: 'filepath',
            label: 'Active Workspace Path',
            value: 'C:\\Users\\Usuario\\Documents\\Codex\\2026-09-01\\referenced-chatgpt-conversation-this-is-an',
            contextSnippet: 'Local session directory referencing Codex workflow configuration',
          },
          {
            id: 'ref-2',
            type: 'doc_ref',
            label: 'DAG Spec',
            value: 'RFC-9021 Deterministic Agent Execution',
            contextSnippet: 'Standard for topological sorting of subtask graphs',
          },
        ],
      },
      {
        id: 'msg-ast-1',
        role: 'assistant',
        timestamp: '14:39:18',
        model: 'gpt-4o-codex-2026',
        tokenCount: 1850,
        reasoningDurationSeconds: 14,
        reasoningContent: `1. Analyzed user requirements: deterministic DAG execution, AST-safe code transformation, rollback state persistence, and SSE/WebSocket telemetry.
2. Evaluated state machine patterns: decided on an immutable StateSnapshot journal with reversible micro-patch rollback.
3. Designed the core interfaces: \`AgentTask\`, \`WorkflowDAG\`, \`TaskResult\`, and \`OrchestratorEngine\`.
4. Checked TypeScript 5.9 strict typing rules and async generator support for streaming events to Next.js API Routes.
5. Formulated complete implementation code with error boundaries.`,
        tools: [
          {
            id: 'tool-exec-1',
            name: 'ast_analyzer_check',
            input: '{"targetDir": "C:/Users/Usuario/Documents/Codex/src/engine", "syntax": "typescript"}',
            output: '✓ AST analyzer verified. No cyclic dependencies detected in DAG node definitions.',
            durationMs: 420,
            status: 'success',
          },
        ],
        content: `Here is the comprehensive architectural specification and production implementation for the **Codex Deterministic Agentic Workflow Engine**.

### 1. Architectural Overview & Component Diagram

\`\`\`
+-------------------------------------------------------------+
|                     Next.js Client UI                       |
|           (Live Stream Receiver / DAG Visualizer)           |
+------------------------------▲------------------------------+
                               │ SSE / Streaming HTTP
+------------------------------▼------------------------------+
|               WorkflowOrchestrator Engine                   |
|  +------------------------+     +------------------------+  |
|  |   DAG Topological Sort |     | Rollback Journal (WAL) |  |
|  +------------------------+     +------------------------+  |
|  +------------------------+     +------------------------+  |
|  | Tool Dispatcher (Async)|     | AST Verification Gate  |  |
|  +------------------------+     +------------------------+  |
+-------------------------------------------------------------+
\`\`\`

---

### 2. Core Type Definitions (\`engine/types.ts\`)

\`\`\`typescript
export type TaskStatus = 'idle' | 'pending' | 'executing' | 'completed' | 'failed' | 'rolled_back';

export interface TaskCheckpoint {
  checkpointId: string;
  timestamp: number;
  filesSnapshot: Record<string, string>; // FilePath -> Content Hash
  metadata: Record<string, unknown>;
}

export interface AgentTaskNode {
  id: string;
  name: string;
  description: string;
  dependencies: string[]; // IDs of prerequisite tasks
  action: (context: WorkflowContext) => Promise<TaskOutput>;
  rollbackAction?: (context: WorkflowContext, previousState: TaskCheckpoint) => Promise<void>;
  status: TaskStatus;
  retryLimit: number;
}

export interface WorkflowContext {
  sessionId: string;
  workspaceRoot: string;
  variables: Map<string, any>;
  journal: TaskCheckpoint[];
  emitEvent: (event: TelemetryEvent) => void;
}

export interface TelemetryEvent {
  type: 'TASK_STARTED' | 'TASK_PROGRESS' | 'TASK_COMPLETED' | 'TASK_FAILED' | 'ROLLBACK_TRIGGERED';
  taskId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
\`\`\`

---

### 3. Orchestrator Engine Implementation (\`engine/orchestrator.ts\`)

\`\`\`typescript
export class WorkflowOrchestrator {
  private nodes: Map<string, AgentTaskNode> = new Map();
  private journal: TaskCheckpoint[] = [];

  constructor(private readonly workspacePath: string) {}

  public registerTask(task: AgentTaskNode): this {
    this.nodes.set(task.id, task);
    return this;
  }

  /**
   * Resolves execution order via Kahn's Topological Sorting Algorithm
   */
  public computeExecutionOrder(): string[] {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    this.nodes.forEach((_, id) => {
      inDegree.set(id, 0);
      adjList.set(id, []);
    });

    this.nodes.forEach((node, id) => {
      for (const dep of node.dependencies) {
        if (!this.nodes.has(dep)) {
          throw new Error(\`Unresolved dependency "\${dep}" required by task "\${id}"\`);
        }
        adjList.get(dep)!.push(id);
        inDegree.set(id, (inDegree.get(id) || 0) + 1);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const executionPlan: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      executionPlan.push(current);

      for (const neighbor of adjList.get(current) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (executionPlan.length !== this.nodes.size) {
      throw new Error('Cyclic dependency detected in task DAG graph.');
    }

    return executionPlan;
  }

  /**
   * Executes the DAG with automated checkpointing and rollback protection
   */
  public async *executeStream(): AsyncGenerator<TelemetryEvent> {
    const plan = this.computeExecutionOrder();
    const context: WorkflowContext = {
      sessionId: \`codex-session-\${Date.now()}\`,
      workspaceRoot: this.workspacePath,
      variables: new Map(),
      journal: this.journal,
      emitEvent: () => {},
    };

    for (const taskId of plan) {
      const task = this.nodes.get(taskId)!;
      task.status = 'executing';

      yield {
        type: 'TASK_STARTED',
        taskId,
        payload: { taskName: task.name },
        timestamp: new Date().toISOString(),
      };

      try {
        const result = await task.action(context);
        task.status = 'completed';

        yield {
          type: 'TASK_COMPLETED',
          taskId,
          payload: { result },
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        task.status = 'failed';
        yield {
          type: 'TASK_FAILED',
          taskId,
          payload: { error: err.message },
          timestamp: new Date().toISOString(),
        };

        // Trigger safe state rollback
        yield* this.rollbackSession(context);
        break;
      }
    }
  }

  private async *rollbackSession(context: WorkflowContext): AsyncGenerator<TelemetryEvent> {
    yield {
      type: 'ROLLBACK_TRIGGERED',
      taskId: 'SYSTEM_ROLLBACK',
      payload: { checkpointsToRevert: this.journal.length },
      timestamp: new Date().toISOString(),
    };
    // Revert state to last known good checkpoint
  }
}
\`\`\`

---

### Key Guarantees:
- **Zero Orphaned Tasks**: Kahn's topological sort mathematically verifies non-cyclicity before any execution begins.
- **Transactional Safety**: Every file modification generates a discrete hash checkpoint in \`this.journal\`.
- **Full Async Streaming**: Telemetry yields directly to Next.js Server-Sent Event endpoints.`,
        alternatives: [
          {
            id: 'alt-1',
            content: `### Alternative Branch A: Parallel Node Execution with Worker Threads
Instead of sequential topological steps, this variant resolves independent DAG layers into concurrent Promise.all execution pools with thread worker isolation.`,
            reasoningContent: `Explored concurrent execution across multiple subagents with thread pools.`,
            model: 'gpt-4o-codex-2026',
            tokenCount: 1620,
          },
          {
            id: 'alt-2',
            content: `### Alternative Branch B: Event-Driven Redux-Style Saga Pattern
Uses a centralized state reducer where all tool operations emit typed actions through an event bus.`,
            reasoningContent: `Explored Redux-style saga architecture for maximum determinism.`,
            model: 'o3-high',
            tokenCount: 1490,
          },
        ],
        activeAlternativeIndex: 0,
        bookmarked: true,
        notes: 'Core architecture accepted for 2026-09-01 release build. Verified topological DAG execution.',
      },
      {
        id: 'msg-usr-2',
        role: 'user',
        content: `How should we handle AST code modification and diff verification when an agent generates patch edits for existing files like \`package.json\` or complex React components?`,
        timestamp: '14:41:05',
        tokenCount: 95,
      },
      {
        id: 'msg-ast-2',
        role: 'assistant',
        timestamp: '14:41:40',
        model: 'gpt-4o-codex-2026',
        tokenCount: 1420,
        reasoningDurationSeconds: 9,
        reasoningContent: `1. Analyzed diff validation strategies: Unified Diff vs Unified AST mutation.
2. Selected AST-based patch matching with three-way fuzzy hunk matching.
3. Created the \`CodePatcher\` module with syntax tree validation via TypeScript Compiler API.`,
        tools: [
          {
            id: 'tool-exec-2',
            name: 'diff_verifier',
            input: '{"patchMode": "surgical_ast", "tolerance": "strict"}',
            output: '✓ Diff verification engine passed all 18 regression test cases.',
            durationMs: 310,
            status: 'success',
          },
        ],
        content: `To prevent hallucinations and syntax breaks during automated code modifications, implement **Semantic AST-Gated Patching**:

### AST Verification Workflow

1. **Pre-mutation Syntax Check**: Run the TypeScript AST parser on the original file to ensure clean baseline syntax.
2. **Exact vs Fuzzy Substring Matching**: Verify that the targeted lines exist uniquely in the file.
3. **Post-mutation Re-Parse**: Immediately parse the resulting text buffer into an AST before writing to disk. If parsing errors occur (e.g. unclosed tags or syntax errors), reject the patch and trigger self-correction.

\`\`\`typescript
import * as ts from 'typescript';

export class SemanticPatchValidator {
  public static validateSource(code: string, fileName: string = 'temp.tsx'): { valid: boolean; errors: string[] } {
    const sourceFile = ts.createSourceFile(
      fileName,
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    const diagnostics: string[] = [];
    const checkNodes = (node: ts.Node) => {
      if (node.flags & ts.NodeFlags.Syntactic) {
        // Syntax error flagged by compiler
      }
      ts.forEachChild(node, checkNodes);
    };

    checkNodes(sourceFile);
    return {
      valid: diagnostics.length === 0,
      errors: diagnostics,
    };
  }
}
\`\`\`

This guarantees that no broken files ever get written to disk during automated agent runs.`,
        bookmarked: false,
      },
      {
        id: 'msg-usr-3',
        role: 'user',
        content: `Can you summarize the final action items for our sprint and write the unit tests for \`computeExecutionOrder\`?`,
        timestamp: '14:43:10',
        tokenCount: 65,
      },
      {
        id: 'msg-ast-3',
        role: 'assistant',
        timestamp: '14:43:52',
        model: 'gpt-4o-codex-2026',
        tokenCount: 1120,
        reasoningDurationSeconds: 6,
        reasoningContent: `1. Formulated Jest / Vitest test suite covering happy path DAG, multi-branch dependencies, and cyclic failure detection.
2. Summarized key action items for the development sprint.`,
        content: `Here are the unit tests and the actionable sprint items:

### 1. Unit Tests (\`orchestrator.test.ts\`)

\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { WorkflowOrchestrator } from './orchestrator';

describe('WorkflowOrchestrator DAG Execution', () => {
  it('should sort non-dependent tasks in topological order', () => {
    const orchestrator = new WorkflowOrchestrator('./test-workspace');
    orchestrator
      .registerTask({ id: 'build', name: 'Build', dependencies: ['lint', 'typecheck'], action: async () => ({}), status: 'idle', retryLimit: 1 })
      .registerTask({ id: 'lint', name: 'Lint', dependencies: [], action: async () => ({}), status: 'idle', retryLimit: 1 })
      .registerTask({ id: 'typecheck', name: 'TypeCheck', dependencies: ['lint'], action: async () => ({}), status: 'idle', retryLimit: 1 });

    const order = orchestrator.computeExecutionOrder();
    expect(order).toEqual(['lint', 'typecheck', 'build']);
  });

  it('should throw an error when a cyclic dependency is detected', () => {
    const orchestrator = new WorkflowOrchestrator('./test-workspace');
    orchestrator
      .registerTask({ id: 'task-a', name: 'Task A', dependencies: ['task-b'], action: async () => ({}), status: 'idle', retryLimit: 1 })
      .registerTask({ id: 'task-b', name: 'Task B', dependencies: ['task-a'], action: async () => ({}), status: 'idle', retryLimit: 1 });

    expect(() => orchestrator.computeExecutionOrder()).toThrowError(/Cyclic dependency/);
  });
});
\`\`\`

### 2. Sprint Action Items
- [ ] Implement \`WorkflowOrchestrator\` in \`src/engine/orchestrator.ts\`.
- [ ] Connect Server-Sent Events endpoint at \`app/api/orchestrator/stream/route.ts\`.
- [ ] Integrate \`SemanticPatchValidator\` into the file system write middleware.
- [ ] Add real-time DAG graph visualization on the developer dashboard.`,
        bookmarked: true,
      },
    ],
  },
  {
    id: 'deepseek-r1-audit-session',
    title: 'DeepSeek-R1 Chain-of-Thought & Reasoning Audit',
    filePath: 'C:\\Users\\Usuario\\Documents\\Codex\\2026-08-28\\deepseek-r1-reasoning-audit.json',
    date: '2026-08-28 10:15:00',
    platform: 'OpenAI Export',
    model: 'o3-mini-high',
    tags: ['Reasoning', 'Audit', 'Chain-of-Thought', 'Benchmarking'],
    summary: 'Evaluating high-depth reasoning traces, mathematical proof verification, and test-time compute optimization.',
    contextWindowUsage: {
      promptTokens: 8200,
      completionTokens: 6400,
      totalTokens: 14600,
      maxContext: 128000,
    },
    messages: [
      {
        id: 'msg-r1-1',
        role: 'user',
        content: 'Compare test-time compute scaling laws versus pre-training compute for algorithmic verification.',
        timestamp: '10:15:00',
        tokenCount: 45,
      },
      {
        id: 'msg-r1-2',
        role: 'assistant',
        timestamp: '10:15:45',
        model: 'o3-mini-high',
        tokenCount: 1250,
        reasoningDurationSeconds: 22,
        reasoningContent: 'Analyzing asymptotic returns of Monte Carlo Tree Search vs standard beam search over token distributions...',
        content: `### Test-Time Compute Scaling Analysis

When scaling reasoning models during inference:
1. **Search Space Pruning**: Self-correction loops allow discarding invalid search trajectories before generating final answers.
2. **Compute Allocation**: Verification-dense tasks (formal proofs, compiler checks) exhibit super-linear accuracy gains with increased token budget.`,
      },
    ],
  },
  {
    id: 'gemini-vision-tool-calling',
    title: 'Gemini 3.7 Flash Tool Calling & Vision Integration',
    filePath: 'C:\\Users\\Usuario\\Documents\\Codex\\2026-08-20\\gemini-vision-tool-calling-spec.json',
    date: '2026-08-20 16:42:10',
    platform: 'Gemini',
    model: 'gemini-3.7-flash',
    tags: ['Gemini', 'Tools', 'Vision', 'TypeScript'],
    summary: 'Implementing multimodal function calling with structured JSON schemas and image bounding box detectors.',
    contextWindowUsage: {
      promptTokens: 9100,
      completionTokens: 3200,
      totalTokens: 12300,
      maxContext: 1000000,
    },
    messages: [
      {
        id: 'msg-gem-1',
        role: 'user',
        content: 'How do we configure tool declarations in @google/genai TypeScript SDK for image spatial object localization?',
        timestamp: '16:42:10',
        tokenCount: 52,
      },
      {
        id: 'msg-gem-2',
        role: 'assistant',
        timestamp: '16:42:35',
        model: 'gemini-3.7-flash',
        tokenCount: 980,
        content: `Using \`@google/genai\` SDK, pass \`functionDeclarations\` with normalized bounding box coordinate schemas \`[ymin, xmin, ymax, xmax]\` and specify \`temperature: 0.2\`.`,
      },
    ],
  },
];
