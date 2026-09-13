'use client';

import { useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';

export function LoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) { setError(data.error ?? 'Acesso recusado.'); return; }
      window.location.assign('/dashboard');
    } catch { setError('Falha de ligação.'); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Senha de acesso MVP</span><input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!configured || loading} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15" placeholder="••••••••••" /></label>
      {error ? <p className="text-xs font-medium text-red-300">{error}</p> : null}
      {!configured ? <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">Configure ADMIN_MVP_PASSWORD e ADMIN_SESSION_SECRET no ambiente do projeto Admin para liberar o preview.</p> : null}
      <button disabled={!configured || loading || !password} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-[0_10px_28px_rgba(37,99,235,.28)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}Entrar no Control Plane</button>
    </form>
  );
}
