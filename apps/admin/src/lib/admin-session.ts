import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'ah_admin_mvp';

function configured() {
  return Boolean(process.env.ADMIN_MVP_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function digest(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? '';
  return createHash('sha256').update(`${secret}:${value}`).digest('hex');
}

export function adminSessionConfigured() {
  return configured();
}

export function verifyAdminPassword(input: string) {
  const expected = process.env.ADMIN_MVP_PASSWORD;
  if (!configured() || !expected) return false;
  const a = Buffer.from(digest(`password:${input}`));
  const b = Buffer.from(digest(`password:${expected}`));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminSessionToken() {
  const password = process.env.ADMIN_MVP_PASSWORD;
  if (!configured() || !password) return null;
  return digest(`session:${password}`);
}

export async function hasAdminSession() {
  const expected = adminSessionToken();
  if (!expected) return false;
  const store = await cookies();
  const actual = store.get(ADMIN_COOKIE)?.value;
  if (!actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) redirect('/login');
}
