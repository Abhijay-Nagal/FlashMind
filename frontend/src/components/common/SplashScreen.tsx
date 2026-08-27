import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out after the sequence finishes (about 3 seconds)
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3200);

    // Complete splash screen and unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3700);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <Logo animated={true} />
    </div>
  );
}
