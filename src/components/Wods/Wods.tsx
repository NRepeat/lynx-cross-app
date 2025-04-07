import React from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import Filter from './Filter.jsx';
import { runOnBackground, useEffect, useMainThreadRef } from '@lynx-js/react';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import { useNavigate } from 'react-router';
import { useState } from '@lynx-js/react/legacy-react-runtime';
import { useSlideStore } from '../../store/workout.js';
import useTimer from '../../hooks/useTimer.jsx';
import chevronLeft from '../../assets/chevron-left.png';
import StartWorkout from './Training.jsx';
import { useGlobal } from '../../store/global.js';
const Wods = () => {
  const { animate, cancel } = useAnimate();
  const touchStartYRef = useMainThreadRef<number>(0);
  const g = useGlobal((state) => state);
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  // const [startWorkout, setStartWorkout] = useState(false);
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
          height: '' + value * 100 + 'vh',
        });
      },
    });
    touchStartCurrentOffsetRef.current = 0;
    touchStartYRef.current = 0;
  };
  const handleOpenModal = () => {
    'main thread';

    animate({
      from: 0,
      to: 1,
      duration: 300,
      onUpdate: (value) => {
        containerRef.current?.setStyleProperties({
          opacity: '' + value,
          height: '' + value * 100 + 'vh',
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
    'main thread';
    runOnBackground(g.setWorkoutIsStarted)(true);
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
        className={`control__panel__buttons ${start ? 'start__workout' : ''}`}
        main-thread:bindtouchstart={
          start ? handleStartWorkout : handleOpenModal
        }
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
        // main-thread:bindtouchmove={handleMoveDownModal}
        main-thread:bindtouchstart={handleTouchStart}
        // main-thread:bindtouchend={handleTouchEnd}
      >
        <view class="modal__container">
          <view className="close__modal">
            <view main-thread:bindtap={handleCloseModal}>
              <text>X</text>
            </view>
            <text class="filters__heading">Filters</text>
          </view>
          <Filter />
        </view>
      </view>
    );
  };
  return (
    <view className="page">
      {!g.workoutIsStarted && (
        <>
          <view className="wods">
            <Swiper duration={300} />
          </view>
          <view class="control__panel__container">
            <Buttons start name="Start workout" link="/start" />
            <view class="control__panel">
              <Buttons name="Filter" link="/filter" />
              <Buttons name="Sort" link="/sort" />
              <Buttons name="Sort" link="/sort" />
              <Buttons name="Sort" link="/sort" />
            </view>
          </view>
        </>
      )}

      <Modal />
      {g.workoutIsStarted && <StartWorkout />}
    </view>
  );
};

export default Wods;
