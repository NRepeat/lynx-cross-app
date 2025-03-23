import { create } from 'zustand';
import type { WorkoutType } from '../components/Wods/Wods.jsx';

type State = {
  slides: {
    title: string;
    subTitle: string;
    workout:
      | WorkoutType<'women', "Rx'd">
      | WorkoutType<'men', "Rx'd">
      | WorkoutType<'men', 'Scaled'>
      | WorkoutType<'women', 'Scaled'>;
  }[];
  nextSlides: {
    title: string;
    subTitle: string;
  }[];
  filters: {
    gander?: 'man' | 'women';
    difficulty?: 'Rx' | 'Scaled' | 'Foundations';
  };
  toggleGenderFilters: (filter: State['filters']['gander']) => void;
  toggleDifficultyFilters: (filter: State['filters']['difficulty']) => void;
  setFilters: (filters: State['filters']) => void;
};

type Action = {
  setSlides: (slides: State['slides']) => void;
};

const womenScaledWorkout: WorkoutType<'women', 'Scaled'>[] = [
  {
    title: '25.3',
    subTitle: 'Open Workouts',
    details: {
      gender: 'women',
      difficulty: 'Scaled',
    },
    wodType: 'For Time',
    timeCap: 20,
    workoutTemplate:
      '{wallWalks} Wall Walks, {calorieRow} Calorie Row,{wallWalks} Wall Walks, {deadlifts} Deadlifts, {wallWalks} Wall Walks,{cleans} Cleans,{wallWalks} Wall Walks, {snatches} Snatches,{wallWalks} Wall Walks ,{calorieRow} Calorie Row',
    variables: {
      women: {
        Scaled: {
          'Wall Walks': '5',
          'Calorie Row': '5-',
          Deadlifts: '25  155-lb (70-kg)',
          Cleans: '25  85-lb (38-kg)',
          Snatches: '25  65-lb (29-kg)',
        },
      },
    },
  },
  {
    title: 'WOD 1',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'women',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      women: { Scaled: { thrusters: '95', doubleUnders: '100' } },
    },
  },
  {
    title: 'WOD 3',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'women',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      women: { Scaled: { thrusters: '95', doubleUnders: '100' } },
    },
  },
];
const womenRxWorkout: WorkoutType<'women', "Rx'd">[] = [
  {
    title: '25.3',
    subTitle: 'Open Workouts',
    details: {
      gender: 'women',
      difficulty: "Rx'd",
    },
    wodType: 'For Time',
    timeCap: 20,
    workoutTemplate:
      '{wallWalks} Wall Walks, {calorieRow} Calorie Row,{wallWalks} Wall Walks, {deadlifts} Deadlifts, {wallWalks} Wall Walks,{cleans} Cleans,{wallWalks} Wall Walks, {snatches} Snatches,{wallWalks} Wall Walks ,{calorieRow} Calorie Row',
    variables: {
      women: {
        "Rx'd": {
          'Wall Walks': '5',
          'Calorie Row': '5-',
          Deadlifts: '25  225-lb (102-kg)',
          Cleans: '25  135-lb (61-kg)',
          Snatches: '25  95-lb (43-kg)',
        },
      },
    },
  },
];

const manRxWorkout: WorkoutType<'men', "Rx'd">[] = [
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
const manScaledWorkout: WorkoutType<'men', 'Scaled'>[] = [
  {
    title: 'WOD 2',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'men',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      men: { Scaled: { thrusters: '295', doubleUnders: '2100' } },
    },
  },
  {
    title: 'WOD 1',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'men',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      men: { Scaled: { thrusters: '195', doubleUnders: '1100' } },
    },
  },
  {
    title: 'WOD 3',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'men',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      men: { Scaled: { thrusters: '195', doubleUnders: '1100' } },
    },
  },
];
export const useSlideStore = create<State & Action>((set) => ({
  slides: [...manRxWorkout, ...manScaledWorkout]
    .filter((item) => item.details.difficulty === "Rx'd")
    .map((workout) => ({
      title: workout.title,
      subTitle: workout.subTitle,
      workout,
    })),
  filters: { difficulty: 'Rx', gander: 'man' },
  nextSlides: [
    { title: 'WOD 1', subTitle: 'CrossFit', workout: manRxWorkout[0] },
  ],

  setFilters: (filters) => set({ filters }),

  toggleGenderFilters: (filter) => {
    set((state) => {
      const { difficulty } = state.filters;

      let filteredSlides;
      if (filter === 'man') {
        filteredSlides = [...manRxWorkout, ...manScaledWorkout].filter(
          (workout) => workout.details.difficulty.includes(difficulty!),
        );
      } else {
        filteredSlides = [...womenRxWorkout, ...womenScaledWorkout].filter(
          (workout) => workout.details.difficulty.includes(difficulty!),
        );
      }

      return {
        filters: { ...state.filters, gander: filter },
        slides: filteredSlides.map((workout) => ({
          title: workout.title,
          subTitle: workout.subTitle,
          workout,
        })),
      };
    });
  },

  toggleDifficultyFilters: (filter) => {
    set((state) => {
      const { gander } = state.filters;

      let filteredSlides;
      if (gander === 'man') {
        filteredSlides = [...manRxWorkout, ...manScaledWorkout].filter(
          (workout) => workout.details.difficulty.includes(filter!),
        );
      } else {
        filteredSlides = [...womenRxWorkout, ...womenScaledWorkout].filter(
          (workout) => workout.details.difficulty.includes(filter!),
        );
      }

      return {
        filters: { ...state.filters, difficulty: filter },
        slides: filteredSlides.map((workout) => ({
          title: workout.title,
          subTitle: workout.subTitle,
          workout,
        })),
      };
    });
  },

  setSlides: (slides) => set({ slides }),
}));
