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
export interface WodType {
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
  rounds: number | null;
  type: WodTypeEnum;
  workout: WorkoutType[];
  difficulty: WodDifficultyType;
  gender: WodGenderType | undefined;
  constructor(
    title: string,
    description: string,
    time: number | null,
    rounds: number | null,
    type: WodTypeEnum,
    workout: WorkoutType[],
    difficulty: WodDifficultyType,
    gender?: WodGenderType,
  ) {
    this.title = title;
    this.description = description;
    this.time = time;
    this.type = type;
    this.rounds = rounds;
    this.workout = workout;
    this.difficulty = difficulty;
    this.gender = gender;
  }
}
type State = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  slides: Wod[];
  availableFilters: Map<string, Set<string>>;
  reset: boolean;
  setReset: (reset: boolean) => void;
  filters: {
    gender?: WodGenderType[];
    equipment?: WodExerciseEquipmentType[];
    exercise?: WodExerciseNameType[];
    difficulty?: WodDifficultyType[];
    wodType?: WodTypeEnum[];
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
    3,
    i % 3 === 0 ? 'For Time' : i % 3 === 1 ? 'AMRAP' : 'EMOM',

    [
      {
        exercise: { name: 'Push up', equipment: 'bodyweight' },
        reps: i % 3 === 0 ? 12 : i % 3 === 1 ? 10 : 5,
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
  if (!filters || Object.keys(filters).length === 0) {
    return wods;
  }

  return wods.filter((wod) => {
    // Gender filter (fixed typo from 'gander' to 'gender')
    if (
      filters.gender &&
      filters.gender.length > 0 &&
      !filters.gender.includes(wod.gender!)
    ) {
      return false;
    }

    // Difficulty filter
    if (
      filters.difficulty &&
      filters.difficulty.length > 0 &&
      !filters.difficulty.includes(wod.difficulty)
    ) {
      return false;
    }

    // WOD type filter
    if (
      filters.wodType &&
      filters.wodType.length > 0 &&
      !filters.wodType.includes(wod.type)
    ) {
      return false;
    }

    // Time filter
    if (filters.time && wod.time! > filters.time) {
      return false;
    }

    // Exercise and equipment filters
    if (filters.exercise || filters.equipment) {
      const matchesExerciseFilters = wod.workout.some(({ exercise }) => {
        const exerciseMatch =
          !filters.exercise || filters.exercise.includes(exercise.name);
        const equipmentMatch =
          !filters.equipment || filters.equipment.includes(exercise.equipment!);

        return exerciseMatch && equipmentMatch;
      });

      if (!matchesExerciseFilters) {
        return false;
      }
    }

    return true;
  });
};

const generateAvailableFilters = (wods: Wod[]): Map<string, Set<string>> => {
  const filtersMap = new Map<string, Set<string>>();

  // Initialize with empty sets
  filtersMap.set('difficulty', new Set<string>());
  filtersMap.set('gender', new Set<string>());
  filtersMap.set('wodType', new Set<string>());
  filtersMap.set('equipment', new Set<string>());
  filtersMap.set('exercise', new Set<string>());

  wods.forEach((wod) => {
    // Add wod properties to respective filter sets
    filtersMap.get('difficulty')?.add(wod.difficulty);
    filtersMap.get('gender')?.add(wod.gender ? wod.gender : '');
    filtersMap.get('wodType')?.add(wod.type);

    // Add exercise properties
    wod.workout.forEach((item) => {
      filtersMap
        .get('equipment')
        ?.add(item.exercise.equipment ? item.exercise.equipment : '');
      filtersMap.get('exercise')?.add(item.exercise.name);
    });
  });

  return filtersMap;
};

const availableFilters = generateAvailableFilters(wods);

export const useFilteredSlides = () => {
  const { slides, filters } = useSlideStore();
  return filterWods(slides, filters);
};

export const useSlideStore = create<State & Action>((set) => ({
  slides: wods,
  reset: false,
  currentIndex: 0,
  setCurrentIndex: (index) => set({ currentIndex: index }),
  setReset: (reset) => set({ reset }),
  filters: { difficulty: ['Rx'], gender: ['man', 'women'] },
  availableFilters: availableFilters,
  setFilters: (filters) => set({ filters, reset: true }),

  setSlides: (slides) => set({ slides }),
}));
