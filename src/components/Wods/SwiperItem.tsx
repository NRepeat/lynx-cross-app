import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import { useEffect, useState } from '@lynx-js/react';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import { WorkoutComponent } from './WorkoutComponent.jsx';
import Time from './Time.jsx';
import { useSlideStore, type Wod } from '../../store/workout.js';
function SwiperItem({
  index,
  opacity,
  itemWidth,
  zIndex,
  transform,
  length,
  wod,
}: {
  index: number;
  itemWidth: number;
  zIndex: number;
  transform: string;
  opacity: number;
  length: number;
  wod: Wod;
}) {
  const easing = (x: number) => {
    'main thread';
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  const state = useSlideStore((state) => state);
  const { containerRef, updateSwiperStyle, updateAllItems } =
    useUpdateSwiperStyle();
  const { animate, cancel } = useAnimate();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, updateIndex } =
    useOffset({
      itemWidth,
      dataLength: length,
      onIndexUpdate: state.setCurrentIndex,
      onOffsetUpdate: updateSwiperStyle,
      duration: 200,
      updateAllItems,
      MTEasing: easing,
      currentIndex: index,
    });

  const handleTap = async (e: BaseTouchEvent<MainThread.Element>) => {
    'main thread';
    const openCard = e.currentTarget.getAttribute('open') === 'true';
    const target = e.currentTarget;
    const active = target.getAttribute('name') === 'first';
    function open() {
      'main thread';
      cancel();
      if (active) {
        cancel();
        if (openCard) {
          animate({
            easing: (t) => t,
            duration: 100,
            from: 1,
            to: 0.65,
            onUpdate: (value) => {
              target.setStyleProperties({
                height: `${value * 100}vh`,
              });
            },
            onComplete: () => {
              target.setAttribute('open', 'false');
            },
          });
        } else {
          animate({
            easing: (t) => t,
            duration: 100,
            from: 0.65,
            to: 1.05,
            onUpdate: (value) => {
              target.setStyleProperties({
                height: `${value * 100}vh`,
                opacity: '1',
              });
            },
            onComplete: () => {
              target.setAttribute('open', 'true');
            },
          });
        }
      }
    }
    open();
  };

  return (
    <view
      main-thread:bindtouchstart={handleTouchStart}
      main-thread:bindtouchmove={handleTouchMove}
      main-thread:bindtouchend={handleTouchEnd}
      main-thread:bindtap={handleTap}
      main-thread:ref={containerRef}
      id={`${index}`}
      key={index}
      name={`${index === 0 ? 'first' : index === length - 1 ? 'last' : ''}`}
      style={{
        width: `${itemWidth}px`,
        height: `${'65vh'}`,
        transform,
        display: `${index >= 10 ? 'none' : 'block'}`,
        zIndex: `${opacity <= 0 ? -10 : zIndex}`,
        opacity: `${opacity}`,
        transitionDelay: '1s' as const,
      }}
      className={`swiper-item `}
    >
      <view className="title">
        <text>{wod.title}</text>
        <view className="type__container">
          <text className="type">{wod.type}</text>
          <text className="time">{wod.time}m/3r</text>
          <text className="rest"> {state.currentIndex}</text>
        </view>
        {/* {wod.time && <Time time={wod.time} />} */}
      </view>
      <view class="description">
        <text> 50 Jumping Jack</text>
        <text> 50 Sit-Ups</text>
        <text> 20 Push-Ups</text>
        <text> 20 Kettlebell Swing - 1,5 pood</text>
      </view>

      {/* <WorkoutComponent wod={wod} /> */}
    </view>
  );
}
export { SwiperItem };
