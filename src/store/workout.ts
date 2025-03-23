import { create } from 'zustand';
import type { WorkoutType } from '../components/Wods/Wods.jsx';

type State = {
  slides: {
    title: string;
    subTitle: string;
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
const firstSlides = [
  { title: 'WOD 1', subTitle: 'CrossFit Open' },
  { title: 'WOD 2', subTitle: 'CrossFit Open' },
  { title: 'WOD 3', subTitle: 'CrossFit Open' },
];

export const useSlideStore = create<State & Action>((set) => ({
  slides: [
    { title: 'WOD 1', subTitle: 'CrossFit Open' },
    { title: 'WOD 2', subTitle: 'CrossFit Open' },
    { title: 'WOD 3', subTitle: 'CrossFit Open' },
  ],
  filters: { difficulty: 'Rx', gander: 'man' },
  setFilters: (filters) => set({ filters }),
  nextSlides: firstSlides,
  toggleDifficultyFilters: (filter) => {
    set((state) => {
      return { filters: { ...state.filters, difficulty: filter } };
    });
  },
  toggleGenderFilters: (filter) => {
    set((state) => {
      return { filters: { ...state.filters, gander: filter } };
    });
  },
  setSlides: (slides) => set({ slides }),
}));
