import { Home, Settings, PlusCircle } from 'lucide-react';

interface Props {
  onHomeClick: () => void;
  onSettingsClick: () => void;
  onUploadClick: () => void;
  activeTab?: 'home' | 'settings' | 'upload';
}

export function BottomNav({ onHomeClick, onSettingsClick, onUploadClick, activeTab = 'home' }: Props) {
  return (
    <nav className="bottom-nav">
      <div className="nav-group">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={onHomeClick} aria-label="Home">
          <Home size={24} />
          <span className="nav-label">Home</span>
        </button>
        <button className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={onUploadClick} aria-label="Upload">
          <PlusCircle size={24} />
          <span className="nav-label">Create</span>
        </button>
        <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={onSettingsClick} aria-label="Settings">
          <Settings size={24} />
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </nav>
  );
}
