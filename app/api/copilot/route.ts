import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave GEMINI_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { action, symptom, assetInfo, condominiumName, userMessage, conversationHistory } = body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    if (action === 'DIAGNOSTIC') {
      const prompt = `Você é o Copilot de Engenharia de Manutenção Predial 4.0 do sistema ZX 360º / ZX2026 PRO.
Analise a falha ou sintoma relatado para o seguinte equipamento em condomínio:

Equipamento / Ativo: ${assetInfo?.name || 'Equipamento Geral'}
Categoria: ${assetInfo?.category || 'Geral'}
Localização: ${assetInfo?.location || 'Não especificada'}
Especificações: ${JSON.stringify(assetInfo?.specifications || {})}
Sintoma / Telemetria Anormal: "${symptom}"
Normas de Referência: ${assetInfo?.normativeRef || 'NBR 5674 / NRs'}

Por favor, forneça um diagnóstico técnico objetivo e estruturado em formato JSON rigoroso com a seguinte estrutura:
{
  "probableCause": "Explicação técnica da causa raiz mais provável (ex: cavitação, desgaste de rolamento, sobreaquecimento, desbalanceamento)",
  "suggestedParts": ["Lista de peças ou consumíveis recomendados para o reparo"],
  "safetyRequirements": ["Normas Regulamentadoras e EPIs/procedimentos obrigatórios (ex: NR-10 para desenergização, NR-33 para espaço confinado, NR-35)"],
  "estimatedHours": 2.5,
  "recommendedActions": [
    "Passo 1: Bloqueio LOTO...",
    "Passo 2: Inspeção visual e medição...",
    "Passo 3: Troca e alinhamento...",
    "Passo 4: Teste operacional e coleta de assinatura"
  ],
  "technicalNotes": "Observação de engenharia para prevenção de reincidência"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        }
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          probableCause: text,
          suggestedParts: ['Peça padrão de reposição'],
          safetyRequirements: ['NR-06 (EPI)', 'NR-10'],
          estimatedHours: 2,
          recommendedActions: ['Verificar ativo e realizar testes'],
          technicalNotes: 'Inspeção recomendada'
        });
      }
    }

    if (action === 'PMOC_REPORT') {
      const prompt = `Você é o Engenheiro Mecânico Responsável Técnico (com CREA) pelo PMOC (Plano de Manutenção, Operação e Controle) do condomínio "${condominiumName || 'Condomínio Fortaleza Castelo de Grayskull'}".
Com base na Lei Federal 13.589/2018, Portaria MS 3.523/1998 e Resolução RE 09 da ANVISA:

Equipamento Climatizador: ${assetInfo?.name || 'Chiller Central / VRF'}
Dados Técnicos: ${JSON.stringify(assetInfo?.specifications || {})}
Últimas Medições: Temperatura de Água Gelada 6.8°C, Filtros G4/F7 higienizados, Drenos desinfetados, Ausência de fungos visíveis.

Gere um Relatório Técnico de Inspeção PMOC formal, em Markdown com as seções:
# RELATÓRIO TÉCNICO DE CONFORMIDADE PMOC - LEI FEDERAL 13.589/2018
- **Identificação do Empreendimento & Responsabilidade Técnica (ART)**
- **Condições Físico-Químicas e Microbiológicas do Sistema**
- **Ações Preventivas Executadas no Período**
- **Parâmetros de Conforto Térmico e Qualidade do Ar Interior**
- **Parecer Conclusivo de Engenharia e Próxima Revisão Obrigatória**`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        }
      });

      return NextResponse.json({ report: response.text });
    }

    // Default Chat / Assistant mode
    const systemInstruction = `Você é o Copilot de IA do ZX 360º (ZX2026 PRO), especialista em Engenharia de Manutenção Predial, Facilities Management, Smart Building 4.0 e Legislação Técnica Brasileira.
Você domina normas como:
- PMOC (Lei 13.589/18, Portaria MS 3.523, RE 09 Anvisa)
- AVCB / Incêndio (NBR 12693, NBR 13714, NBR 17240, NBR 10898, NBR 11742)
- Elétrica & SPDA (NBR 5410, NBR 5419, NR-10, NBR 14039)
- Hidráulica & Qualidade da Água (NBR 5626, Portaria GM/MS 888/21)
- Elevadores (NBR 16042, RIA)
- Segurança no Trabalho (NR-06, NR-13, NR-33, NR-35)
- Manutenção Predial e Reformas (NBR 5674, NBR 16280 com ART/RRT)

Responda de forma clara, altamente técnica, precisa e prestativa em Português do Brasil.`;

    const chatPrompt = conversationHistory && Array.isArray(conversationHistory) 
      ? `Histórico anterior:\n${conversationHistory.map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join('\n')}\n\nNova pergunta do usuário:\n${userMessage}`
      : userMessage;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: chatPrompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno ao processar Copilot IA';
    console.error('Error in Copilot API:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
