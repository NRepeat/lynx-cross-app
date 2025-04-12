import useProfile from '../store/profile.js';
import { useSlideStore } from '../store/workout.js';
import { LocalStorage } from '../utils/localStorage.js';

export const useFavWods = () => {
  const favWodsState = useProfile((state) => state.favWods.wodsId);
  const slides = useSlideStore((state) => state.slides);
  const setFavWods = useProfile((state) => state.setFavWods);

  const addFavWods = (favWodsID: string[]) => {
    const localFavWods = LocalStorage.get('favWods');
    const parsedLocalFavWods = localFavWods
      ? JSON.parse(localFavWods)
      : ([] as string[]);
    const newFavWods = [...parsedLocalFavWods, ...favWodsID];
    const uniqueFavWods = Array.from(new Set(newFavWods));
    setFavWods(uniqueFavWods);
    LocalStorage.set('favWods', JSON.stringify(uniqueFavWods));
  };

  const removeFavWods = (favWodsID: string[]) => {
    const updatedFavWods = favWodsState.filter((id) => !favWodsID.includes(id));
    setFavWods(updatedFavWods);
    LocalStorage.set('favWods', JSON.stringify(updatedFavWods));
  };

  const isFavWod = (wodId: string) => {
    const fav = getFavWods();
    return fav.includes(wodId);
  };

  const getFavWodsSlides = () => {
    let filteredSlides = slides.filter((slide) =>
      favWodsState.includes(slide.id),
    );
    const cachedFavWods = LocalStorage.get('favWods');
    if (cachedFavWods) {
      const parsedCachedFavWods = JSON.parse(cachedFavWods);
      const newFavWods = parsedCachedFavWods.filter(
        (id: string) => !favWodsState.includes(id),
      );
      if (newFavWods.length > 0) {
        addFavWods(newFavWods);
      }
      filteredSlides = slides.filter((slide) => newFavWods.includes(slide.id));
    }
    return filteredSlides;
  };

  const getFavWods = () => {
    if (!favWodsState || favWodsState.length === 0) {
      const localFav = LocalStorage.get('favWods');
      return localFav ? JSON.parse(localFav) : [];
    }
    return favWodsState;
  };

  return {
    getFavWodsSlides,
    addFavWods,
    removeFavWods,
    isFavWod,
    getFavWods,
  };
};
