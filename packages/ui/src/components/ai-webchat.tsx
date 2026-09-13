'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { Bot, ChevronDown, Send, Sparkles, X } from 'lucide-react';
import { useMarket } from './market-context';
import { cn } from '../lib/cn';

type Message = { role: 'user' | 'assistant'; content: string };

function OrbitMark({ active = false }: { active?: boolean }) {
  const spokes = useMemo(() => [0, 45, 90, 135], []);
  return (
    <span className="relative flex h-10 w-10 items-center justify-center" aria-hidden="true">
      <span
        className={cn(
          'absolute inset-0 rounded-full border border-ahblue-300/70 border-r-ahorange-400/90 shadow-[0_0_22px_rgba(30,111,235,.34)]',
          active ? 'animate-[spin_1.4s_linear_infinite]' : 'animate-[spin_9s_linear_infinite]',
        )}
      />
      <span className="absolute inset-[5px] rounded-full border border-white/15 bg-[#06172a]/90" />
      {spokes.map((deg) => (
        <span
          key={deg}
          className="absolute h-[1px] w-5 rounded-full bg-gradient-to-r from-transparent via-ahblue-300 to-transparent opacity-75"
          style={{ transform: `rotate(${deg}deg)` }}
        />
      ))}
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-ahblue-400 to-ahblue-700 shadow-[0_0_16px_rgba(30,111,235,.55)]">
        <Sparkles className="h-3 w-3 text-white" />
      </span>
    </span>
  );
}

export function AIWebChat({ endpoint = '/api/ai-chat' }: { endpoint?: string }) {
  const { market } = useMarket();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        market === 'EU'
          ? 'Olá! Sou o assistente AutoHub360. Posso ajudar com produtos, tecnologia automotiva e a futura operação europeia.'
          : 'Olá! Sou o assistente AutoHub360. Posso ajudar a escolher produtos, verificar dúvidas técnicas e orientar sobre instalação em Anápolis.',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    const userMessage: Message = { role: 'user', content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
          market,
          path: window.location.pathname + window.location.search,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; reply?: string; error?: string };
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            data.reply ||
            data.error ||
            'Não consegui responder agora. O atendimento humano continua disponível pelo WhatsApp.',
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: 'A ligação ao assistente está indisponível neste momento. Pode continuar pelo WhatsApp.',
        },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }));
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-[86px] z-50 flex items-center gap-2 rounded-full border border-ahblue-300/25 bg-[#041326]/95 p-2 pr-3 text-white shadow-[0_14px_40px_rgba(2,11,22,.45)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
        aria-label="Abrir assistente AutoHub360"
      >
        <OrbitMark />
        <span className="hidden pr-1 text-left sm:block">
          <strong className="block font-display text-[11px] leading-tight">AutoHub AI</strong>
          <span className="text-[9px] text-ahblue-200">Pergunte ao especialista</span>
        </span>
      </button>
    );
  }

  return (
    <section
      className={cn(
        'fixed bottom-5 right-4 z-50 w-[calc(100vw-2rem)] overflow-hidden rounded-[22px] border border-white/10 bg-[#041326]/97 text-white shadow-[0_28px_80px_rgba(1,8,18,.58)] backdrop-blur-2xl sm:right-5 sm:w-[390px]',
        minimized && 'w-auto sm:w-[310px]',
      )}
      aria-label="Assistente AutoHub360"
    >
      <header className="relative flex items-center gap-3 overflow-hidden border-b border-white/10 px-4 py-3.5">
        <div className="pointer-events-none absolute -right-10 -top-16 h-32 w-32 rounded-full bg-ahblue-500/20 blur-3xl" />
        <OrbitMark active={sending} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-extrabold">AutoHub AI</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Assistente
            </span>
          </div>
          <p className="truncate text-[10px] text-slate-400">
            {market === 'BR' ? 'Brasil · produtos, compatibilidade e instalação' : 'Europa · catálogo e informações'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMinimized((value) => !value)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label={minimized ? 'Expandir chat' : 'Minimizar chat'}
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', minimized && 'rotate-180')} />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Fechar chat"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {!minimized && (
        <>
          <div ref={scrollRef} className="ah-scroll-slim max-h-[390px] min-h-[270px] space-y-3 overflow-y-auto bg-gradient-to-b from-[#06172a]/55 to-[#020b16]/80 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn('flex gap-2.5', message.role === 'user' && 'justify-end')}
              >
                {message.role === 'assistant' && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ahblue-400/25 bg-ahblue-500/10 text-ahblue-300">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                )}
                <p
                  className={cn(
                    'max-w-[82%] rounded-2xl px-3 py-2.5 text-[12px] leading-relaxed',
                    message.role === 'assistant'
                      ? 'rounded-tl-sm border border-white/8 bg-white/[0.055] text-slate-200'
                      : 'rounded-tr-sm bg-ahblue-500 text-white shadow-[0_6px_18px_rgba(30,111,235,.24)]',
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <OrbitMark active />
                A analisar a sua pergunta…
              </div>
            )}
          </div>

          <form onSubmit={submit} className="border-t border-white/10 bg-[#041326] p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.055] p-1.5 pl-3 focus-within:border-ahblue-400/45">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                maxLength={4000}
                placeholder="Pergunte sobre produto, instalação, compatibilidade…"
                className="max-h-24 min-h-9 flex-1 resize-none bg-transparent py-2 text-[12px] text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ahblue-500 text-white transition-colors hover:bg-ahblue-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar mensagem"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[8.5px] leading-relaxed text-slate-500">
              A IA pode cometer erros. Preços, estoque e compatibilidade devem ser confirmados antes da compra.
            </p>
          </form>
        </>
      )}
    </section>
  );
}
