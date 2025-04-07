import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WodType } from './workout.js';

type State = {
  workoutIsStarted: boolean;
  navigationFunction: () => void;
  currentWorkout: WodType | null;
};
type Action = {
  setCurrentWorkout: (currentWorkout: WodType | null) => void;
  setWorkoutIsStarted: (workoutIsStarted: boolean) => void;
  setNavigationFunction: (navigationFunction: () => void) => void;
};

export const useGlobal = create<State & Action>()(
  persist(
    (set) => ({
      currentWorkout: null,
      setCurrentWorkout: (currentWorkout) => set({ currentWorkout }),
      workoutIsStarted: false,
      navigationFunction: () => {},
      setWorkoutIsStarted: (workoutIsStarted) => set({ workoutIsStarted }),
      setNavigationFunction: (navigationFunction) =>
        set({ navigationFunction }),
    }),
    {
      name: 'global-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
