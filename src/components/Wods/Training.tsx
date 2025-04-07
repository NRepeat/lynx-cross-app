import React, { useState } from 'react';
import chevronLeft from '../../assets/chevron-left.png';
import { useSlideStore } from '../../store/workout.js';
import useCountdownTimer from '../../hooks/useTimer.jsx';
import { useNavigate } from 'react-router';
import { useGlobal } from '../../store/global.js';
import { useEffect } from '@lynx-js/react';
const StartWorkout = () => {
  const state = useSlideStore((state) => state);
  const g = useGlobal((state) => state);
  const wod = state.slides[state.currentIndex];
  const {
    minutes,
    seconds,
    preCountdown,
    isPreCountdownActive,
    isRunning,
    pauseTimer,
    resetTimer,
    resumeTimer,
    startTimer,
    skipPreCountdown,
  } = useCountdownTimer(wod.time, true, 5);
  const nav = useNavigate();
  useEffect(() => {
    if (wod) {
      g.setCurrentWorkout(wod);
    }
  }, [g.workoutIsStarted]);
  const Buttons = ({
    name,
    onClick,
    styleClassName,
  }: {
    name: string;
    onClick: () => void;
    styleClassName?: any;
  }) => {
    return (
      <view
        style={styleClassName}
        className={`control__panel__buttons `}
        bindtap={() => onClick()}
      >
        <text>{name}</text>
      </view>
    );
  };
  const handleBack = () => {
    pauseTimer();
    g.setWorkoutIsStarted(false);
  };
  const [openControlPanel, setOpenControlPanel] = useState(false);
  return (
    <view className="start__workout__container">
      <view class="close__training">
        <view>{/* <img src={chevronLeft} alt="" />{' '} */}</view>
      </view>
      {/* <Buttons name="Back" onClick={handleBack} /> */}
      <view
        class={`start__workout__timer  ${!isRunning ? 'paused' : ''}`}
        bindtap={isRunning ? pauseTimer : resumeTimer}
      >
        {isPreCountdownActive ? (
          <text>{preCountdown}</text>
        ) : (
          <>
            <text>
              {minutes === 0 && isRunning ? wod.time : minutes}:{seconds}
            </text>
            <text>/ {wod.rounds}r</text>
          </>
        )}
      </view>
      <text class="text__description">Tap timer to pause</text>
      <view class="start__workout__wod">
        <scroll-view
          scroll-orientation="vertical"
          style={{
            maxHeight: 'calc(100vh - 260px)',
          }}
          class="start__workout__description"
        >
          {[...wod.workout, ...wod.workout, ...wod.workout, ...wod.workout].map(
            (item, index) => {
              const { exercise, reps, weight } = item;
              return (
                <view key={`list-item-${index}`} class="start__workout__item">
                  <text>
                    {exercise.name}-{reps}
                  </text>
                  {weight && (
                    <view class="workout_weight">
                      <text>
                        {weight?.value}-{weight?.label}
                      </text>
                    </view>
                  )}
                </view>
              );
            },
          )}
        </scroll-view>
      </view>
      {/* <view class="open__control__panel">Open</view> */}
      <view class="control__panel__container">
        {/* <Buttons
              name="Stop "
              onClick={pauseTimer}
            />
            <view class="control__panel">
              <Buttons name="Resume" onClick={resumeTimer} />
              <Buttons name="Reset" onClick={resetTimer} />
              <Buttons name="Skip countdown" onClick={skipPreCountdown} />
              <Buttons name="Sort" onClick={startTimer} />
            </view> */}
      </view>
    </view>
  );
};

export default StartWorkout;
