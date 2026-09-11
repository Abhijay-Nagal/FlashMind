import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Monitor, Moon, Sun } from 'lucide-react';
import { Sheet } from '../common/Sheet';
import { actions, useStore, type ThemePref } from '../../lib/store';
import { serverStatus } from '../../lib/llmClient';
import { toast } from '../../lib/toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: Props) {
  const settings = useStore((s) => s.settings);
  const [keyDraft, setKeyDraft] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [server, setServer] = useState<'checking' | 'ready' | 'nokey' | 'offline'>('checking');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    serverStatus().then((s) => alive && setServer(s.serverKey ? 'ready' : s.reachable ? 'nokey' : 'offline'));
    return () => {
      alive = false;
    };
  }, [open]);

  const saveKey = () => {
    const k = keyDraft.trim();
    actions.setSettings({ apiKey: k });
    toast(k ? 'AI key saved on this device' : 'AI key removed', k ? '🔑' : '🗑️');
  };

  const themes: { v: ThemePref; label: string; icon: React.ReactNode }[] = [
    { v: 'system', label: 'Auto', icon: <Monitor size={16} /> },
    { v: 'light', label: 'Light', icon: <Sun size={16} /> },
    { v: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  ];

  return (
    <Sheet
      open={open}
      onClose={() => {
        setConfirmReset(false);
        onClose();
      }}
      title="Settings"
    >
      <div className="settings">
        <section>
          <h3 className="eyebrow">Your name</h3>
          <input
            className="text-input"
            placeholder="What should Flashy call you?"
            value={settings.name}
            maxLength={24}
            onChange={(e) => actions.setSettings({ name: e.target.value })}
          />
        </section>

        <section>
          <h3 className="eyebrow">Appearance</h3>
          <div className="segmented">
            {themes.map((t) => (
              <button key={t.v} className={settings.theme === t.v ? 'active' : ''} onClick={() => actions.setSettings({ theme: t.v })}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="eyebrow">Next-topic gesture</h3>
          <div className="segmented">
            <button className={settings.nextTopicSwipe === 'up' ? 'active' : ''} onClick={() => actions.setSettings({ nextTopicSwipe: 'up' })}>
              <ArrowUp size={16} /> Swipe up
            </button>
            <button className={settings.nextTopicSwipe === 'down' ? 'active' : ''} onClick={() => actions.setSettings({ nextTopicSwipe: 'down' })}>
              <ArrowDown size={16} /> Swipe down
            </button>
          </div>
          <p className="setting-help">Swipe left always goes deeper into the current topic.</p>
        </section>

        <section>
          <h3 className="eyebrow">Daily goal</h3>
          <div className="segmented">
            {[10, 20, 30, 50].map((g) => (
              <button key={g} className={settings.dailyGoal === g ? 'active' : ''} onClick={() => actions.setSettings({ dailyGoal: g })}>
                {g} cards
              </button>
            ))}
          </div>
        </section>

        <section className="toggles">
          <button className="toggle-row" onClick={() => actions.setSettings({ sound: !settings.sound })} role="switch" aria-checked={settings.sound}>
            <span>
              <strong>Sound effects</strong>
              <span>Soft pops, flips and cheers</span>
            </span>
            <span className={`switch ${settings.sound ? 'on' : ''}`} />
          </button>
          <button className="toggle-row" onClick={() => actions.setSettings({ haptics: !settings.haptics })} role="switch" aria-checked={settings.haptics}>
            <span>
              <strong>Vibration</strong>
              <span>Haptic feedback on swipes and answers</span>
            </span>
            <span className={`switch ${settings.haptics ? 'on' : ''}`} />
          </button>
        </section>

        <section>
          <h3 className="eyebrow">AI engine</h3>
          <div className={`engine-box ${server}`}>
            <span className="engine-dot" />
            <span>
              {server === 'checking' && 'Checking the FlashMind server…'}
              {server === 'ready' && 'FlashMind server is ready — no key needed.'}
              {server === 'nokey' && 'The server has no AI key configured. Add your own below.'}
              {server === 'offline' && 'Server not reachable. Your own key will be used directly.'}
            </span>
          </div>
          <label className="setting-help" htmlFor="apikey">
            Optional: your own <strong>Groq API key</strong> (free at console.groq.com/keys). Stored only on this device.
          </label>
          <div className="key-row">
            <input
              id="apikey"
              className="text-input"
              type={showKey ? 'text' : 'password'}
              autoComplete="off"
              spellCheck={false}
              placeholder="gsk_…"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
            />
            <button className="icon-btn" onClick={() => setShowKey((s) => !s)} aria-label={showKey ? 'Hide key' : 'Show key'}>
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button className="btn btn-soft btn-block btn-sm" style={{ marginTop: 10 }} onClick={saveKey} disabled={keyDraft.trim() === settings.apiKey}>
            Save key
          </button>
        </section>

        <section>
          <h3 className="eyebrow">Help & data</h3>
          <button
            className="btn btn-soft btn-block btn-sm"
            onClick={() => {
              actions.setFlag({ gestureTutorial: false });
              toast('The gesture tutorial will show next time you study', '👆');
            }}
          >
            Replay gesture tutorial
          </button>
          <button
            className={`btn btn-block btn-sm ${confirmReset ? 'btn-danger' : 'btn-ghost'}`}
            style={{ marginTop: 8 }}
            onClick={() => {
              if (!confirmReset) return setConfirmReset(true);
              actions.resetAll();
              setConfirmReset(false);
              toast('Everything was reset', '🧹');
            }}
          >
            {confirmReset ? 'Tap again to erase all decks & progress' : 'Reset all data'}
          </button>
        </section>

        <p className="about">
          FlashMind · cards are generated only from the PDFs you upload.
          <br />
          Made with 💚 for curious minds.
        </p>
      </div>
    </Sheet>
  );
}
