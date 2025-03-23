import { useMainThreadRef } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';
import { useAnimate } from './useAnimate.jsx';

export function useUpdateSwiperStyle() {
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const { animate, cancel } = useAnimate();
  function updateSwiperStyle(
    offset: number,
    upperBound: number,
    lowerBound: number,
    currentIndex: number,
  ) {
    'main thread';

    const allItems = lynx.querySelectorAll('.swiper-item');
    const dataLength = allItems.length;
    if (offset === upperBound || offset === lowerBound) {
      animate({
        from: 0,
        to: 1,
        onUpdate: (progress: number) => {
          'main thread';
          const inverseProgress = 1 - progress;
          const translateXValue =
            offset === upperBound
              ? upperBound * inverseProgress
              : lowerBound * inverseProgress;
          const translateYValue = 10 * dataLength * progress;
          const opacityCurrent = 1;
          const opacityEnd = Math.max(0.1, (10 - dataLength) / 10);
          const currentOpacity =
            opacityCurrent + (opacityEnd - opacityCurrent) * progress;
          const isOpen = containerRef.current?.getAttribute('open') === 'true';
          containerRef.current?.setStyleProperties({
            transform: `translateX(${translateXValue}px) translateY(${translateYValue - 10}px) `,
            'z-index': `${-dataLength}`,
            opacity: `${currentOpacity}`,
            height: `65vh`,
          });
          containerRef.current?.setAttribute(
            'open',
            `${isOpen ? 'false' : 'true'}`,
          );
          // if (allItems[currentIndex + 1]) {
          //   allItems[currentIndex + 1].setStyleProperties({
          //     transform: `translateY(${nextTranslateY}px)`,
          //     opacity: `${nextOpacity}`,
          //   });
          // } else {
          //   allItems[0].setStyleProperties({
          //     transform: `translateY(${nextTranslateY}px)`,
          //     opacity: `${nextOpacity}`,
          //   });
          // }
        },

        duration: 200,
      });
    } else {
      containerRef.current?.setStyleProperties({
        transform: `translateX(${offset}px)`,
      });
    }
  }
  function updateAllItems(currentIndex: number, normalizedOffset: number) {
    'main thread';
    const allItems = lynx.querySelectorAll('.swiper-item');

    allItems?.forEach((item, index) => {
      if (currentIndex === index) {
        return;
      }

      let relativePosition = index - currentIndex;
      if (relativePosition < 0) {
        relativePosition = allItems.length + relativePosition;
      }

      const currentTranslateYValueStart = 10 * relativePosition;
      const currentTranslateYValueEnd = 10 * (relativePosition - 1);

      let currentTranslateYValue =
        currentTranslateYValueStart +
        (currentTranslateYValueEnd - currentTranslateYValueStart) *
          Math.abs(normalizedOffset);

      const baseOpacity = (10 - relativePosition) / 10;

      let currentOpacity = baseOpacity + 0.1 * Math.abs(normalizedOffset);

      currentOpacity = Math.min(Math.max(currentOpacity, 0), 1);

      item.setStyleProperties({
        'z-index': `${allItems.length - relativePosition}`,
        transform: `translateY(${currentTranslateYValue.toFixed(1)}px)`,
        opacity: `${currentOpacity}`,
      });
    });
  }

  return {
    updateAllItems,
    containerRef,
    updateSwiperStyle,
  };
}
