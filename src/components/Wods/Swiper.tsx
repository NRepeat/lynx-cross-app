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
  const [loadedChunks, setLoadedChunks] = useState(1); // Tracks how many chunks are loaded
  console.log('loadedChunks', loadedChunks);
  const chunkSize = 5;
  const slides = useFilteredSlides();
  const currentIndex = useSlideStore((state) => state.currentIndex);

  const swiperData = slides.map((slide, index) => {
    return {
      wod: slide,
      opacity: (10 - index) / 10,
      zIndex: slides.length - index,
      display: index > 5 ? 'none' : 'block',
      transform: `${index > 5 ? 'translateY(-100px)' : `translateY(${10 * index}px)`}  `,
    };
  });
  const [visibleSlides, setVisibleSlides] = useState(swiperData.slice(0, 5)); // Initialize with the first chunk of slides

  useEffect(() => {
    const currentSlide = slides[currentIndex];
    const lastChunkSlide = visibleSlides[visibleSlides.length - 1];
    if (Number(currentSlide.id) > Number(lastChunkSlide.wod.id)) {
      const nextChunk = slides
        .slice(visibleSlides.length, visibleSlides.length + chunkSize)
        .map((slide, index) => {
          return {
            wod: slide,
            opacity: (10 - index) / 10,
            zIndex: slides.length - index,
            display: index > 5 ? 'none' : 'block',
            transform: `${index > 5 ? 'translateY(-100px)' : `translateY(${10 * index}px)`}  `,
          };
        });
      setVisibleSlides((prev) => [...nextChunk]);
      setLoadedChunks((prev) => prev + 1);
    }
  }, [currentIndex, slides]);
  return (
    <view class="swiper-wrapper">
      <view class="swiper-container">
        {visibleSlides.map((item, index) => {
          return (
            item.wod && (
              <SwiperItem
                wod={item.wod}
                length={slides.length}
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
