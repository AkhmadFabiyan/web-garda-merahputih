'use client';
import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog (usually its heading). */
  labelledBy?: string;
  /** Extra class for the panel, to theme it (e.g. the dark Developer Chamber). */
  className?: string;
  /** Extra class for the close button. */
  closeClassName?: string;
  children: React.ReactNode;
}

/**
 * Centered dialog built on the native <dialog>: Esc closes it, focus moves inside,
 * the page behind is inert, and clicking the backdrop closes it.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose, labelledBy, className = '', closeClassName = '', children }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Native listener: Esc closes the dialog natively, and React's onClose does not always see it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handle = () => onCloseRef.current();
    dialog.addEventListener('close', handle);
    return () => dialog.removeEventListener('close', handle);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={labelledBy}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && (
        <div className={`${styles.panel} ${className}`}>
          <button type="button" className={`${styles.close} ${closeClassName}`} onClick={onClose} aria-label="Tutup">✕</button>
          {children}
        </div>
      )}
    </dialog>
  );
};
