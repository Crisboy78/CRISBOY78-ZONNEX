import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, messages, prompt, conversationTitle } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in the environment.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format the conversation transcript for Gemini context
    const transcriptText = Array.isArray(messages)
      ? messages
          .map((m: { role: string; content: string; name?: string }) => {
            const speaker = m.role === 'user' ? 'User' : m.role === 'assistant' ? 'Assistant (Codex/ChatGPT)' : m.role.toUpperCase();
            return `### [${speaker}]\n${m.content}\n`;
          })
          .join('\n---\n\n')
      : '';

    let systemInstruction = `You are an expert AI software architect and conversation analyst. You are analyzing a technical conversation log/transcript titled "${conversationTitle || 'Referenced Conversation'}".`;
    let userPrompt = '';

    if (action === 'summarize') {
      userPrompt = `Please provide a concise, high-impact Executive Summary and key architectural takeaways from the following conversation transcript. Include bullet points for main decisions, technical stacks discussed, and unresolved questions:\n\n${transcriptText}`;
    } else if (action === 'action_items') {
      userPrompt = `Extract all actionable tasks, next steps, TODOs, and implementation requirements mentioned or implied in this conversation transcript. Group them by category (e.g. Frontend, Backend, Architecture, DevOps):\n\n${transcriptText}`;
    } else if (action === 'extract_architecture') {
      userPrompt = `Analyze the software architecture, design patterns, schemas, and data flows discussed in this conversation. Output a clear architectural breakdown with ASCII diagrams or structured component descriptions:\n\n${transcriptText}`;
    } else if (action === 'continue' || action === 'ask') {
      userPrompt = `Based on the following conversation transcript:\n\n${transcriptText}\n\nUser Question/Instruction: ${prompt || 'Continue the discussion thoughtfully and provide the next logical technical recommendation or solution.'}`;
    } else {
      userPrompt = prompt || `Summarize the conversation:\n\n${transcriptText}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });

    const responseText = response.text || 'No response generated.';
    return NextResponse.json({ result: responseText });
  } catch (error: unknown) {
    console.error('Error generating Gemini analysis:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
