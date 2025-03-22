import './style.css';
import { useRef, useState } from '@lynx-js/react';
import { SwiperItem } from './SwiperItem.jsx';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import type { WorkoutType } from './Wods.jsx';

export type SlideWorkoutType =
  | WorkoutType<'women', "Rx'd">
  | WorkoutType<'men', "Rx'd">;

export function Swiper({
  data,
  itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio,
  duration,
  'main-thread:easing': MTEasing,
}: {
  data: {
    active: boolean;
    title: string;
    workout: (WorkoutType<'women', "Rx'd"> | WorkoutType<'men', "Rx'd">)[];
  }[];
  itemWidth?: number;
  duration?: number;
  'main-thread:easing'?: (t: number) => number;
}) {
  const slides = data.map((item, index) => {
    return {
      active: item.active,
      title: item.title,
      workout: item.workout,
      opacity: (10 - index) / 10,
      zIndex: data.length - index,
      transform: ` translateY(${20 * index}px)`,
    };
  });
  const [wods, setWods] = useState<
    {
      active: boolean;
      title: string;
      workout: SlideWorkoutType[];
      opacity: number;
      zIndex: number;
      transform: string;
    }[]
  >(slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {wods.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            item.workout && (
              <SwiperItem
                length={wods.length}
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
