import { z } from 'zod';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(16),
  market: z.enum(['BR', 'EU']).default('BR'),
  path: z.string().max(500).optional(),
});

type ProviderMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const DEFAULT_SYSTEM_PROMPT = `Você é o assistente AutoHub360. Ajude o cliente a escolher produtos e serviços de tecnologia automotiva, mobilidade, segurança e smart living. Seja objetivo e técnico. Nunca invente preço, estoque, compatibilidade, prazo de entrega, garantia ou condição comercial. Quando um dado não estiver disponível no contexto, diga que precisa ser confirmado pela equipe. Não peça senhas, dados completos de cartão ou documentos sensíveis. Diferencie claramente a operação Brasil da operação Europa.`;

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * OpenAI-compatible chat adapter. Works with OpenRouter, Vercel AI Gateway or another
 * compatible endpoint by environment configuration; provider secrets never reach the browser.
 */
export async function handleAIChatRequest(request: Request): Promise<Response> {
  const enabled = process.env.AI_CHAT_ENABLED === 'true';
  const baseUrl = process.env.AI_CHAT_BASE_URL?.replace(/\/$/, '');
  const apiKey = process.env.AI_CHAT_API_KEY;
  const model = process.env.AI_CHAT_MODEL;

  if (!enabled || !baseUrl || !apiKey || !model) {
    return jsonError('O assistente IA está em configuração. Use o WhatsApp para atendimento imediato.', 503);
  }

  let input: z.infer<typeof chatRequestSchema>;
  try {
    input = chatRequestSchema.parse(await request.json());
  } catch {
    return jsonError('Mensagem inválida.', 400);
  }

  const marketContext =
    input.market === 'EU'
      ? 'Mercado atual: Europa. Moeda: EUR. A operação europeia é AutoHub360 Europe, operada pela Auto Lux Europe SAS. Não prometa checkout ou logística enquanto estiverem desativados.'
      : 'Mercado atual: Brasil. Moeda: BRL. Operação: AutoHub360 Brasil. Instalação local pode ser oferecida em Anápolis - GO quando aplicável.';

  const systemPrompt = process.env.AI_CHAT_SYSTEM_PROMPT?.trim() || DEFAULT_SYSTEM_PROMPT;
  const messages: ProviderMessage[] = [
    { role: 'system', content: `${systemPrompt}\n\n${marketContext}\nPágina atual: ${input.path ?? '/'}` },
    ...input.messages.map((message) => ({ role: message.role, content: message.content })),
  ];

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        ...(process.env.AI_CHAT_HTTP_REFERER
          ? { 'HTTP-Referer': process.env.AI_CHAT_HTTP_REFERER }
          : {}),
        ...(process.env.AI_CHAT_APP_NAME ? { 'X-Title': process.env.AI_CHAT_APP_NAME } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.25,
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      console.error('AI chat provider error', response.status, await response.text());
      return jsonError('O assistente está temporariamente indisponível.', 502);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return jsonError('O assistente não retornou uma resposta válida.', 502);

    return new Response(JSON.stringify({ ok: true, reply }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    console.error('AI chat request failed', error);
    return jsonError('O assistente está temporariamente indisponível.', 502);
  }
}
