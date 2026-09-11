import {
  DEFAULT_BASE_URL,
  DEFAULT_MODELS,
  generateSection,
  type GenerateError,
  type GenerateRequest,
  type GenerateResponse,
} from '../../api/generate';
import { getState } from './store';

/**
 * Where section requests go. Defaults to the same-origin Vercel function.
 * Point VITE_GENERATE_URL at another server (e.g. the institute GPU backend in
 * /backend) — it only has to implement the same POST contract.
 */
const ENDPOINT: string = import.meta.env.VITE_GENERATE_URL || '/api/generate';

export class GenError extends Error {
  kind: GenerateError['error'] | 'no_server' | 'network';
  retryAfter?: number;
  constructor(kind: GenError['kind'], message: string, retryAfter?: number) {
    super(message);
    this.kind = kind;
    this.retryAfter = retryAfter;
  }
}

async function direct(req: GenerateRequest, apiKey: string): Promise<GenerateResponse> {
  const r = await generateSection(req, { baseUrl: DEFAULT_BASE_URL, apiKey, models: DEFAULT_MODELS });
  if (r.ok) return r.data;
  throw new GenError(r.error.error, r.error.message, r.error.retryAfter);
}

export async function requestSection(req: GenerateRequest, signal?: AbortSignal): Promise<GenerateResponse> {
  const apiKey = getState().settings.apiKey.trim();
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(apiKey ? { 'x-llm-key': apiKey } : {}) },
      body: JSON.stringify(req),
      signal,
    });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    if (!navigator.onLine) throw new GenError('network', "You're offline. Connect to the internet to create cards.");
    if (apiKey) return direct(req, apiKey);
    throw new GenError('network', 'Could not reach the FlashMind server.');
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (!isJson || res.status === 404 || res.status === 405) {
    // No generation server here (e.g. static hosting) → use the user's key directly.
    if (apiKey) return direct(req, apiKey);
    throw new GenError('no_server', 'The generation server is not available.');
  }

  const data = await res.json();
  if (res.ok) return data as GenerateResponse;
  const err = data as GenerateError;
  const retry = Number(res.headers.get('retry-after')) || err.retryAfter;
  throw new GenError(err.error ?? 'provider_error', err.message ?? `Server error ${res.status}`, retry);
}

export async function serverStatus(): Promise<{ reachable: boolean; serverKey: boolean }> {
  try {
    const res = await fetch(ENDPOINT, { method: 'GET' });
    if (!(res.headers.get('content-type') || '').includes('application/json')) return { reachable: false, serverKey: false };
    const d = await res.json();
    return { reachable: true, serverKey: !!d.serverKey };
  } catch {
    return { reachable: false, serverKey: false };
  }
}
