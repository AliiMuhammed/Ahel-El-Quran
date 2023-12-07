import { SET_READER_DATA } from "../actionTypes";

const storedReaderData = localStorage.getItem("readerData");
const initialState = {
  readerData: storedReaderData ? JSON.parse(storedReaderData) : null,
};

const readerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_READER_DATA:
      const newData = action.payload;
      localStorage.setItem("readerData", JSON.stringify(newData)); // Store in localStorage
      return {
        ...state,
        readerData: newData,
      };
    default:
      return state;
  }
};

export default readerReducer;
