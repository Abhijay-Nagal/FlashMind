import { useEffect, useRef } from 'react';

/**
 * Makes the phone's back button / back gesture close the top-most layer
 * (sheet → quiz/study screen → tab) instead of leaving the app.
 *
 * We keep at most ONE extra "guard" history entry while any layer is open and
 * never call history.back() ourselves — programmatic back() calls race with
 * each other and can navigate out of the app.
 */

interface Entry {
  cb: () => void;
}

const stack: Entry[] = [];
let guarded = false;

function ensureGuard() {
  if (guarded) return;
  try {
    history.pushState({ fmGuard: Date.now() }, '');
    guarded = true;
  } catch {
    /* sandboxed iframe etc. */
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    guarded = false; // the guard entry was just consumed
    const top = stack.pop();
    top?.cb();
    if (stack.length) ensureGuard();
  });
}

export function useBackHandler(active: boolean, onBack: () => void) {
  const cbRef = useRef(onBack);
  useEffect(() => {
    cbRef.current = onBack;
  });

  useEffect(() => {
    if (!active) return;
    const entry: Entry = { cb: () => cbRef.current() };
    stack.push(entry);
    ensureGuard();
    return () => {
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [active]);
}
