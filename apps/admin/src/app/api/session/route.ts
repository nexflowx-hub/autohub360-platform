import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_COOKIE, adminSessionToken, verifyAdminPassword } from '@/lib/admin-session';

export const runtime = 'nodejs';
const schema = z.object({ password: z.string().min(1).max(256) });

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success || !verifyAdminPassword(input.data.password)) {
    return NextResponse.json({ ok: false, error: 'Credenciais inválidas ou acesso não configurado.' }, { status: 401 });
  }
  const token = adminSessionToken();
  if (!token) return NextResponse.json({ ok: false, error: 'Ambiente Admin não configurado.' }, { status: 503 });
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true });
}
