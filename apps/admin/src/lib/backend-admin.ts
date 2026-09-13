import 'server-only';

const API_URL = (process.env.AUTOHUB_BACKEND_URL || 'https://api.autohub360.tech').replace(/\/$/, '');

export function backendAdminConfigured() {
  return Boolean(process.env.AUTOHUB_BACKEND_INTERNAL_TOKEN);
}

export async function backendAdminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.AUTOHUB_BACKEND_INTERNAL_TOKEN;
  if (!token) throw new Error('AUTOHUB_BACKEND_INTERNAL_TOKEN_NOT_CONFIGURED');

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });

  const body = await response.json().catch(() => null) as T | null;
  if (!response.ok) {
    const error = new Error(`AUTOHUB_BACKEND_HTTP_${response.status}`) as Error & { status?: number; body?: unknown };
    error.status = response.status;
    error.body = body;
    throw error;
  }
  if (body === null) throw new Error('AUTOHUB_BACKEND_INVALID_JSON');
  return body;
}
