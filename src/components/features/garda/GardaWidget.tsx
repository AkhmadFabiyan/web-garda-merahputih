'use client';

import React, { useState, useRef } from 'react';
import { GardaButton } from './GardaButton';
import { GardaModal } from './GardaModal';

/**
 * GardaWidget — top-level client component.
 * Mount once in layout.tsx. Manages open/close state.
 */
export const GardaWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Restore focus back to the button when modal closes
    triggerRef.current?.focus();
  };

  return (
    <>
      <GardaButton ref={triggerRef} onClick={handleOpen} isOpen={isOpen} />
      <GardaModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
