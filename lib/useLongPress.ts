"use client";
import { useRef } from "react";

/**
 * useLongPress - custom hook to detect long press
 *
 * @param callback Function to run on long press
 * @param delay Press duration (default 800ms)
 */
export function useLongPress(callback: () => void, delay = 800) {
  const timerRef = useRef<NodeJS.Timeout>();

  const start = () => {
    timerRef.current = setTimeout(callback, delay);
  };

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchEnd: stop,
  };
}
