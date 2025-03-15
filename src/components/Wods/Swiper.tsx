import './style.css';
import { useRef } from '@lynx-js/react';
import type { NodesRef, TouchEvent } from '@lynx-js/types';
import { SwiperItem } from './SwiperItem.jsx';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';

export function Swiper({
  data,
  itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio,
}: {
  data: {
    thumbnail: string;
    workout: string;
  }[];
  itemWidth?: number;
}) {
  const { updateSwiperStyle, containerRef } = useUpdateSwiperStyle();
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useOffset({
    onOffsetUpdate: updateSwiperStyle,
  });

  return (
    <view class="swiper-wrapper">
      <view
        class="swiper-container"
        ref={containerRef}
        bindtouchstart={handleTouchStart}
        bindtouchmove={handleTouchMove}
        bindtouchend={handleTouchEnd}
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
