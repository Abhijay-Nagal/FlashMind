import { useState, useRef } from 'react';
import type { Flashcard as FlashcardType } from '../../types/flashcard';
import { FlashcardFront } from './FlashcardFront';
import { FlashcardBack } from './FlashcardBack';

interface Props {
  card: FlashcardType;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
  canSwipeUp: boolean;
  canSwipeDown: boolean;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export function Flashcard({ 
  card, 
  onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown,
  canSwipeLeft, canSwipeRight, canSwipeUp, canSwipeDown,
  isFlipped, setIsFlipped 
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating || exitDirection) return;
    
    // Don't drag if they are interacting with the MCQ buttons
    if ((e.target as HTMLElement).closest('.mcq-option-btn')) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    
    if (cardRef.current) {
        cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    // Calculate resistance based on whether swipe is allowed
    let appliedDx = dx;
    let appliedDy = dy;
    
    if (dx < 0 && !canSwipeLeft) appliedDx = dx * 0.15; // Hard resistance if can't swipe
    else if (dx > 0 && !canSwipeRight) appliedDx = dx * 0.15;
    else if (dx > 0) appliedDx = dx * 0.5; // Slight resistance in opposite direction

    if (dy < 0 && !canSwipeUp) appliedDy = dy * 0.15;
    else if (dy > 0 && !canSwipeDown) appliedDy = dy * 0.15;
    else if (dy > 0) appliedDy = dy * 0.5;
    
    setDeltaX(appliedDx);
    setDeltaY(appliedDy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (cardRef.current) {
        cardRef.current.releasePointerCapture(e.pointerId);
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Is it a tap? (Very small movement)
    if (absX < 10 && absY < 10) {
      setIsFlipped(!isFlipped);
      setDeltaX(0);
      setDeltaY(0);
      return;
    }

    const SWIPE_THRESHOLD = 80;

    // Is it a swipe left?
    if (deltaX < -SWIPE_THRESHOLD && absX > absY && canSwipeLeft) {
      setExitDirection('left');
      setIsAnimating(true);
      setTimeout(() => onSwipeLeft(), 300);
      return;
    }

    // Is it a swipe right?
    if (deltaX > SWIPE_THRESHOLD && absX > absY && canSwipeRight) {
      setExitDirection('right');
      setIsAnimating(true);
      setTimeout(() => onSwipeRight(), 300);
      return;
    }

    // Is it a swipe up?
    if (deltaY < -SWIPE_THRESHOLD && absY > absX && canSwipeUp) {
      setExitDirection('up');
      setIsAnimating(true);
      setTimeout(() => onSwipeUp(), 300);
      return;
    }
    
    // Is it a swipe down?
    if (deltaY > SWIPE_THRESHOLD && absY > absX && canSwipeDown) {
      setExitDirection('down');
      setIsAnimating(true);
      setTimeout(() => onSwipeDown(), 300);
      return;
    }

    // Not a valid swipe (or hit an endpoint), return to center
    setIsAnimating(true);
    setDeltaX(0);
    setDeltaY(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Calculate dynamic transform based on drag or exit animation
  let transform = '';
  let opacity = 1;
  
  if (exitDirection === 'left') {
    transform = `translateX(-150vw) rotate(-15deg)`;
    opacity = 0;
  } else if (exitDirection === 'right') {
    transform = `translateX(150vw) rotate(15deg)`;
    opacity = 0;
  } else if (exitDirection === 'up') {
    transform = `translateY(-150vh) rotate(10deg)`;
    opacity = 0;
  } else if (exitDirection === 'down') {
    transform = `translateY(150vh) rotate(-10deg)`;
    opacity = 0;
  } else if (isDragging || isAnimating) {
    const rotate = deltaX * 0.05; // slight rotation while dragging
    transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
  }

  return (
    <div 
      className="flashcard-drag-container"
      style={{ 
        transform,
        opacity,
        transition: isAnimating ? 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
      }}
    >
      <div 
        ref={cardRef}
        className={`flashcard-flip-container ${isFlipped ? 'flipped' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <FlashcardFront card={card} />
        <FlashcardBack card={card} />
      </div>
    </div>
  );
}
