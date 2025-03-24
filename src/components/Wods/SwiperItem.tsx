import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import { useState } from '@lynx-js/react/legacy-react-runtime';
import { useUpdateSwiperStyle } from '../../hooks/useUpdateSwiperStyle.jsx';
import { useOffset } from '../../hooks/useOffset.jsx';
import { useAnimate } from '../../hooks/useAnimate.jsx';
// import type { WorkoutType } from './Wods.jsx';
import { WorkoutComponent } from './WorkoutComponent.jsx';
import Time from './Time.jsx';
function SwiperItem({
  title,
  index,
  opacity,
  itemWidth,
  zIndex,
  transform,
  length,
  workout,
}: {
  index: number;
  pic: string;
  itemWidth: number;
  zIndex: number;
  transform: string;
  title: string;
  isActive: boolean;
  display: 'block' | 'none';
  setCurrentIndex: (index: number) => void;
  isInitialLoad: boolean;
  opacity: number;
  length: number;
  workout: [];
}) {
  const easing = (x: number) => {
    'main thread';
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  const [current, setCurrent] = useState(0);
  const { containerRef, updateSwiperStyle, updateAllItems } =
    useUpdateSwiperStyle();
  const { animate, cancel } = useAnimate();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, updateIndex } =
    useOffset({
      itemWidth,
      dataLength: length,
      onIndexUpdate: setCurrent,
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
    const active =
      target.getAttribute('name') === 'first' ||
      target.getAttribute('name') === 'next';
    function open() {
      if (active) {
        cancel();
        if (openCard) {
          animate({
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
            duration: 200,
          });
        } else {
          animate({
            from: 0.65,
            to: 1.1,
            onUpdate: (value) => {
              target.setStyleProperties({
                height: `${value * 100}vh`,
                opacity: '1',
              });
            },
            onComplete: () => {
              target.setAttribute('open', 'true');
            },
            duration: 200,
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
        zIndex: `${zIndex}`,
        opacity: `${opacity}`,
        transitionDelay: '1s' as const,
      }}
      className={`swiper-item`}
    >
      <view className="title">
        {/* <text>{workout.subTitle}</text> */}
        <text>{title}</text>
        {/* {workout.timeCap && <Time time={workout.timeCap} />} */}
      </view>

      {/* <WorkoutComponent workout={workout} /> */}
    </view>
  );
}
export { SwiperItem };
