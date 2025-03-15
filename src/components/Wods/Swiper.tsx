import './style.css';
import { useRef, useState } from '@lynx-js/react';
import type { NodesRef, TouchEvent } from '@lynx-js/types';
import { SwiperItem } from './SwiperItem.jsx';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';

export function Swiper({
  data,
  itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio,
  duration,
  'main-thread:easing': MTEasing,
}: {
  data: {
    thumbnail: string;
    workout: string;
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
        {data.map((item) => (
          <SwiperItem
            pic={item.thumbnail}
            itemWidth={itemWidth}
            text={item.workout}
          />
        ))}
      </view>
    </view>
  );
}
