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
    title: 'WOD 2',
    subTitle: 'CrossFit Open',
    details: {
      gender: 'women',
      difficulty: 'Scaled',
    },
    wodType: 'AMRAP',
    workoutTemplate: '{thrusters} Thrusters, {doubleUnders} Double-unders',
    variables: {
      women: { Scaled: { thrusters: '33395', doubleUnders: '100' } },
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
