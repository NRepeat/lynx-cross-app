import { create } from 'zustand';

type State = {
  workoutIsStarted: boolean;
  navigationFunction: () => void;
};
type Action = {
  setWorkoutIsStarted: (workoutIsStarted: boolean) => void;
  setNavigationFunction: (navigationFunction: () => void) => void;
};

export const useGlobal = create<State & Action>((set) => ({
  workoutIsStarted: false,
  navigationFunction: () => {},
  setWorkoutIsStarted: (workoutIsStarted) => set({ workoutIsStarted }),
  setNavigationFunction: (navigationFunction) => set({ navigationFunction }),
  // Define your state and actions here
  // Example:
  // count: 0,
  // increment: () => set((state) => ({ count: state.count + 1 })),
}));
