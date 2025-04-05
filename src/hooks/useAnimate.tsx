import { useMainThreadRef } from '@lynx-js/react';
export type AnimationOptions = {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  onUpdate?: (value: number) => void;
  onComplete?: (value: number) => void;
};

// Common easing functions
export const easings = {
  linear: (t: number) => {
    'main thread';
    return t;
  },
  easeInQuad: (t: number) => {
    'main thread';
    return t * t;
  },
  easeOutQuad: (t: number) => {
    'main thread';
    return 1 - (1 - t) * (1 - t);
  },
  easeInOutQuad: (t: number) => {
    'main thread';
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },
  bounce: (t: number): number => {
    'main thread';
    const overshoot = 1.1; // Насколько выше цели прыгнет (1.0 — цель)
    if (t < 0.8) {
      return t * (overshoot / 0.8); // Увеличиваем до 110%
    } else {
      return overshoot - ((t - 0.8) * (overshoot - 1)) / 0.2; // Возврат к 1
    }
  },
};

function animateInner(options: AnimationOptions) {
  'main thread';
  const {
    from,
    to,
    duration = 3000,
    delay = 0,
    easing = easings.linear,
    onUpdate,
    onComplete,
  } = options;

  let startTs = 0;
  let rafId = 0;

  function tick(ts: number) {
    const progress =
      Math.max(Math.min(((ts - startTs - delay) * 100) / duration, 100), 0) /
      100;

    const easedProgress = easing(progress);
    const currentValue = from + (to - from) * easedProgress;
    onUpdate?.(currentValue);
  }

  function updateRafId(id: number) {
    rafId = id;
  }

  function step(ts: number) {
    if (!startTs) {
      startTs = Number(ts);
    }
    // make sure progress can reach 100%
    if (ts - startTs <= duration + 100) {
      tick(ts);
      updateRafId(requestAnimationFrame(step));
    } else {
      const progress =
        Math.max(Math.min(((ts - startTs - delay) * 100) / duration, 100), 0) /
        100;

      const easedProgress = easing(progress);
      const currentValue = from + (to - from) * easedProgress;
      onComplete?.(currentValue);
    }
  }

  updateRafId(requestAnimationFrame(step));

  function cancel() {
    cancelAnimationFrame(rafId);
  }

  return {
    cancel,
  };
}

export function useAnimate() {
  const lastCancelRef = useMainThreadRef<() => void>();

  function cancel() {
    'main thread';
    lastCancelRef.current?.();
  }

  function animate(options: AnimationOptions): Promise<void> {
    'main thread';
    cancel();

    return new Promise((resolve) => {
      const { cancel: innerCancel } = animateInner({
        ...options,
        onComplete: (value) => {
          options.onComplete?.(value);
          resolve(); // Завершаем Promise после завершения анимации
        },
      });

      lastCancelRef.current = innerCancel;
    });
  }

  return {
    cancel,
    animate,
  };
}
