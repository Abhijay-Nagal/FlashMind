import { motion } from 'framer-motion';
import { Home, Plus, Trophy } from 'lucide-react';

export type Tab = 'home' | 'create' | 'stats';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar-inner">
        <button className={`tab ${active === 'home' ? 'active' : ''}`} onClick={() => onChange('home')} aria-current={active === 'home'}>
          <Home size={23} strokeWidth={2.2} />
          Home
          {active === 'home' && <motion.span layoutId="tab-dot" className="tab-dot" />}
        </button>
        <button
          className={`tab-fab ${active === 'create' ? 'active' : ''}`}
          onClick={() => onChange('create')}
          aria-label="Create deck from PDF"
          aria-current={active === 'create'}
        >
          <Plus size={30} strokeWidth={2.6} />
        </button>
        <button className={`tab ${active === 'stats' ? 'active' : ''}`} onClick={() => onChange('stats')} aria-current={active === 'stats'}>
          <Trophy size={23} strokeWidth={2.2} />
          Progress
          {active === 'stats' && <motion.span layoutId="tab-dot" className="tab-dot" />}
        </button>
      </div>
    </nav>
  );
}
