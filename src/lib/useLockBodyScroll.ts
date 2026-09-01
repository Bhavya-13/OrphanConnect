"use client";

import { useEffect } from "react";

/**
 * Locks page scroll while `active` is true (e.g. while a modal is open),
 * and restores the previous scroll behavior when it closes or unmounts.
 */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [active]);
}