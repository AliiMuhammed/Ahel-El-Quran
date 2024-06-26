export const SET_READER_DATA = "SET_READER_DATA";
export const REQUEST_LOCATION = "REQUEST_LOCATION";
export const RECEIVE_LOCATION = "RECEIVE_LOCATION";
export const LOCATION_ERROR = "LOCATION_ERROR";
export const SET_LOCATION = "SET_LOCATION"; // New action type for setting location from localStorage
export const ADD_FAVORITE_SURAH = "ADD_FAVORITE_SURAH";
export const REMOVE_FAVORITE_SURAH = "REMOVE_FAVORITE_SURAH";

export const addFavoriteSurah = (surahInfo) => ({
  type: ADD_FAVORITE_SURAH,
  payload: surahInfo,
});

export const removeFavoriteSurah = (surahKey) => ({
  type: REMOVE_FAVORITE_SURAH,
  payload: surahKey,
});
