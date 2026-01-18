"use client";

import { useEffect } from 'react';
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import 'mobile-drag-drop/default.css';

export const DragDropPolyfill = () => {
  useEffect(() => {
    // Initialize the polyfill
    polyfill({
        // use this to make the drag image visible and positioned correctly during scroll
        dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
        // Optional: Force polyfill for testing on desktop if needed, but not for prod
        // forceApply: false
    });
  }, []);

  return null;
};
