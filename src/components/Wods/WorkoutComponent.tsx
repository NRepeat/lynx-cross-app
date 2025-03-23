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
  const { title, subTitle, timeCap, wodType, workoutTemplate, details } =
    workout;
  const { gender, difficulty } = details;

  const variables = workout.variables[gender as keyof typeof workout.variables][
    difficulty
  ] as { [key: string]: string };
  console.log('🚀 ~ variables:', variables);

  const workoutDescription = workoutTemplate.replace(
    /{(.*?)}/g,
    (_, key) => variables[key] || key,
  );
  Object.keys;
  return (
    <view class="workout-component">
      {/* <text>{title}</text> */}
      <text className="wodType">{wodType}</text>
      {timeCap && <text>Time cap: {timeCap}</text>}

      <view class="exercise">
        {Object.keys(variables).map((v) => (
          <text>
            {variables[v]}
            {v}
          </text>
        ))}
      </view>
    </view>
  );
};
