import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import readerReducer from "../../Redux/Reducers/reader-reducer";
import Reader from "./Reader";

jest.mock("axios", () => ({ get: jest.fn() }));
const reader = {
  id: 1,
  name: "إبراهيم الأخضر",
  moshaf: [{ id: 1, name: "حفص", server: "https://example.com/", surah_list: "1" }],
};

function openReader(name, storedReader = {}) {
  const store = createStore(combineReducers({ reader: readerReducer }), { reader: storedReader });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/reader/${name}`]}>
        <Routes><Route path="/reader/:readerName" element={<Reader />} /></Routes>
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => { localStorage.clear(); jest.clearAllMocks(); });

test("loads a reader from a cold direct URL without stored reader data", async () => {
  axios.get.mockResolvedValue({ data: { reciters: [reader] } });
  openReader(reader.name);
  expect(await screen.findByText("١ - الفاتحة")).toBeTruthy();
  expect(JSON.parse(localStorage.getItem("readerData")).name).toBe(reader.name);
});

test("uses the URL reader instead of a previously selected reader", async () => {
  localStorage.setItem("recentReadersData", JSON.stringify([reader]));
  openReader(reader.name, { ...reader, name: "قارئ آخر" });
  expect(await screen.findByText(`القارئ ${reader.name}`)).toBeTruthy();
  expect(axios.get).not.toHaveBeenCalled();
});

test("shows an Arabic error if the reader provider fails", async () => {
  axios.get.mockRejectedValue(new Error("offline"));
  openReader(reader.name);
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.queryByText("١ - الفاتحة")).toBeNull();
});
