import { SET_READER_DATA } from "../actionTypes";

export const setReader = (reader) => {
  return {
    type: SET_READER_DATA,
    payload: reader,
  };
};
