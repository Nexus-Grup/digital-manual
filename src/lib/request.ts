/** Faz a chamada e devolve a mensagem de erro, ou null se deu certo. */
export async function request(url: string, method: string, body?: unknown): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data.error ?? 'Something went wrong';
  } catch {
    return 'Network error. Try again.';
  }
}