import {
  type Dispatch,
  MainThreadRef,
  type RefObject,
  type SetStateAction,
  runOnBackground,
  runOnMainThread,
  useEffect,
  useMainThreadRef,
} from '@lynx-js/react';
import type { BaseTouchEvent, MainThread, Target } from '@lynx-js/types';
import { useSlideStore } from '../store/workout.js';
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
  const currentYOffsetRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
  const currentElementRef = useMainThreadRef<MainThread.Element | null>(null);
  const currentIndexRef = useMainThreadRef<number>(0);
  const { animate, cancel: cancelAnimate } = useAnimate();
  const onCompleteRef = useMainThreadRef<boolean | null>(null);
  const { reset, setReset } = useSlideStore();
  const state = useSlideStore((state) => state);
  function resetElements(reset: boolean) {
    'main thread';
    if (reset) {
      const items = lynx.querySelectorAll('.swiper-item');
      items.forEach((item, index) => {
        if (index === currentIndex) {
          item.setAttribute('name', 'first');
        }
        // item.setAttribute('name', index === 0 ? 'first' : '');
      });
      runOnBackground(setReset)(false);
    }
  }

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
    return nearestPage * (itemWidth + 60);
  }

  function updateOffset(offset: number, yOffset?: number) {
    'main thread';
    const lowerBound = itemWidth + 60;
    const yLowerBound = itemWidth / 3;
    const yUpperBound = -yLowerBound;
    const upperBound = -lowerBound;
    const realOffset = Math.max(upperBound, Math.min(lowerBound, offset));
    const ralYoffset = Math.max(
      yUpperBound,
      Math.min(yLowerBound, yOffset || 0),
    );

    currentOffsetRef.current = realOffset;
    currentYOffsetRef.current = ralYoffset;
    onOffsetUpdate(
      realOffset,
      upperBound,
      lowerBound,
      currentIndex,
      ralYoffset,
    );

    currentIndexRef.current = currentIndex;
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread';
    resetElements(reset);
    const isFirst = e.currentTarget.getAttribute('name') === 'first';

    if (!isFirst) {
      return;
    }
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    currentElementRef.current = e.currentTarget;
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    currentElementRef.current?.setStyleProperty('transition', ' ');
    const allItems = lynx.querySelectorAll('.swiper-item');
    if (dataLength - 1 !== 0 && allItems.length - 1 === currentIndex) {
      runOnBackground(state.setCurrentChunk)(state.currentChunk + 1);
    } else if (dataLength - 1 === state.currentChunk) {
      runOnBackground(state.setCurrentChunk)(0);
    }
    // cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';
    const isFirst = e.currentTarget.getAttribute('name') === 'first';
    if (!isFirst) {
      return;
    }
    const item = e.currentTarget;
    const touchMoveX = e.touches[0].clientX;
    const touchMoveY = e.touches[0].clientY;
    const deltaY = touchMoveY - touchStartYRef.current;
    const deltaX = touchMoveX - touchStartXRef.current;
    if (
      item.getAttribute('name') === 'first' ||
      item.getAttribute('name') === 'next'
    ) {
      updateOffset(touchStartCurrentOffsetRef.current + deltaX, deltaY);
    }
  }

  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    const isFirst = e.currentTarget.getAttribute('name') === 'first';
    if (!isFirst) {
      return;
    }
    touchStartXRef.current = 0;
    touchStartYRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    const initialYOffset = currentYOffsetRef.current;
    const id = currentElementRef.current?.getAttribute('idSelector');
    runOnBackground(onIndexUpdate)(Number(id));
    animate({
      from: currentOffsetRef.current,
      to: calcNearestPage(currentOffsetRef.current),

      onUpdate: (offset) => {
        'main thread';
        if (true) {
          const progress =
            Math.abs(offset - currentOffsetRef.current) /
            Math.abs(
              calcNearestPage(currentOffsetRef.current) -
                currentOffsetRef.current,
            );
          console.log(progress, 'progress');
          const yOffset = initialYOffset * (1 - progress);
          currentOffsetRef.current = offset;
          currentYOffsetRef.current = yOffset;

          updateOffset(offset, yOffset);
        }
      },
      onComplete: (offset) => {
        'main thread';
        if (offset !== 0) {
          currentElementRef.current?.setStyleProperty('zIndex', '-10');
          touchStartXRef.current = 0;
          touchStartCurrentOffsetRef.current = 0;
          currentOffsetRef.current = 0;
          currentYOffsetRef.current = 0;
          currentElementRef.current?.setAttribute('name', '');
          const allItems = lynx.querySelectorAll('.swiper-item');
          if (allItems[currentIndex + 1]) {
            allItems[currentIndex + 1].setAttribute('name', 'first');
            runOnBackground(onIndexUpdate)(Number(currentIndex + 1));
            runOnBackground(state.setCurrentId)(
              allItems[currentIndex + 1].getAttribute('idSelector'),
            );
          } else if (allItems.length - 1 === currentIndex) {
            allItems[0].setAttribute('name', 'first');
            runOnBackground(onIndexUpdate)(0);
            runOnBackground(state.setCurrentId)(
              allItems[0].getAttribute('idSelector'),
            );
          }
          onCompleteRef.current = true;
          const lowerBound = itemWidth;
          const upperBound = -lowerBound;

          const normalizedOffset =
            (2 * (offset - upperBound)) / (lowerBound - upperBound) - 1;
          console.log(currentIndex, 'currentIndex');
          console.log(dataLength, 'dataLength');
          console.log('allItems.length', allItems.length);

          updateAllItems(currentIndex, Number(normalizedOffset.toFixed(2)));
        }
      },
      duration: 100,
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
