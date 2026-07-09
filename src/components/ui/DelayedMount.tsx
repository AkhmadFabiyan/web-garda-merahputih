"use client";
import React, { useState, useEffect } from 'react';

export const DelayedMount = ({ children }: { children: React.ReactNode }) => {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setShouldMount(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return cleanup;
  }, []);

  if (!shouldMount) return null;

  return <>{children}</>;
};
