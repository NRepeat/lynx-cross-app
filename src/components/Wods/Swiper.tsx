import './style.css';
import { useRef, useState } from '@lynx-js/react';
import type { NodesRef, TouchEvent } from '@lynx-js/types';
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
    title: string;
    workout: SlideWorkoutType[];
  }[];
  itemWidth?: number;
  duration?: number;
  'main-thread:easing'?: (t: number) => number;
}) {
  const [current, setCurrent] = useState(0);

  const { containerRef, updateSwiperStyle } = useUpdateSwiperStyle();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, updateIndex } =
    useOffset({
      itemWidth,
      dataLength: data.length,
      onIndexUpdate: setCurrent,
      onOffsetUpdate: updateSwiperStyle,
      duration,
      MTEasing,
    });

  function handleItemClick(index: number) {
    setCurrent(index);
    updateIndex(index);
  }
  return (
    <view class="swiper-wrapper">
      <view
        class="swiper-container"
        main-thread:ref={containerRef}
        main-thread:bindtouchstart={handleTouchStart}
        main-thread:bindtouchmove={handleTouchMove}
        main-thread:bindtouchend={handleTouchEnd}
      >
        {data.map(
          (item) =>
            item.workout && (
              <SwiperItem
                title={item.title}
                pic={item.title}
                itemWidth={itemWidth}
                workout={item.workout}
              />
            ),
        )}
      </view>
    </view>
  );
}
