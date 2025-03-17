import React, { act, useEffect } from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import { useQuery } from '@tanstack/react-query';
export type StageType = 'Opens' | 'Semifinals' | 'Games';
export type WodType = 'AMRAP' | 'For Time' | 'EMOM' | 'Tabata';
export type WorkoutDifficultyType = "Rx'd" | 'Scaled' | 'Foundations';
export type GenderType = 'men' | 'women';
export type WorkoutVariablesType<
  T extends GenderType,
  U extends WorkoutDifficultyType,
> = Record<string, string>;

export type WorkoutType<
  T extends GenderType,
  U extends WorkoutDifficultyType,
> = {
  title: string;
  subTitle: string;
  wodType: WodType;
  workoutTemplate: string;
  variables: Record<T, Record<U, WorkoutVariablesType<T, U>>>;
  details: {
    gender: T;
    difficulty: U;
  };
};
const Wods = () => {
  // const [wods, setWods] = React.useState<
  //   { thumbnail: string; workout: string }[]
  // >([]);

  const womenRxWorkout: WorkoutType<'women', "Rx'd">[] = [
    {
      title: 'WOD 2',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'women',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        women: { "Rx'd": { thrusters: '95', doubleUnders: '100' } },
      },
    },
    {
      title: 'WOD 1',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'women',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        women: { "Rx'd": { thrusters: '95', doubleUnders: '100' } },
      },
    },
    {
      title: 'WOD 3',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'women',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        women: { "Rx'd": { thrusters: '95', doubleUnders: '100' } },
      },
    },
  ];

  const menRxWorkout: WorkoutType<'men', "Rx'd">[] = [
    {
      title: 'WOD 2',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'men',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        men: { "Rx'd": { thrusters: '295', doubleUnders: '2100' } },
      },
    },
    {
      title: 'WOD 1',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'men',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        men: { "Rx'd": { thrusters: '195', doubleUnders: '1100' } },
      },
    },
    {
      title: 'WOD 3',
      subTitle: 'CrossFit Open',
      details: {
        gender: 'men',
        difficulty: "Rx'd",
      },
      wodType: 'AMRAP',
      workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
      variables: {
        men: { "Rx'd": { thrusters: '195', doubleUnders: '1100' } },
      },
    },
  ];
  const wods = [...womenRxWorkout, ...menRxWorkout];
  const slides = [
    { title: 'WOD 1', subTitle: 'CrossFit Open' },
    { title: 'WOD 2', subTitle: 'CrossFit Open' },
    { title: 'WOD 3', subTitle: 'CrossFit Open' },
  ];
  const swiperData = slides.map((slide) => {
    return {
      active: true,
      title: slide.title,
      workout: wods.filter((wod) => wod.title === slide.title),
    };
  });
  const easing = (x: number) => {
    'main thread';
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  return (
    <view className="page">
      <view className="wods">
        <Swiper data={swiperData} main-thread:easing={easing} duration={300} />
      </view>
    </view>
  );
};

export default Wods;
