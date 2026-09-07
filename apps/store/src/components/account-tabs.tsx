'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Heart,
  Loader2,
  LogIn,
  Mail,
  MessageCircle,
  PackageSearch,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button, Card, Field, Input } from '@autohub360/ui';
import { authConfigured, supabaseBrowser } from '@autohub360/auth';
import { whatsappLink } from '@autohub360/config';
import { useFitmentStore } from '@autohub360/vehicle-fitment';

export type AccountTab = 'entrar' | 'favoritos' | 'garagem';

const TABS: Array<{ id: AccountTab; label: string }> = [
  { id: 'entrar', label: 'Entrar / Cadastrar' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'garagem', label: 'Garagem' },
];

export function AccountTabs({ initialTab }: { initialTab: AccountTab }) {
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const configured = authConfigured();

  useEffect(() => setMounted(true), []);

  return (
    <div>
      {/* Tabs */}
      <div role="tablist" aria-label="Área do cliente" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-navy-900 text-white'
                : 'border border-surface-300 bg-white text-ink-700 hover:border-ahblue-400'
            }`}
          >
            {t.label}
          </button>
        ))}
        <Link
          href="/conta/pedidos"
          role="tab"
          aria-selected={false}
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ahblue-400"
        >
          <PackageSearch className="h-4 w-4" aria-hidden="true" />
          Meus pedidos
        </Link>
      </div>

      <div className="mt-6">
        {tab === 'entrar' && <AuthPanel configured={configured && mounted} />}
        {tab === 'favoritos' && <FavoritesPanel mounted={mounted} />}
        {tab === 'garagem' && <GaragePanel mounted={mounted} />}
      </div>
    </div>
  );
}

function AuthPanel({ configured }: { configured: boolean }) {
  const [mode, setMode] = useState<'entrar' | 'cadastrar'>('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [okMsg, setOkMsg] = useState('');
  const router = useRouter();

  if (!configured) {
    return (
      <Card className="p-6 sm:p-8">
        <h2 className="font-display text-lg font-extrabold text-ink-900">
          Área do cliente em configuração
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-700">
          O login por conta ainda não está disponível nesta vitrine. Enquanto isso, acompanhe seus
          pedidos pelo e-mail informado no checkout ou pelo WhatsApp — é rápido e não precisa de
          senha.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/conta/pedidos" variant="primary">
            <PackageSearch className="h-4.5 w-4.5" aria-hidden="true" />
            Consultar pedido por número
          </Button>
          <Button href={whatsappLink('support')} variant="outline-dark">
            <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
            Suporte no WhatsApp
          </Button>
        </div>
        <p className="mt-5 text-sm text-ink-500">
          <strong className="text-ink-900">Não é preciso conta para comprar.</strong> O checkout de
          convidado está sempre disponível.
        </p>
      </Card>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOkMsg('');
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError('Autenticação indisponível no momento.');
      return;
    }
    setPending(true);
    try {
      if (mode === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError('Não foi possível entrar: verifique e-mail e senha.');
        else router.push('/conta/pedidos');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError('Não foi possível cadastrar: ' + error.message);
        else
          setOkMsg(
            'Cadastro iniciado! Confira seu e-mail para confirmar a conta antes de entrar.',
          );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex gap-2">
        {(
          [
            { id: 'entrar' as const, label: 'Entrar', icon: LogIn },
            { id: 'cadastrar' as const, label: 'Cadastrar', icon: UserPlus },
          ]
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => {
              setMode(m.id);
              setError('');
              setOkMsg('');
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              mode === m.id
                ? 'bg-ahblue-500 text-white'
                : 'bg-surface-100 text-ink-700 hover:bg-surface-200'
            }`}
          >
            <m.icon className="h-4 w-4" aria-hidden="true" />
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid max-w-md gap-4">
        <Field label="E-mail" htmlFor="acc-email">
          <Input
            id="acc-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field
          label="Senha"
          htmlFor="acc-pass"
          hint={mode === 'cadastrar' ? 'Mínimo de 8 caracteres. Evite senhas reutilizadas.' : undefined}
        >
          <Input
            id="acc-pass"
            type="password"
            autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'}
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        {okMsg && (
          <p role="status" className="text-sm font-medium text-emerald-600">
            {okMsg}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" /> : null}
          {mode === 'entrar' ? 'Entrar' : 'Criar conta'}
        </Button>
        <p className="text-sm text-ink-500">
          Não é preciso conta para comprar — o checkout de convidado está sempre disponível.
        </p>
      </form>
    </Card>
  );
}

function FavoritesPanel({ mounted }: { mounted: boolean }) {
  return (
    <Card className="p-8 text-center sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-ink-500">
        <Heart className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-lg font-extrabold text-ink-900">
        Nenhum favorito salvo
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
        {mounted
          ? 'Toque no coração dos produtos que você gostou para encontrá-los aqui depois.'
          : 'Carregando seus favoritos…'}
      </p>
      <Button href="/buscar" className="mt-6">
        Explorar produtos
      </Button>
    </Card>
  );
}

function GaragePanel({ mounted }: { mounted: boolean }) {
  const garage = useFitmentStore((s) => s.garage);
  const removeFromGarage = useFitmentStore((s) => s.removeFromGarage);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(mounted), [mounted]);

  if (!ready) {
    return (
      <Card className="flex items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-ahblue-500" aria-label="Carregando garagem" />
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink-900">
        <Car className="h-5 w-5 text-ahblue-500" aria-hidden="true" />
        Sua garagem
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Veículos salvos para verificar compatibilidade rapidamente.
      </p>

      {garage.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface-50 p-6 text-center">
          <p className="text-[15px] text-ink-700">
            Nenhum veículo na garagem ainda. Use o{' '}
            <Link href="/veiculo" className="font-semibold text-ahblue-600 hover:underline">
              seletor de veículo
            </Link>{' '}
            para salvar o seu.
          </p>
          <Button href="/veiculo" className="mt-4">
            Adicionar veículo
          </Button>
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {garage.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ahblue-500/10 text-ahblue-600">
                  <Car className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{g.label}</p>
                  <p className="text-xs text-ink-500">
                    Salvo em{' '}
                    {new Date(g.savedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFromGarage(g.id)}
                aria-label={`Remover ${g.label} da garagem`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 flex items-center gap-1.5 text-xs text-ink-500">
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        A garagem fica salva neste dispositivo; quando a conta estiver ativa, ela será sincronizada
        ao seu perfil.
      </p>
    </Card>
  );
}
