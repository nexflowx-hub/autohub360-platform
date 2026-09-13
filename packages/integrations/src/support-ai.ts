export interface SupportAIDraftInput {
  subject: string;
  customerMessage: string;
  market: 'BR' | 'EU';
  orderContext?: string;
  conversation?: Array<{ role: 'customer' | 'agent' | 'ai'; body: string }>;
}

export interface SupportAIDraftResult {
  ok: boolean;
  reply?: string;
  model?: string;
  error?: string;
}

const SYSTEM = `Você é o copiloto de pós-venda da AutoHub360. Gere apenas um rascunho para revisão humana. Seja cordial, objetivo e técnico. Nunca invente estoque, garantia, compatibilidade, entrega, reembolso ou estado de pagamento. Use apenas o contexto fornecido. Se faltar informação crítica, peça confirmação e sinalize que um agente deve validar. Nunca peça número completo de cartão, senha ou documento sensível. Em reclamações, segurança, acidente, ameaça legal ou dúvida de garantia, recomende escalonamento humano.`;

export async function generateSupportAIDraft(input: SupportAIDraftInput): Promise<SupportAIDraftResult> {
  const enabled = process.env.AI_CHAT_ENABLED === 'true';
  const baseUrl = process.env.AI_CHAT_BASE_URL?.replace(/\/$/, '');
  const apiKey = process.env.AI_CHAT_API_KEY;
  const model = process.env.AI_CHAT_MODEL;
  if (!enabled || !baseUrl || !apiKey || !model) {
    return { ok: false, error: 'IA não configurada no ambiente.' };
  }

  const market = input.market === 'EU' ? 'Europa / EUR / AutoHub360 Europe' : 'Brasil / BRL / AutoHub360 Brasil';
  const history = (input.conversation ?? [])
    .slice(-10)
    .map((m) => `${m.role.toUpperCase()}: ${m.body}`)
    .join('\n');

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        ...(process.env.AI_CHAT_HTTP_REFERER ? { 'HTTP-Referer': process.env.AI_CHAT_HTTP_REFERER } : {}),
        ...(process.env.AI_CHAT_APP_NAME ? { 'X-Title': `${process.env.AI_CHAT_APP_NAME} Support` } : {}),
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 650,
        messages: [
          { role: 'system', content: SYSTEM },
          {
            role: 'user',
            content: `Mercado: ${market}\nAssunto: ${input.subject}\nContexto do pedido: ${input.orderContext ?? 'não informado'}\nMensagem atual do cliente: ${input.customerMessage}\nHistórico recente:\n${history || 'sem histórico adicional'}\n\nProduza o rascunho da resposta.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return { ok: false, error: `Provider IA HTTP ${response.status}` };
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply ? { ok: true, reply, model } : { ok: false, error: 'Provider IA sem resposta válida.' };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Falha ao gerar rascunho IA.' };
  }
}
