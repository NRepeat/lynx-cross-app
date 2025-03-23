import React from 'react';
import './style.css';
import { Swiper } from './Swiper.jsx';
import Filter from './Filter.jsx';
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
  return (
    <view className="page">
      <view className="wods">
        <Swiper duration={300} />
      </view>
      <Filter />
    </view>
  );
};

export default Wods;
