import type { ReactNode } from 'react';
import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { useBackHandler } from '../../lib/backHandler';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Mobile bottom sheet: drag the handle down, tap outside, or press back to close. */
export function Sheet({ open, onClose, title, subtitle, children, className = '' }: Props) {
  const controls = useDragControls();
  useBackHandler(open, onClose);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={`sheet ${className}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.9 }}
            onDragEnd={onDragEnd}
          >
            <div className="sheet-handle" onPointerDown={(e) => controls.start(e)} />
            {(title || subtitle) && (
              <div className="sheet-head" onPointerDown={(e) => controls.start(e)}>
                <div>
                  {title && <h2>{title}</h2>}
                  {subtitle && <p className="muted" style={{ fontSize: 14, marginTop: 2 }}>{subtitle}</p>}
                </div>
                <button className="icon-btn plain" onClick={onClose} aria-label="Close">
                  <X size={22} />
                </button>
              </div>
            )}
            <div className="sheet-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
