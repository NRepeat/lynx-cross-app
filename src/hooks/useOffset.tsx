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
  currentIndex,
  currentItemIndex,
  setCurrentIndex,
  isActive,
}: {
  onOffsetUpdate: (offset: number) => void;
  onIndexUpdate: (index: number) => void;
  itemWidth: number;
  dataLength: number;
  duration?: number;
  isActive: boolean;
  MTEasing?: (t: number) => number;
  currentItemIndex: number;
  currentIndex: number;
  setCurrentIndex: (deltaX: number) => void;
}) {
  const touchStartXRef = useMainThreadRef<number>(0);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const currentOffsetRef = useMainThreadRef<number>(0);
  const currentIndexRef = useMainThreadRef<number>(0);
  const touchEndX = useMainThreadRef<number>(0);
  const isAnimating = useMainThreadRef<boolean>(false);
  const canTouch = useMainThreadRef<boolean>(true);
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
    const upperBound = -(dataLength - 1) * itemWidth;
    isAnimating.current = true;
    const realOffset = Math.max(upperBound, Math.min(lowerBound, offset));

    console.log('🚀 ~ isAnimating:', isAnimating.current);

    currentOffsetRef.current = realOffset;
    onOffsetUpdate(realOffset);
    // if()
    const index = Math.round(-realOffset / itemWidth);
    if (currentItemIndex !== index) {
      currentIndexRef.current = index;
      runOnBackground(onIndexUpdate)(index);
    }
  }

  function handleTouchStart(e: MainThread.TouchEvent) {
    'main thread';

    if (!isActive) return;
    if (!canTouch.current) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartCurrentOffsetRef.current = currentOffsetRef.current;
    // cancelAnimate();
  }

  function handleTouchMove(e: MainThread.TouchEvent) {
    'main thread';
    if (!isActive) return;
    const touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartXRef.current;
    const xMulti = deltaX * 1.03;
    updateOffset(touchStartCurrentOffsetRef.current + xMulti);
  }

  function handleTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    if (!isActive) return;
    touchStartXRef.current = 0;
    touchStartCurrentOffsetRef.current = 0;
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = calcNearestPage(currentOffsetRef.current);
    const allItems = lynx.querySelectorAll('.swiper-item');
    animate({
      from: currentOffsetRef.current,
      to: calcNearestPage(currentOffsetRef.current),
      onUpdate: (offset: number) => {
        // if (
        //   calcNearestPage(currentOffsetRef.current) < currentOffsetRef.current
        // ) {
        //   canTouch.current = false;
        // }
        updateOffset(offset);
      },
      onComplete(offset: number) {
        if (offset < 0) {
          touchStartXRef.current = 0;
          touchStartCurrentOffsetRef.current = 0;
          currentOffsetRef.current = 0;
          const isFullCircleComplete = currentIndex >= allItems.length - 1;
          animate({
            from: 0,
            to: 1,
            onUpdate: (progress: number) => {
              const inverseProgress = 1 - progress;
              const translateXValue = deltaX * inverseProgress;
              const translateYValue = 10 * dataLength * progress;
              const opacityCurrent = 1;
              const opacityEnd = Math.max(0.1, (10 - (dataLength - 1)) / 10);
              const currentOpacity =
                opacityCurrent + (opacityEnd - opacityCurrent) * progress;
              const currentBaseScale = Math.max(
                0.1,
                (20 - (dataLength - 1)) / 20,
              );
              const currentScaleValue = Math.max(
                0.1,
                currentBaseScale * progress,
              );

              e.currentTarget.setStyleProperties({
                transform: `translateX(${translateXValue}px) translateY(${translateYValue}px) scale(${currentScaleValue})`,
                'z-index': `${-dataLength}`,
                opacity: `${currentOpacity}`,
              });

              for (let i = 0; i < allItems.length; i++) {
                if (i === currentIndex) continue;

                let relativePosition = i - currentIndex;
                if (relativePosition < 0) {
                  relativePosition = allItems.length + relativePosition;
                }
                if (allItems[i].getAttribute('data-last') === 'true') {
                  allItems[i].setAttribute('data-last', 'false');
                }
                const currentTranslateYValueStart = 20 * relativePosition;
                const currentTranslateYValueEnd = 20 * (relativePosition - 1);
                const currentTranslateYValue =
                  currentTranslateYValueStart +
                  (currentTranslateYValueEnd - currentTranslateYValueStart) *
                    progress;

                // Интерполяция для прозрачности
                const baseOpacity = Math.max(
                  0.1,
                  (10 - (relativePosition - 1)) / 10,
                );
                const currentOpacity =
                  baseOpacity + (1 - baseOpacity) * inverseProgress;

                // Интерполяция для масштаба
                const currentBaseScale = Math.max(
                  0.1,
                  (20 - relativePosition) / 20,
                );
                const nextScale = Math.max(
                  0.1,
                  (20 - relativePosition + 1) / 20,
                );

                const scale =
                  currentBaseScale + (nextScale - currentBaseScale) * progress;

                const zIndexValue = allItems.length - relativePosition;

                // Применяем стили
                allItems[i].setStyleProperties({
                  'z-index': `${zIndexValue}`,
                  transform: `translateY(${currentTranslateYValue}px) scale(${scale})`,
                  opacity: `${currentOpacity}`,
                });
              }
            },
            onComplete: () => {
              if (isFullCircleComplete) {
                allItems.forEach((item, idx) => {
                  const zIndex = allItems.length - idx;
                  item.setStyleProperties({
                    'z-index': `${zIndex}`,
                  });
                });
              }
              e.currentTarget.setAttribute('data-last', 'true');

              if (currentIndex === allItems.length - 1) {
                runOnBackground(setCurrentIndex)(0);
              } else {
                runOnBackground(setCurrentIndex)(currentIndex + 1);
              }
            },
            duration: 10,
            easing: MTEasing,
          });
        } else if (offset > 0) {
          touchStartXRef.current = 0;
          touchStartCurrentOffsetRef.current = 0;
          currentOffsetRef.current = 0;
          const isFullCircleComplete = currentIndex >= allItems.length - 1;
          animate({
            from: 0,
            to: 1,
            onUpdate: (progress: number) => {
              const inverseProgress = 1 - progress;
              const translateXValue = deltaX * inverseProgress;
              const translateYValue = 10 * dataLength * progress;
              const opacityCurrent = 1;
              const opacityEnd = Math.max(0.1, (10 - (dataLength - 1)) / 10);
              const currentOpacity =
                opacityCurrent + (opacityEnd - opacityCurrent) * progress;
              const currentBaseScale = Math.max(
                0.1,
                (20 - (dataLength - 1)) / 20,
              );
              const currentScaleValue = Math.max(
                0.1,
                currentBaseScale * progress,
              );

              e.currentTarget.setStyleProperties({
                transform: `translateX(${translateXValue}px) translateY(${translateYValue}px) scale(${currentScaleValue})`,
                'z-index': `${-dataLength}`,
                opacity: `${currentOpacity}`,
              });

              for (let i = 0; i < allItems.length; i++) {
                if (i === currentIndex) continue;

                let relativePosition = i - currentIndex;
                if (relativePosition < 0) {
                  relativePosition = allItems.length + relativePosition;
                }

                const currentTranslateYValueStart = 20 * relativePosition;
                const currentTranslateYValueEnd = 20 * (relativePosition - 1);
                const currentTranslateYValue =
                  currentTranslateYValueStart +
                  (currentTranslateYValueEnd - currentTranslateYValueStart) *
                    progress;

                const baseOpacity = Math.max(
                  0.1,
                  (10 - (relativePosition - 1)) / 10,
                );
                const currentOpacity =
                  baseOpacity + (1 - baseOpacity) * inverseProgress;

                const currentBaseScale = Math.max(
                  0.1,
                  (20 - relativePosition) / 20,
                );
                const nextScale = Math.max(
                  0.1,
                  (20 - relativePosition + 1) / 20,
                );

                const scale =
                  currentBaseScale + (nextScale - currentBaseScale) * progress;

                const zIndexValue = allItems.length - relativePosition;

                allItems[i].setStyleProperties({
                  'z-index': `${zIndexValue}`,
                  transform: `translateY(${currentTranslateYValue}px) scale(${scale})`,
                  opacity: `${currentOpacity}`,
                });
              }
            },
            onComplete: () => {
              if (isFullCircleComplete) {
                allItems.forEach((item, idx) => {
                  const zIndex = allItems.length - idx;
                  item.setStyleProperties({
                    'z-index': `${zIndex}`,
                  });
                });
              }
              e.currentTarget.setAttribute('data-last', 'true');

              if (currentIndex === allItems.length - 1) {
                runOnBackground(setCurrentIndex)(0);
              } else {
                runOnBackground(setCurrentIndex)(currentIndex + 1);
              }
              // Добавлен сброс флага после завершения анимации
              isAnimating.current = false;
            },
            duration: 10,
            easing: MTEasing,
          });
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
