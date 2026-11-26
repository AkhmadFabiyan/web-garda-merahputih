"use client";
import { useState, useEffect } from 'react';
import React from 'react';

export const RenderOnScroll = ({ children, id, minHeight = '100svh' }: { children: React.ReactNode, id?: string, minHeight?: string }) => {
  // Lazy initialiser: called once during mount on the client.
  // This avoids both the refs-during-render and set-state-in-effect lint rules.
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (id && window.location.hash === `#${id}`) {
      setShouldRender(true);
      return;
    }

    if (shouldRender) return;

    const handleInteraction = () => {
      setShouldRender(true);
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
  }, [shouldRender]);

  if (!shouldRender) {
    return <div id={id} style={{ minHeight, width: '100%' }} suppressHydrationWarning />;
  }

  return <div id={id} style={{ width: '100%' }}>{children}</div>;
};
