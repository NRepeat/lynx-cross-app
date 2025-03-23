import type { SlideWorkoutType } from './Swiper.jsx';
import type { WorkoutType } from './Wods.jsx';

export const WorkoutComponent = ({
  workout,
}: {
  workout:
    | WorkoutType<'women', "Rx'd">
    | WorkoutType<'men', "Rx'd">
    | WorkoutType<'men', 'Scaled'>
    | WorkoutType<'women', 'Scaled'>;
}) => {
  const { title, subTitle, wodType, workoutTemplate, details } = workout;
  const { gender, difficulty } = details;

  const variables = workout.variables[gender][difficulty];

  // Подставляем значения в шаблон
  const workoutDescription = workoutTemplate.replace(
    /{(.*?)}/g,
    (_, key) => variables[key] || key,
  );

  return (
    <view class="workout-component">
      <text>{title}</text>
      <text>{subTitle}</text>
      <text>{wodType}</text>
      <text>{workoutDescription}</text>
    </view>
  );
};
