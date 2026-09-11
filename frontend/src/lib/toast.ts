import { useSyncExternalStore } from 'react';

export interface ToastItem {
  id: number;
  text: string;
  icon?: string;
}

let toasts: ToastItem[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const lastShown = new Map<string, number>();

function emit() {
  listeners.forEach((l) => l());
}

/** Shows a short message. Identical messages are throttled. */
export function toast(text: string, icon?: string, ms = 2400) {
  const now = Date.now();
  if ((lastShown.get(text) ?? 0) > now - 1500) return;
  lastShown.set(text, now);
  const t = { id: ++seq, text, icon };
  toasts = [...toasts.slice(-2), t];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    emit();
  }, ms);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
  );
}
