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
import { useSlideStore } from '../store/workout.js';

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
  onOffsetUpdate: (
    offset: number,
    upperBound: number,
    lowerBound: number,
    currentIndex: number,
  ) => void;
  onIndexUpdate: (index: number) => void;
  itemWidth: number;
  dataLength: number;
  currentIndex: number;
  updateAllItems: (currentIndex: number, offset: number) => void;
  duration?: number;
  MTEasing?: (t: number) => number;
}) {
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartYRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
  const currentElementRef = useMainThreadRef<MainThread.Element | null>(null);
  const currentIndexRef = useMainThreadRef<number>(0);
  const onCompleteRef = useMainThreadRef<boolean | null>(null);
  const state = useSlideStore((state) => state);

  const { animate, cancel: cancelAnimate } = useAnimate();
  function updateIndex(index: number) {
    const offset = index * itemWidth;
    runOnMainThread(updateOffset)(offset);
  }

  function calcNearestPage(offset: number) {
    'main thread';
    let nearestPage = Math.round(offset / itemWidth);
    const lowerBound = itemWidth / 3 - 50;
    // const upperBound = -lowerBound;
    switch (true) {
      case offset >= lowerBound:
        nearestPage = 1;
        break;
      case offset < 0 && Math.abs(offset) > lowerBound:
        nearestPage = -1;
        break;
    }
    return nearestPage * itemWidth;
  }

  function updateOffset(offset: number) {
    'main thread';
    const lowerBound = itemWidth;
    const upperBound = -lowerBound;
    const realOffset = Math.max(upperBound, Math.min(lowerBound, offset));
    const normalizedOffset =
      (2 * (offset - upperBound)) / (lowerBound - upperBound) - 1;
    currentOffsetRef.current = realOffset;
    onOffsetUpdate(realOffset, upperBound, lowerBound, currentIndex);
    // updateAllItems(currentIndex, Number(normalizedOffset.toFixed(2)));
    const index = Math.round(-realOffset / itemWidth);
    if (currentIndex !== index) {
      currentIndexRef.current = index;
      runOnBackground(onIndexUpdate)(index);
    }
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread';

    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    currentElementRef.current = e.currentTarget;
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';

    const item = e.currentTarget;
    const touchMoveX = e.touches[0].clientX;
    const touchMoveY = e.touches[0].clientY;
    const deltaY = touchMoveY - touchStartYRef.current;
    const deltaX = touchMoveX - touchStartXRef.current;
    if (
      item.getAttribute('name') === 'first' ||
      item.getAttribute('name') === 'next'
    ) {
      updateOffset(touchStartCurrentOffsetRef.current + deltaX);
    }
  }

  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    touchStartXRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    const lowerBound = itemWidth;
    const upperBound = -lowerBound;
    console.log(Math.abs(currentOffsetRef.current), 'currentOffsetRef.current');
    console.log(
      itemWidth / 2 > currentOffsetRef.current,
      'currentOffsetRef.current --------------',
    );

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
        if (offset !== 0) {
          touchStartXRef.current = 0;
          touchStartCurrentOffsetRef.current = 0;
          currentOffsetRef.current = 0;
          const allItems = lynx.querySelectorAll('.swiper-item');
          if (allItems[currentIndex + 1]) {
            allItems[currentIndex + 1].setAttribute('name', 'next');
          } else if (allItems.length - 1 === currentIndex) {
            allItems[0].setAttribute('name', 'next');
          }
          onCompleteRef.current = true;
          const lowerBound = itemWidth;
          const upperBound = -lowerBound;
          const normalizedOffset =
            (2 * (offset - upperBound)) / (lowerBound - upperBound) - 1;
          updateAllItems(currentIndex, Number(normalizedOffset.toFixed(2)));
          if (currentIndex === dataLength - 1) {
            // runOnBackground(state.setSlides)(state.nextSlides);
          }
        }
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
