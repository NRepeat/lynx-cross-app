import {
  MainThreadRef,
  runOnBackground,
  runOnMainThread,
  useMainThreadRef,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from '@lynx-js/react';
import type { BaseTouchEvent, MainThread, Target } from '@lynx-js/types';
import { useAnimate } from './useAnimate.jsx';

export function useOffset({
  onOffsetUpdate,
  onIndexUpdate,
  itemWidth,
  dataLength,
  duration,
  MTEasing,
  updateAllItems,
  currentIndex,
}: {
  onOffsetUpdate: (offset: number) => void;
  onIndexUpdate: (index: number) => void;
  itemWidth: number;
  dataLength: number;
  currentIndex: number;
  updateAllItems: (currentIndex: number, offset: number) => void;
  duration?: number;
  MTEasing?: (t: number) => number;
}) {
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
  const currentElementRef = useMainThreadRef<MainThread.Element | null>(null);
  const currentIndexRef = useMainThreadRef<number>(0);
  const { animate, cancel: cancelAnimate } = useAnimate();
  function updateIndex(index: number) {
    const offset = index * itemWidth;
    runOnMainThread(updateOffset)(offset);
  }

  function calcNearestPage(offset: number) {
    'main thread';
    const nearestPage = Math.round(offset / itemWidth);
    return nearestPage * itemWidth;
  }

  function updateOffset(offset: number) {
    'main thread';
    const lowerBound = itemWidth;
    const upperBound = -lowerBound;
    const realOffset = Math.max(upperBound, Math.min(lowerBound, offset));
    //lowerBound = 393, upperBound = -393, offset = 0, normalizedOffset = 0.5
    const normalizedOffset =
      (2 * (offset - upperBound)) / (lowerBound - upperBound) - 1;

    currentOffsetRef.current = realOffset;
    onOffsetUpdate(realOffset);
    updateAllItems(currentIndex, Number(normalizedOffset.toFixed(2)));
    const index = Math.round(-realOffset / itemWidth);
    if (currentIndex !== index) {
      currentIndexRef.current = index;
      runOnBackground(onIndexUpdate)(index);
    }
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread';

    touchStartXRef.current = e.touches[0].clientX;
    currentElementRef.current = e.currentTarget;
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';
    const touchMoveX = e.touches[0].clientX;

    const deltaX = touchMoveX - touchStartXRef.current;
    updateOffset(touchStartCurrentOffsetRef.current + deltaX);
  }

  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    touchStartXRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    animate({
      from: currentOffsetRef.current,
      to: calcNearestPage(currentOffsetRef.current),
      onUpdate: (offset) => {
        'main thread';
        if (offset !== 0) {
          updateOffset(offset);
        }
      },
      onComplete: (offset) => {
        'main thread';
        touchStartXRef.current = 0;
        touchStartCurrentOffsetRef.current = 0;
        currentOffsetRef.current = 0;
        const deltaX = calcNearestPage(currentOffsetRef.current);
        animate({
          from: 0,
          to: 1,
          onUpdate: (progress: number) => {
            if (offset !== 0) {
              const inverseProgress = 1 - progress;
              const translateXValue = deltaX * inverseProgress;
              const translateYValue = 20 * dataLength * progress;
              const opacityCurrent = 1;
              const opacityEnd = Math.max(0.1, (10 - dataLength) / 10);
              const currentOpacity =
                opacityCurrent + (opacityEnd - opacityCurrent) * progress;

              e.currentTarget.setStyleProperties({
                transform: `translateX(${translateXValue}px) translateY(${translateYValue - 20}px) `,
                'z-index': `${-dataLength}`,
                opacity: `${currentOpacity}`,
              });
            }
          },

          duration: 100,
          easing: MTEasing,
        });
      },
      duration,
      easing: MTEasing,
    });
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    updateIndex,
  };
}
