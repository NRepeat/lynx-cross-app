import {
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
  currentItemIndex,
  setCurrentIndex,
}: {
  onOffsetUpdate: (offset: number) => void;
  onIndexUpdate: (index: number) => void;
  itemWidth: number;
  dataLength: number;
  duration?: number;
  MTEasing?: (t: number) => number;
  currentItemIndex: number;
  setCurrentIndex: (deltaX: number) => void;
}) {
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
  const currentIndexRef = useMainThreadRef<number>(0);
  const touchEndX = useMainThreadRef<number>(0);
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
    touchStartXRef.current = e.touches[0].clientX;
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    console.log(
      '🚀 ~ handleTouchStart ~ touchStartCurrentOffsetRef.current :',
      touchStartCurrentOffsetRef.current,
    );
    cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';
    const touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartXRef.current;
    const xMulti = deltaX * 1.03;
    updateOffset(touchStartCurrentOffsetRef.current + xMulti);
  }

  // function handleTouchEnd(e: MainThread.TouchEvent) {
  //   'main thread';
  //   touchStartXRef.current = 0;
  //   touchStartCurrentOffsetRef.current = 0;
  //   const allItems = lynx.querySelectorAll('.swiper-item');
  //   animate({
  //     from: currentOffsetRef.current,
  //     to: calcNearestPage(currentOffsetRef.current),
  //     onUpdate: (offset: number) => {
  //       'main thread';
  //       updateOffset(offset);
  //     },
  //     onComplete(offset: number) {
  //       'main thread';
  //       function nextCardAnimation(
  //         nextIndex: number,
  //         nextItem: MainThread.Element,
  //         currentItem: MainThread.Element,
  //         currentIndex: number,
  //         length: number,
  //       ) {
  //         animate({
  //           from: 0, // Начинаем анимацию с progress = 0
  //           to: 1, // Заканчиваем с progress = 1
  //           onUpdate: (progress: number) => {
  //             const inverseProgress = 1 - progress;

  //             // Исходное значение opacity и его анимация до 1
  //             const opacityStart = (10 - nextIndex) / 10;
  //             const opacityNext = opacityStart + (1 - opacityStart) * progress;
  //             const opacityCurrent = 1 - 0.5 * progress;

  //             // Масштаб
  //             const nextBaseScale = (20 - nextIndex) / 20;
  //             const currentBaseScale = (20 - currentIndex) / 20;
  //             const currentScaleValue = currentBaseScale - 0.2 * progress;
  //             const scaleValue = Math.min(1, nextBaseScale + 0.2 * progress);

  //             // Смещение вниз
  //             const translateYValue = 10 * nextIndex * inverseProgress;
  //             console.log(
  //               '🚀 ~ onComplete ~ calcNearestPage(currentOffsetRef.current):',
  //               calcNearestPage(currentOffsetRef.current) * inverseProgress,
  //             );
  //             // Опускаем текущий элемент в самый низ
  //             const currentTranslateYValue = 10 * (length - 1) * progress;
  //             nextItem.setStyleProperties({
  //               opacity: `${opacityNext}`,
  //               transform: `scale(${scaleValue}) translateY(${translateYValue}px)`,
  //               'z-index': `${length}`,
  //             });

  //             currentItem.setStyleProperties({
  //               opacity: `${opacityCurrent - inverseProgress * 0.2}`,
  //               transform: `translateX(${calcNearestPage(currentOffsetRef.current * inverseProgress)}px) scale(${currentScaleValue}) translateY(${currentTranslateYValue}px)`,
  //               'z-index': `1`,
  //             });
  //           },
  //           duration: 600,
  //           easing: MTEasing,
  //         });
  //       }
  //       if (offset === 0) {
  //         return;
  //       }
  //       if (allItems.length > 0) {
  //         allItems.forEach((item, index) => {
  //           if (index === currentIndexRef.current) {
  //             item.setAttribute('active', true);
  //           } else {
  //             item.setAttribute('active', false);
  //             item.setAttribute('removed', true);
  //           }
  //         });
  //         const nextIndex = currentItemIndex + 1;
  //         if (nextIndex < allItems.length) {
  //           const nextItem = allItems[nextIndex];
  //           const currentItem = allItems[currentItemIndex];
  //           nextCardAnimation(
  //             nextIndex,
  //             nextItem,
  //             currentItem,
  //             currentItemIndex,
  //             allItems.length,
  //           );
  //         }
  //       }
  //     },
  //     duration: 300,
  //     easing: MTEasing,
  //   });

  //   e.currentTarget.setAttribute('moving', false);
  // }
  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    touchStartXRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = calcNearestPage(currentOffsetRef.current);

    animate({
      from: currentOffsetRef.current,
      to: calcNearestPage(currentOffsetRef.current),
      onUpdate: (offset: number) => {
        updateOffset(offset);
      },
      onComplete(offset: number) {
        if (deltaX !== -0) {
          runOnBackground(setCurrentIndex)(deltaX);
          e.currentTarget.setStyleProperties({
            transform: `translateX(0px)`,
          });
          touchStartXRef.current = 0;
          touchStartCurrentOffsetRef.current = 0;
          currentOffsetRef.current = 0;
        }
      },
      duration: 300,
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
