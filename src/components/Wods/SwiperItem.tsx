import { useEffect, useState } from '@lynx-js/react';
import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useGlobal } from '../../store/global.js';
import { type Wod, useSlideStore } from '../../store/workout.js';
import Time from './Time.jsx';
import { WorkoutComponent } from './WorkoutComponent.jsx';
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
  console.log(state.currentIndex, 'asd---------------------');
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
      <view class="swiper-item__container">
        <view className="title">
          <text>{wod.title}</text>
          <view className="type__container">
            <text className="type">{wod.type}</text>
            <text className="time">{wod.time}m/3r</text>
          </view>
          {/* {wod.time && <Time time={wod.time} />} */}
        </view>
        <view class="description">
          {wod.workout.map((item, index) => {
            const { exercise, reps, weight } = item;
            return (
              <view key={`list-item-${index}`} class="description">
                <text>
                  {exercise.name}-{reps}
                  {weight && (
                    <text class="weight">
                      /{weight?.value}-{weight?.label}
                    </text>
                  )}
                </text>
              </view>
            );
          })}
        </view>
      </view>
      <view class="info_container">
        <view class="info_text_container">
          <text>{wod.difficulty}</text>
        </view>
        <view class="info_text_container">
          <text>{wod.gender}</text>
        </view>
      </view>
      {/* <WorkoutComponent wod={wod} /> */}
    </view>
  );
}
export { SwiperItem };
