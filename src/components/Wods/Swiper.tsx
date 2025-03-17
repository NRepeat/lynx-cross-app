import './style.css';
import { useRef, useState } from '@lynx-js/react';
import type { NodesRef, TouchEvent } from '@lynx-js/types';
import { SwiperItem } from './SwiperItem.jsx';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import type { WorkoutType } from './Wods.jsx';
import { useEffect } from 'react';

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
    console.log('🚀 ~ item:', (20 - index) / 20);
    return {
      active: item.active,
      title: item.title,
      workout: item.workout,
      opacity: (10 - index) / 10,
      zIndex: data.length - index,
      transform:
        'scale(' + (20 - index) / 20 + ') translateY(' + 20 * index + 'px)',
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
  console.log('🚀 ~ wods:', wods);
  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {wods.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            item.workout && (
              <SwiperItem
                updateData={setWods}
                isInitialLoad={isInitialLoad}
                isActive={isActive}
                index={index}
                length={data.length}
                title={item.title}
                pic={item.title}
                itemWidth={itemWidth}
                setCurrentIndex={setCurrentIndex}
                workout={item.workout}
                opacity={item.opacity}
                zIndex={data.length - index}
                transform={item.transform}
              />
            )
          );
        })}
      </view>
    </view>
  );
}
