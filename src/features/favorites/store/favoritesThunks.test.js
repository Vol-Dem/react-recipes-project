import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "../../notifications/store/notificationSlice";
import {
  FAVORITES_LOAD_ERROR_NOTIFICATION,
  FAVORITES_UPDATE_ERROR_NOTIFICATION,
} from "../constants/messages";
import favoritesSlice from "./favoritesSlice";
import { loadFavorites, toggleFavorite } from "./favoritesThunks";

const apiMocks = vi.hoisted(() => ({
  fetchFavoriteIds: vi.fn(),
  updateFavorite: vi.fn(),
}));

vi.mock("../api/favoritesApi", () => apiMocks);

const createStore = (favoriteIds = []) =>
  configureStore({
    preloadedState: {
      auth: { user: { uid: "user-id" } },
      fav: { favList: favoriteIds, pendingIds: [] },
    },
    reducer: {
      auth: (state = {}) => state,
      fav: favoritesSlice.reducer,
      notification: notificationSlice.reducer,
    },
  });

describe("favorites thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("optimistically adds and persists a favorite", async () => {
    const store = createStore();
    apiMocks.updateFavorite.mockResolvedValue();

    await store.dispatch(toggleFavorite(42));

    expect(store.getState().fav.favList).toEqual([42]);
    expect(apiMocks.updateFavorite).toHaveBeenCalledWith("user-id", 42, true);
    expect(store.getState().fav.pendingIds).toEqual([]);
  });

  it("ignores a duplicate update while the same recipe is pending", async () => {
    const store = createStore();
    let finishUpdate;
    apiMocks.updateFavorite.mockReturnValue(
      new Promise((resolve) => {
        finishUpdate = resolve;
      }),
    );

    const firstUpdate = store.dispatch(toggleFavorite(42));
    await store.dispatch(toggleFavorite(42));

    expect(apiMocks.updateFavorite).toHaveBeenCalledOnce();
    expect(store.getState().fav.favList).toEqual([42]);

    finishUpdate();
    await firstUpdate;
  });

  it("rolls back a failed optimistic update and notifies the user", async () => {
    const store = createStore();
    apiMocks.updateFavorite.mockRejectedValue(new Error("Firestore error"));

    await store.dispatch(toggleFavorite(42));

    expect(store.getState().fav.favList).toEqual([]);
    expect(store.getState().notification).toMatchObject({
      ...FAVORITES_UPDATE_ERROR_NOTIFICATION,
      isShown: true,
    });
  });

  it("restores a removed favorite when persistence fails", async () => {
    const store = createStore([42]);
    apiMocks.updateFavorite.mockRejectedValue(new Error("Firestore error"));

    await store.dispatch(toggleFavorite(42));

    expect(store.getState().fav.favList).toEqual([42]);
    expect(apiMocks.updateFavorite).toHaveBeenCalledWith("user-id", 42, false);
  });

  it("loads favorites from persistence", async () => {
    const store = createStore();
    apiMocks.fetchFavoriteIds.mockResolvedValue([10, 20]);

    await store.dispatch(loadFavorites("user-id"));

    expect(store.getState().fav.favList).toEqual([10, 20]);
  });

  it("notifies the user when favorites cannot be loaded", async () => {
    const store = createStore();
    apiMocks.fetchFavoriteIds.mockRejectedValue(new Error("Firestore error"));

    await store.dispatch(loadFavorites("user-id"));

    expect(store.getState().notification).toMatchObject({
      ...FAVORITES_LOAD_ERROR_NOTIFICATION,
      isShown: true,
    });
  });
});
