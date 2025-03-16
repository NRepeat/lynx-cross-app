import {
  runOnBackground,
  runOnMainThread,
  useMainThreadRef,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';
import { useAnimate } from './useAnimate.jsx';
import type { SlideWorkoutType } from '../components/Wods/Swiper.jsx';

export function useOffset({
  onOffsetUpdate,
  onIndexUpdate,
  itemWidth,
  dataLength,
  duration,
  MTEasing,
  currentItemIndex,
}: {
  onOffsetUpdate: (offset: number) => void;
  onIndexUpdate: (index: number) => void;
  itemWidth: number;
  dataLength: number;
  duration?: number;
  MTEasing?: (t: number) => number;
  currentItemIndex: number;
}) {
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
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
    const lowerBound = 0;
    const upperBound = -(dataLength - 1) * itemWidth;
    const realOffset = Math.min(lowerBound, Math.max(upperBound, offset));
    currentOffsetRef.current = realOffset;
    onOffsetUpdate(realOffset);
    const index = Math.round(-realOffset / itemWidth);
    if (currentItemIndex !== index) {
      currentIndexRef.current = index;
      runOnBackground(onIndexUpdate)(index);
    }
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread';
    e.currentTarget.setAttribute('moving', true),
      (touchStartXRef.current = e.touches[0].clientX);
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';
    const touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartXRef.current;
    const xMulti = deltaX * 1.03;
    updateOffset(touchStartCurrentOffsetRef.current + xMulti);
  }

  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    touchStartXRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    const allItems = lynx.querySelectorAll('.swiper-item');
    animate({
      from: currentOffsetRef.current,
      to: calcNearestPage(currentOffsetRef.current),
      onUpdate: (offset: number) => {
        'main thread';
        updateOffset(offset);
      },
      onComplete(offset: number) {
        'main thread';
        if (offset === 0) {
          return;
        }
        if (allItems.length > 0) {
          allItems.forEach((item, index) => {
            if (index === currentIndexRef.current) {
              item.setAttribute('active', true);
            } else {
              item.setAttribute('active', false);
              item.setAttribute('removed', true);
            }
          });
          const nextIndex = currentItemIndex + 1;
          if (nextIndex < allItems.length) {
            const nextItem = allItems[nextIndex];

            animate({
              from: 0, // Начинаем анимацию с progress = 0
              to: 1, // Заканчиваем с progress = 1
              onUpdate: (progress: number) => {
                const inverseProgress = 1 - progress; // Инверсия прогресса для translateY
                const opacityValue = 0.8 + 0.2 * progress; // Анимация opacity от 0.8 к 1
                const baseScale = (20 - nextIndex) / 20; // Базовое значение scale
                const scaleValue = Math.min(1, baseScale + 0.2 * progress); // Ограничиваем 1
                // Анимация scale от 0.8 к 1
                console.log('🚀 ~ onComplete ~ scaleValue:', scaleValue);
                const translateYValue = 10 * nextIndex * inverseProgress; // В начале max, в конце 0

                nextItem.setStyleProperties({
                  opacity: `${opacityValue}`,
                  transform: `scale(${scaleValue}) translateY(${translateYValue}px)`,
                });
              },
              duration: 600,
              easing: MTEasing,
            });
          }
        }
      },
      duration: 300,
      easing: MTEasing,
    });

    e.currentTarget.setAttribute('moving', false);
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    updateIndex,
  };
}
