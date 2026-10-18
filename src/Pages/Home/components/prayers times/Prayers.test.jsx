import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import locationReducer from "../../../../Redux/Reducers/location-reducer";
import Prayers from "./Prayers";

jest.mock("axios", () => ({ get: jest.fn() }));

test("denied geolocation stops loading and allows a retry", async () => {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: jest.fn((success, failure) => failure({ message: "User denied Geolocation" })) },
  });
  const store = createStore(combineReducers({ location: locationReducer }), applyMiddleware(thunk));
  render(<Provider store={store}><Prayers /></Provider>);
  fireEvent.click(screen.getByRole("button", { name: "الحصول علي موقعك" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/الموقع/));
  expect(screen.getByRole("button", { name: "الحصول علي موقعك" })).toBeTruthy();
});
