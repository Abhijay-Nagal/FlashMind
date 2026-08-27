import { useState, useRef } from 'react';
import type { Flashcard as FlashcardType } from '../../types/flashcard';
import { FlashcardFront } from './FlashcardFront';
import { FlashcardBack } from './FlashcardBack';

interface Props {
  card: FlashcardType;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export function Flashcard({ card, onSwipeLeft, onSwipeUp, isFlipped, setIsFlipped }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'up' | null>(null);

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
    
    // Add slight resistance to opposite directions to make intent clear
    setDeltaX(dx > 0 ? dx * 0.2 : dx);
    setDeltaY(dy > 0 ? dy * 0.2 : dy);
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

    // Is it a swipe left? (prioritize the stronger axis)
    if (deltaX < -100 && absX > absY) {
      setExitDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        onSwipeLeft();
      }, 300); // Wait for exit animation
      return;
    }

    // Is it a swipe up?
    if (deltaY < -100 && absY > absX) {
      setExitDirection('up');
      setIsAnimating(true);
      setTimeout(() => {
        onSwipeUp();
      }, 300); // Wait for exit animation
      return;
    }

    // Not a valid swipe, return to center
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
  } else if (exitDirection === 'up') {
    transform = `translateY(-150vh) rotate(10deg)`;
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
