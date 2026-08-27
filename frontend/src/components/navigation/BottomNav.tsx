import { Home, Settings } from 'lucide-react';

interface Props {
  onHomeClick: () => void;
  onSettingsClick: () => void;
}

export function BottomNav({ onHomeClick, onSettingsClick }: Props) {
  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        <button className="nav-btn" onClick={onHomeClick} aria-label="Home">
          <Home size={28} />
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-btn" onClick={onSettingsClick} aria-label="Settings">
          <Settings size={28} />
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </nav>
  );
}
