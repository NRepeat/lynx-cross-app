import { create } from 'zustand';

type Profile = {
  id: string;
  nickname?: string;
  name?: string;
  email?: string;
};

type FavWods = {
  profileId: string;
  wodsId: string[];
};

type Logs = {
  profileId: string;
  wodsId: string[];
};

interface Actions {
  setProfile: (profile: Profile) => void;
  setFavWods: (wods: string[]) => void;
  setLogs: (wods: string[]) => void;
}

interface State {
  profile: Profile;
  favWods: FavWods;
  logs: Logs;
}

const useProfile = create<State & Actions>((set) => ({
  profile: {
    id: '',
    nickname: '',
    name: '',
    email: '',
  },
  favWods: {
    profileId: '',
    wodsId: [],
  },
  logs: {
    profileId: '',
    wodsId: [],
  },
  setProfile: (profile) => set({ profile }),
  setFavWods: (wods) =>
    set((state) => ({ favWods: { ...state.favWods, wods } })),
  setLogs: (wods) => set((state) => ({ logs: { ...state.logs, wods } })),
}));
export default useProfile;
