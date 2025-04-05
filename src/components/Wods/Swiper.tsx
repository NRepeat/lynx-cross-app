import './style.css';
import { useEffect, useState } from '@lynx-js/react';
import { SwiperItem } from './SwiperItem.jsx';

import { useFilteredSlides, useSlideStore } from '../../store/workout.js';

export function Swiper({
  itemWidth = SystemInfo.pixelWidth / SystemInfo.pixelRatio,
}: {
  itemWidth?: number;
  duration?: number;
}) {
  const slides = useFilteredSlides();

  const swiperData = slides.map((slide, index) => {
    return {
      wod: slide,
      opacity: (10 - index) / 10,
      zIndex: slides.length - index,
      transform: ` translateY(${10 * index}px) `,
    };
  });

  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {swiperData.map((item, index) => {
          return (
            item.wod && (
              <SwiperItem
                wod={item.wod}
                length={slides.length}
                key={index}
                index={index}
                itemWidth={itemWidth}
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
