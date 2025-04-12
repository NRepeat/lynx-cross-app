import type React from 'react';
import './style.css';
import {
  runOnBackground,
  useEffect,
  useMainThreadRef,
  useState,
} from '@lynx-js/react';
import type { BaseTouchEvent, MainThread } from '@lynx-js/types';
import user from '../../assets/user.png';
import { useAnimate } from '../../hooks/useAnimate.jsx';
import Filter from './Filter.jsx';
import { Swiper } from './Swiper.jsx';

import { useGlobal } from '../../store/global.js';
import LikeIcon from '../LikeIcon.jsx';
import Icon from '../ui/Icon.jsx';
import StartWorkout from './Training.jsx';
import { useFavWods } from '../../hooks/useFavWods.js';
import { useSlideStore } from '../../store/workout.js';
const Wods = () => {
  const { animate, cancel } = useAnimate();
  const touchStartYRef = useMainThreadRef<number>(0);
  const g = useGlobal((state) => state);
  const slideState = useSlideStore((state) => state);
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const touchStartCurrentOffsetRef = useMainThreadRef<number>(0);
  // const { getFavWods } = useFavWods();
  // useEffect(() => {
  //   getFavWods();
  // }, []);
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

  const handleStartWorkout = () => {
    'main thread';
    runOnBackground(g.setWorkoutIsStarted)(true);
  };
  const Buttons = ({
    link,
    name,
    start,
    children,
    onClick,
    like,
    userIcon,
  }: {
    userIcon?: boolean;
    like?: boolean;
    name?: string;
    link?: string;
    start?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
  }) => {
    return (
      <view
        className={`control__panel__buttons ${start ? 'start__workout' : ''} ${like ? 'like__button' : ''}  ${userIcon ? 'user_button' : ''} `}
        main-thread:bindtouchstart={onClick}
      >
        {name && <text>{name}</text>}
        {children && <view class="button__content">{children}</view>}
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
            <Buttons start name="Start workout" onClick={handleStartWorkout} />
            <view class="control__panel">
              <Buttons name="Filter" onClick={handleOpenModal} />
              <Buttons like>
                <LikeIcon
                  wodId={slideState.slides[slideState.currentIndex]?.id}
                />
              </Buttons>
              <Buttons userIcon>
                <Icon src={user} />
              </Buttons>
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
