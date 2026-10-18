import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Live from "./Live";
import { loadYouTube } from "./youtubePlayer";

jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("./youtubePlayer", () => ({ loadYouTube: jest.fn() }), { virtual: true });
let players;
let now;
const response = (id = "makkahlive1") => ({ data: { channels: {
  makkah: { videoIds: [id], state: "live" },
  madinah: { videoIds: ["madinahliv1"], state: "live" },
} } });
function open() { return render(<MemoryRouter><Live /></MemoryRouter>); }
beforeEach(() => {
 players = []; now = 2000000000000;
 jest.spyOn(Date, "now").mockImplementation(() => now);
 axios.get.mockReset(); loadYouTube.mockReset();
 loadYouTube.mockResolvedValue({ Player: function (element, options) {
   this.destroy = jest.fn(); players.push({ ...options, player: this });
 } });
});
afterEach(() => jest.restoreAllMocks());

test("hides app fallback actions when both broadcasts are available", async () => {
 axios.get.mockResolvedValue(response()); open();
 await waitFor(() => expect(players.length).toBe(2));
 expect(players.map(p => p.videoId)).toEqual(["makkahlive1", "madinahliv1"]);
 await act(async () => players.forEach(p => p.events.onReady({ target: { getIframe: () => document.createElement("iframe") } })));
 expect(screen.queryByRole("button", { name: "إعادة المحاولة" })).toBeNull();
 expect(screen.queryByRole("link", { name: /الموقع الرسمي|YouTube/ })).toBeNull();
});

test("replaces a terminated broadcast and destroys the previous player", async () => {
 axios.get.mockResolvedValueOnce(response()).mockResolvedValue(response("newmakkah01")); open();
 await waitFor(() => expect(players.length).toBe(2)); const first = players[0];
 now += 31000;
 await act(async () => first.events.onStateChange({ data: 0 }));
 await waitFor(() => expect(players.some(p => p.videoId === "newmakkah01")).toBe(true));
 expect(first.player.destroy).toHaveBeenCalled();
});

test("does not replay an ended cached video while waiting for discovery", async () => {
 axios.get.mockResolvedValue(response()); open(); await waitFor(() => expect(players.length).toBe(2));
 now += 31000; await act(async () => players[0].events.onStateChange({ data: 0 }));
 await waitFor(() => expect(screen.getByText(/انتهى البث/)).toBeTruthy());
 fireEvent.click(screen.getAllByRole("button", { name: "إعادة المحاولة" })[0]);
 expect(players.filter(p => p.videoId === "makkahlive1")).toHaveLength(1);
});

test("offline or unconfigured resolver keeps Arabic retry and official watch links", async () => {
 axios.get.mockRejectedValue(new Error("unavailable")); open();
 await waitFor(() => expect(screen.getAllByText(/تعذر/).length).toBeGreaterThan(0));
 expect(screen.getAllByRole("button", { name: "إعادة المحاولة" })).toHaveLength(2);
 expect(screen.getAllByRole("link", { name: /الموقع الرسمي/ })).toHaveLength(2);
});


test("a late player-ready event after leaving the page is ignored", async () => {
 axios.get.mockResolvedValue(response()); const view = open();
 await waitFor(() => expect(players.length).toBe(2)); const first = players[0];
 view.unmount();
 expect(() => first.events.onReady({ target: {} })).not.toThrow();
 expect(first.player.destroy).toHaveBeenCalled();
});


test("a playback error can be retried and late ready events are ignored", async () => {
 axios.get.mockResolvedValue(response()); open();
 await waitFor(() => expect(players.length).toBe(2)); const first = players[0];
 await act(async () => first.events.onError({ data: 5 }));
 expect(() => first.events.onReady({ target: {} })).not.toThrow();
 expect(screen.getByText(/تعذر تشغيل البث/)).toBeTruthy();
 fireEvent.click(screen.getAllByRole("button", { name: "إعادة المحاولة" })[0]);
 await waitFor(() => expect(players.filter(p => p.videoId === "makkahlive1")).toHaveLength(2));
});


test("shows fallback only for the failed channel and hides it again after recovery", async () => {
 axios.get.mockResolvedValue(response()); open();
 await waitFor(() => expect(players.length).toBe(2));
 await act(async () => players.forEach(p => p.events.onReady({ target: { getIframe: () => document.createElement("iframe") } })));
 await act(async () => players[0].events.onError({ data: 5 }));
 expect(screen.getAllByRole("button", { name: "إعادة المحاولة" })).toHaveLength(1);
 expect(screen.getByRole("link", { name: /الموقع الرسمي/ }).href).toBe("https://aloula.sba.sa/live/quran");
 expect(screen.getAllByRole("link", { name: /YouTube/ })).toHaveLength(1);
 fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));
 await waitFor(() => expect(players).toHaveLength(3));
 await act(async () => players[2].events.onReady({ target: { getIframe: () => document.createElement("iframe") } }));
 expect(screen.queryByRole("button", { name: "إعادة المحاولة" })).toBeNull();
 expect(screen.queryByRole("link", { name: /الموقع الرسمي|YouTube/ })).toBeNull();
});

test("initial loading shows a status without premature error actions", async () => {
 axios.get.mockReturnValue(new Promise(() => {})); open();
 expect(screen.getAllByRole("status")).toHaveLength(2);
 expect(screen.queryByRole("button", { name: "إعادة المحاولة" })).toBeNull();
 expect(screen.queryByRole("link", { name: /الموقع الرسمي|YouTube/ })).toBeNull();
});
