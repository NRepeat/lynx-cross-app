import './style.css';
import { useState } from '@lynx-js/react';
import { SwiperItem } from './SwiperItem.jsx';
import type { WorkoutType } from './Wods.jsx';
import { useSlideStore } from '../../store/workout.js';

export type SlideWorkoutType =
  | WorkoutType<'women', "Rx'd">
  | WorkoutType<'men', "Rx'd">;

export function Swiper({
  itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio,
}: {
  itemWidth?: number;
  duration?: number;
}) {
  const slides = useSlideStore((state) => state.slides);
  const swiperData = slides.map((slide, index) => {
    return {
      title: slide.title,
      workout: slide.workout,
      display: index > 3 ? 'none' : 'block',
      opacity: (10 - index) / 10,
      zIndex: slides.length - index,
      transform: ` translateY(${10 * index}px)`,
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {swiperData.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            item.workout && (
              <SwiperItem
                isActive={isActive}
                display={item.display as 'block' | 'none'}
                setCurrentIndex={setCurrentIndex}
                length={slides.length}
                key={index}
                isInitialLoad={isInitialLoad}
                index={index}
                title={item.title}
                pic={item.title}
                itemWidth={itemWidth}
                workout={item.workout}
                opacity={item.opacity}
                zIndex={item.zIndex}
                transform={item.transform}
              />
            )
          );
        })}
      </view>
    </view>
  );
}
