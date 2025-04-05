import type { Wod, WodTypeEnum, WorkoutType } from '../../store/workout.js';

export const WorkoutComponent = ({ wod }: { wod: Wod }) => {
  const Cards = () =>
    wod.workout.map((w) => (
      <view class="exercise">
        <text>{w.exercise.name}</text>
      </view>
    ));

  return (
    <view class="workout-component">
      <Cards />
    </view>
  );
};
