import { useMainThreadRef } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

export function useUpdateSwiperStyle() {
  const containerRef = useMainThreadRef<MainThread.Element>(null);

  function updateSwiperStyle(offset: number) {
    'main thread';
    containerRef.current?.setStyleProperties({
      transform: `translateX(${offset}px)`,
    });
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

      const currentTranslateYValueStart = 20 * relativePosition;
      const currentTranslateYValueEnd = 20 * (relativePosition - 1);
      let currentTranslateYValue =
        currentTranslateYValueStart +
        (currentTranslateYValueEnd - currentTranslateYValueStart) *
          -normalizedOffset;

      // const baseOpacity = (10 - relativePosition) / 10;
      const baseOpacity = (10 - relativePosition) / 10;

      let currentOpacity = baseOpacity + 0.1 * -normalizedOffset;

      // Обмежуємо значення opacity між 0 та 1
      // currentOpacity = Math.min(Math.max(currentOpacity, 0), 1);

      const zIndexValue = allItems.length - relativePosition;

      if (normalizedOffset === 0) {
        currentTranslateYValue = currentTranslateYValueStart;
        // currentOpacity = baseOpacity;
      }

      if (currentTranslateYValue <= Math.min(currentTranslateYValueEnd)) {
        return;
      }

      item.setStyleProperties({
        'z-index': `${zIndexValue}`,
        transform: `translateY(${currentTranslateYValue.toFixed(1)}px)`,
        opacity: `${currentOpacity + 0.001}`,
      });
    });
  }
  return {
    updateAllItems,
    containerRef,
    updateSwiperStyle,
  };
}
