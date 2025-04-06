import React from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import Filter from './Filter.jsx';
import { useEffect, useMainThreadRef } from '@lynx-js/react';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import { useNavigate } from 'react-router';

const Wods = () => {
  const { animate, cancel } = useAnimate();
  const touchStartYRef = useMainThreadRef<number>(0);
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  const nav = useNavigate();

  const handleCloseModal = () => {
    'main thread';

    const modal = lynx.querySelector('#modal');
    animate({
      from: 1,
      to: 0,
      duration: 300,
      onUpdate: (value) => {
        modal?.setStyleProperties({
          opacity: '' + value * 1.1,
          height: '' + value * 70 + 'vh',
        });
      },
    });
    touchStartCurrentOffsetRef.current = 0;
    touchStartYRef.current = 0;
  };
  const handleOpenModal = (e: MainThread.TouchEvent) => {
    'main thread';

    animate({
      from: 0,
      to: 1,
      duration: 300,
      onUpdate: (value) => {
        containerRef.current?.setStyleProperties({
          opacity: '' + value,
          height: '' + value * 70 + 'vh',
          transform: `translateY(0px))`,
        });
      },
    });
  };

  const handleTouchStart = (e: MainThread.TouchEvent) => {
    'main thread';
    const touchStartY = e.touches[0].clientY;
    touchStartYRef.current = touchStartY;

    // touchStartCurrentOffsetRef.current = 0;
  };

  const handleMoveDownModal = (e: MainThread.TouchEvent) => {
    'main thread';
    const touchMoveY = e.touches[0].clientY;

    const deltaY = touchMoveY - touchStartYRef.current;

    const screenHeight = SystemInfo.pixelHeight;

    const normalizedDeltaY = deltaY / screenHeight; // This will give a value between 0 and 1, scaled by the screen height

    const scaleFactor = 0.1;
    const scaledDeltaY = normalizedDeltaY * scaleFactor;

    const lowerBound = SystemInfo.pixelHeight / SystemInfo.pixelRatio;

    let offset =
      touchStartCurrentOffsetRef.current + scaledDeltaY * screenHeight;

    const realOffset = Math.max(0, Math.min(offset, screenHeight - lowerBound));

    containerRef.current?.setStyleProperties({
      transform: `translateY(${realOffset}px)`,
    });
    const hideThreshold = 400;
    if (realOffset > hideThreshold) {
      containerRef.current?.setStyleProperties({
        height: '0vh', // Move it completely off-screen
        opacity: '0', // Optional: fade out the modal
        transform: `translateY(0px)`, // Reset the transform
      });

      touchStartCurrentOffsetRef.current = 0;
    } else {
      touchStartCurrentOffsetRef.current = realOffset;
    }
  };

  const handleTouchEnd = () => {
    'main thread';
    touchStartCurrentOffsetRef.current = 0;
    touchStartYRef.current = 0;
  };
  const handleStartWorkout = () => {
    nav(`/homee`);
  };
  const Buttons = ({
    link,
    name,
    start,
  }: {
    name: string;
    link: string;
    start?: boolean;
  }) => {
    return (
      <view
        bindtap={handleStartWorkout}
        className={`control__panel__buttons ${start ? 'start__workout' : ''}`}
        // main-thread:bindtouchstart={handleOpenModal}
      >
        <text>{name}</text>
      </view>
    );
  };

  const Modal = () => {
    return (
      <view
        className={`modal`}
        id="modal"
        main-thread:ref={containerRef}
        main-thread:bindtouchmove={handleMoveDownModal}
        main-thread:bindtouchstart={handleTouchStart}
        main-thread:bindtouchend={handleTouchEnd}
      >
        <view className="close__modal">
          <text main-thread:bindtap={handleCloseModal}>Close</text>
        </view>
        <Filter />
      </view>
    );
  };
  return (
    <view className="page">
      <view className="wods">
        <Swiper duration={300} />
      </view>
      {/* <view class="start__workout">
        <text>Start workout</text>
      </view> */}
      <view class="control__panel__container">
        <Buttons start name="Start workout" link="/start" />
        <view class="control__panel">
          <Buttons name="Filter" link="/filter" />
          <Buttons name="Sort" link="/sort" />
          <Buttons name="Sort" link="/sort" />
          <Buttons name="Sort" link="/sort" />
        </view>
      </view>
      <Modal />
    </view>
  );
};

export default Wods;

// const ControlPanel = () => {
//   const [showFilter, setShowFilter] = React.useState(false);
//   const { animate, cancel } = useAnimate();
//   const Buttons = ({ link, name }: { name: string; link: string }) => {
//     return (
//       <view
//         className="control__panel__buttons"
//         bindtap={() => setShowFilter(!showFilter)}
//       >
//         <text>{name}</text>
//       </view>
//     );
//   };
//   const Modal = () => {
//     return (
//       <view className={`modal ${showFilter && 'active__modal'}`} id="modal">
//         <Filter />
//       </view>
//     );
//   };
//   return (
//     <view class="control__panel">
//       <Buttons name="Filter" link="/filter" />
//       <Buttons name="Sort" link="/sort" />
//       {showFilter && <Modal />}
//     </view>
//   );
// };
