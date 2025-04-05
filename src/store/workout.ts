import { create } from 'zustand';

export type WodTypeEnum = 'For Time' | 'AMRAP' | 'EMOM' | 'Tabata';
export type WodDifficultyType = 'Rx' | 'Scaled' | 'Foundations';
export type WodGenderType = 'man' | 'women';
export type WodWightType = { value: number; label: 'kg' | 'lb' };
export type WodExerciseEquipmentType =
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'kettlebell'
  | 'medicine ball'
  | 'pull-up bar';

type WodExerciseNameType =
  | 'Push up'
  | 'Pull up'
  | 'Air squat'
  | 'Burpee'
  | 'Sit up'
  | 'Box jump'
  | 'Wall ball'
  | 'Row'
  | 'Run'
  | 'Bike'
  | 'Double under'
  | 'Thruster'
  | 'Clean'
  | 'Snatch'
  | 'Deadlift'
  | 'Back squat'
  | 'Front squat'
  | 'Overhead squat'
  | 'Overhead press'
  | 'Push press'
  | 'Push jerk'
  | 'Split jerk'
  | 'Muscle up'
  | 'Handstand push up'
  | 'Handstand walk'
  | 'Handstand hold'
  | 'Handstand'
  | 'Rope climb'
  | 'Toes to bar';
type WodExerciseType = {
  name: WodExerciseNameType;
  equipment?: WodExerciseEquipmentType;
  link?: string;
};
export type WorkoutType = {
  exercise: WodExerciseType;
  reps: number | null;
  weight: WodWightType | null;
};
interface WodType {
  title: string;
  time: number | null;
  type: WodTypeEnum;
  workout: WorkoutType[];
  gender?: WodGenderType;
  difficulty?: WodDifficultyType;
}
export class Wod implements WodType {
  title: string;
  description: string | undefined;
  time: number | null;
  type: WodTypeEnum;
  workout: WorkoutType[];
  difficulty: WodDifficultyType;
  gender: WodGenderType | undefined;
  constructor(
    title: string,
    description: string,
    time: number | null,
    type: WodTypeEnum,
    workout: WorkoutType[],
    difficulty: WodDifficultyType,
    gender?: WodGenderType,
  ) {
    this.title = title;
    this.description = description;
    this.time = time;
    this.type = type;
    this.workout = workout;
    this.difficulty = difficulty;
    this.gender = gender;
  }
}
type State = {
  slides: Wod[];
  reset: boolean;
  setReset: (reset: boolean) => void;
  filters: {
    gander?: WodGenderType;
    equipment?: WodExerciseEquipmentType;
    exercise?: WodExerciseNameType;
    difficulty?: WodDifficultyType;
    wodType?: WodTypeEnum;
    time?: number;
  };
  setFilters: (filters: State['filters']) => void;
};

type Action = {
  setSlides: (slides: State['slides']) => void;
};
const wods = Array.from({ length: 115 }, (_, i) => {
  return new Wod(
    `Wod ${i + 1}`,
    `Description ${i + 1}`,
    60,
    'For Time',

    [
      {
        exercise: { name: 'Push up', equipment: 'bodyweight' },
        reps: 10,
        weight: null,
      },
      {
        exercise: { name: 'Pull up', equipment: 'pull-up bar' },
        reps: 10,
        weight: null,
      },
      {
        exercise: {
          name: 'Thruster',
          equipment: 'barbell',
          link: 'https://www.youtube.com/watch?v=4fKXv1fP6Ug',
        },
        reps: 10,
        weight: { value: 50, label: 'kg' },
      },
    ],
    `${i % 3 === 0 ? 'Rx' : i % 3 === 1 ? 'Scaled' : 'Foundations'}`,
    `${i % 2 === 0 ? 'man' : 'women'}`,
  );
});
export const filterWods = (wods: Wod[], filters: State['filters']): Wod[] => {
  return wods.filter((wod) => {
    if (filters.gander && wod.gender !== filters.gander) return false;
    if (filters.difficulty && wod.difficulty !== filters.difficulty)
      return false;
    if (filters.wodType && wod.type !== filters.wodType) return false;
    if (filters.time && wod.time && wod.time > filters.time) return false;

    if (filters.equipment || filters.exercise) {
      const matchesExercise = wod.workout.some(({ exercise }) => {
        return (
          (!filters.exercise || exercise.name === filters.exercise) &&
          (!filters.equipment || exercise.equipment === filters.equipment)
        );
      });
      if (!matchesExercise) return false;
    }

    return true;
  });
};

export const useFilteredSlides = () => {
  const { slides, filters } = useSlideStore();
  return filterWods(slides, filters);
};

export const useSlideStore = create<State & Action>((set) => ({
  slides: wods,
  reset: false,
  setReset: (reset) => set({ reset }),
  filters: { difficulty: 'Rx', gander: 'man' },

  setFilters: (filters) => set({ filters, reset: true }),

  setSlides: (slides) => set({ slides }),
}));
