const BASE = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:3001';

const TOKEN_KEY = 'quiztech_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // express-validator returns { errors: [{msg, path}] }
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(data.errors.map((e: { msg: string }) => e.msg).join(', '));
    }
    throw new Error(data.error ?? `Erro ${res.status}`);
  }

  return data as T;
}

export const api = {
  get:    <T>(path: string)                   => request<T>(path),
  post:   <T>(path: string, body: unknown)    => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)    => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)                   => request<T>(path, { method: 'DELETE' }),
};
