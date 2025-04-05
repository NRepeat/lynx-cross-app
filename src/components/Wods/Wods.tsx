import React from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import Filter from './Filter.jsx';
import { useEffect, useMainThreadRef } from '@lynx-js/react';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import type { BaseTouchEvent, MainThread } from '@lynx-js/types';

const Wods = () => {
  const { animate, cancel } = useAnimate();
  const touchStartYRef = useMainThreadRef<number>(0);
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);

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

    // Calculate the raw deltaY
    const deltaY = touchMoveY - touchStartYRef.current;

    // Normalize deltaY based on window height (or another reference point)
    const screenHeight = SystemInfo.pixelHeight;

    // Normalize the deltaY to a range (e.g., percentage of the screen height)
    const normalizedDeltaY = deltaY / screenHeight; // This will give a value between 0 and 1, scaled by the screen height

    // Apply a scaling factor if necessary (optional, to adjust how much movement is felt)
    const scaleFactor = 0.1; // Adjust this to fine-tune the movement speed
    const scaledDeltaY = normalizedDeltaY * scaleFactor;
    console.log('🚀 ~ handleMoveDownModal ~ scaledDeltaY:', scaledDeltaY);

    // Calculate the lowerBound based on device pixel height and ratio
    const lowerBound = SystemInfo.pixelHeight / SystemInfo.pixelRatio;

    // Calculate the new offset by adding the scaled deltaY
    let offset =
      touchStartCurrentOffsetRef.current + scaledDeltaY * screenHeight;

    // Убедимся, что модальное окно не выходит за пределы экрана сверху (не меньше 0) или снизу (не больше lowerBound)
    const realOffset = Math.max(0, Math.min(offset, screenHeight - lowerBound));
    console.log('🚀 ~ handleMoveDownModal ~ realOffset:', realOffset);

    // Update the modal's transform to reflect the normalized and scaled movement
    containerRef.current?.setStyleProperties({
      transform: `translateY(${realOffset}px)`,
    });
    const hideThreshold = 400;
    if (realOffset > hideThreshold) {
      // Move the modal completely off-screen and reset the offset
      containerRef.current?.setStyleProperties({
        height: '0vh', // Move it completely off-screen
        opacity: '0', // Optional: fade out the modal
        transform: `translateY(0px)`, // Reset the transform
      });

      // Reset the offset reference to avoid jumps
      touchStartCurrentOffsetRef.current = 0;

      // Optionally, trigger any additional cleanup or state updates
    } else {
      // Update the current offset reference to avoid jumps
      touchStartCurrentOffsetRef.current = realOffset;
    }
  };

  // Optionally, handle touch end or cancel to reset the state
  const handleTouchEnd = () => {
    'main thread';
    // if()
    // containerRef.current?.setStyleProperties({
    //   transform: `translateY(0)`,
    // });
    touchStartCurrentOffsetRef.current = 0;
    touchStartYRef.current = 0;
  };

  const Buttons = ({ link, name }: { name: string; link: string }) => {
    return (
      <view
        className="control__panel__buttons"
        main-thread:bindtouchstart={handleOpenModal}
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
      <view class="control__panel">
        <Buttons name="Filter" link="/filter" />
        <Buttons name="Sort" link="/sort" />
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
