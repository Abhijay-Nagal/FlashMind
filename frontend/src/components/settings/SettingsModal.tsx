import { X, Moon, Sun, Monitor } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface Props {
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function SettingsModal({ onClose, theme, setTheme }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close Settings"><X size={24} /></button>
        </div>
        
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="theme-options">
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={20} />
              <span>Light</span>
            </button>
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={20} />
              <span>Dark</span>
            </button>
            <button 
              className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
              onClick={() => setTheme('system')}
            >
              <Monitor size={20} />
              <span>System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
