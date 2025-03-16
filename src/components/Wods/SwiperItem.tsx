import { WorkoutComponent } from './WorkoutComponent.jsx';
import type { SlideWorkoutType } from './Swiper.jsx';
import type { WorkoutType } from './Wods.jsx';
import Icon from '../ui/Icon.jsx';
import chevronLeft from '../../assets/chevron-left.png';
import user from '../../assets/user.png';
import { useLocation, useNavigate } from 'react-router';
import type { MainThread, TouchEvent } from '@lynx-js/types';
import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import { useState } from '@lynx-js/react/legacy-react-runtime';
function SwiperItem({
  pic,
  workout,
  title,
  index,
  opacity,
  itemWidth,
  zIndex,
  transform,
  length,
}: {
  index: number;
  pic: string;
  itemWidth: number;
  zIndex: number;
  transform: string;
  title: string;
  length: number;
  opacity: number;
  workout: (WorkoutType<'women', "Rx'd"> | WorkoutType<'men', "Rx'd">)[];
}) {
  const [current, setCurrent] = useState(0);
  const { containerRef, updateSwiperStyle } = useUpdateSwiperStyle();
  const easing = (x: number) => {
    'main thread';
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  const { handleTouchStart, handleTouchMove, handleTouchEnd, updateIndex } =
    useOffset({
      itemWidth,
      dataLength: length,
      onIndexUpdate: setCurrent,
      onOffsetUpdate: updateSwiperStyle,
      duration: 300,
      currentItemIndex: index,
      MTEasing: easing,
    });

  const location = useLocation();
  const nav = useNavigate();
  const handleBack = () => {
    nav(-1);
  };
  const handleHome = () => {
    nav('/');
  };
  return (
    <view
      id={`${index}`}
      main-thread:ref={containerRef}
      main-thread:bindtouchstart={handleTouchStart}
      main-thread:bindtouchmove={handleTouchMove}
      main-thread:bindtouchend={handleTouchEnd}
      style={{
        width: `${itemWidth}px`,
        zIndex: zIndex,
        transform: transform,
        opacity: `${opacity}`,
      }}
      className="swiper-item"
    >
      {/* <image
        mode="aspectFill"
        src={pic}
        style={{ width: '100%', minHeight: `200px` }}
      ></image> */}
      {/* <view className="header">
        {title !== 'Home' ? (
          <Icon
            className="header-back"
            bindtap={handleBack}
            src={chevronLeft}
          />
        ) : (
          <view style={{ width: '24px' }} />
        )}
        <text bindtap={handleHome} className="header__title">
          {title}
        </text>
        <Icon className="header-user" src={user} />
      </view> */}
      <text class="title">{title}</text>

      <WorkoutComponent workout={workout[0]} />
    </view>
  );
}
export { SwiperItem };
