import { Zap } from 'lucide-react';

interface Props {
  animated?: boolean;
  className?: string;
}

export function Logo({ animated = false, className = '' }: Props) {
  return (
    <div className={`logo-wrapper ${animated ? 'animated-logo' : 'static-logo'} ${className}`}>
      <div className="logo-cards">
        <div className="logo-card card-4"></div>
        <div className="logo-card card-3"></div>
        <div className="logo-card card-2"></div>
        <div className="logo-card card-1">
          <Zap className="lightning-icon" fill="currentColor" />
        </div>
      </div>
      <div className="logo-text-container">
        <h1 className="logo-title">FlashMind</h1>
        <p className="logo-tagline">LEARN ANYWHERE</p>
      </div>
    </div>
  );
}
