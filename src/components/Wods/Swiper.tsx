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

  const swiperData = slides.map((slide) => {
    return slide.map((wod, index) => {
      return {
        wod: wod,
        opacity: (10 - index) / 10,
        zIndex: slides.length - index,
        display: index > 5 ? 'none' : 'block',
        transform: `${index > 5 ? 'translateY(-100px)' : `translateY(${10 * index}px)`}  `,
      };
    });
  });
  const currentChunk = useSlideStore((state) => state.currentChunk);
  console.log('currentChunk', currentChunk);
  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {swiperData[currentChunk].map((item, index) => {
          return (
            item.wod && (
              <SwiperItem
                wod={item.wod}
                length={swiperData.length}
                key={index}
                index={index}
                itemWidth={itemWidth}
                opacity={item.opacity}
                display={item.display}
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
