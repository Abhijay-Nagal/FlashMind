import { Home } from 'lucide-react';

interface Props {
  onHomeClick: () => void;
}

export function BottomNav({ onHomeClick }: Props) {
  return (
    <nav className="bottom-nav">
      <button className="nav-btn" onClick={onHomeClick} aria-label="Home">
        <Home size={28} />
        <span className="nav-label">Home</span>
      </button>
    </nav>
  );
}
