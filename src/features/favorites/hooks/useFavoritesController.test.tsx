import { StrictMode, type PropsWithChildren } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeStore } from "../../../app/store";
import { makeQueryClient } from "../../../app/queryClient";
import { authActions } from "../../auth/store/authSlice";
import { fetchFavoriteIds, updateFavorite } from "../api/favoritesApi";
import { favoriteKeys } from "../constants/queryKeys";
import { useFavoritesController } from "./useFavoritesController";

vi.mock("../api/favoritesApi", () => ({
  fetchFavoriteIds: vi.fn(),
  updateFavorite: vi.fn(),
}));
const user = (uid = "user-a") => ({
  uid,
  email: "a@example.com",
  userName: "A",
  idToken: "token",
  emailVerified: true,
});
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

describe("favorites query controller", () => {
  const clients: QueryClient[] = [];
  let serverIds: number[];
  const setup = (authenticated = true, strict = false) => {
    const store = makeStore();
    if (authenticated) store.dispatch(authActions.login(user()));
    const client = makeQueryClient();
    clients.push(client);
    const wrapper = ({ children }: PropsWithChildren) => {
      const content = (
        <Provider store={store}>
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </Provider>
      );
      return strict ? <StrictMode>{content}</StrictMode> : content;
    };
    return { store, client, wrapper };
  };
  beforeEach(() => {
    vi.resetAllMocks();
    serverIds = [1];
    vi.mocked(fetchFavoriteIds).mockImplementation(async () => [...serverIds]);
    vi.mocked(updateFavorite).mockImplementation(async (_uid, id, add) => {
      serverIds = add
        ? [...serverIds, id]
        : serverIds.filter((value) => value !== id);
    });
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
  });

  it("waits for authentication before loading IDs", async () => {
    const { store, wrapper } = setup(false);
    const { result } = renderHook(useFavoritesController, { wrapper });
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(fetchFavoriteIds).not.toHaveBeenCalled();
    act(() => store.dispatch(authActions.login(user())));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    expect(fetchFavoriteIds).toHaveBeenCalledExactlyOnceWith("user-a");
    expect(store.getState()).not.toHaveProperty("fav");
  });

  it("does not write before the initial favorites are known", async () => {
    const read = deferred<number[]>();
    vi.mocked(fetchFavoriteIds).mockReturnValue(read.promise);
    const { wrapper } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    act(() => result.current.toggleFavorite(1));
    expect(updateFavorite).not.toHaveBeenCalled();
    await act(async () => read.resolve([1]));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("optimistically updates, ignores duplicate clicks, then reconciles once", async () => {
    const write = deferred<void>();
    vi.mocked(updateFavorite).mockReturnValue(write.promise);
    const { wrapper } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => {
      result.current.toggleFavorite(2);
      result.current.toggleFavorite(2);
    });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1, 2]));
    expect(updateFavorite).toHaveBeenCalledExactlyOnceWith("user-a", 2, true);
    expect(result.current.pendingIds).toContain(2);
    serverIds = [1, 2];
    await act(async () => write.resolve());
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
    expect(fetchFavoriteIds).toHaveBeenCalledTimes(2);
    expect(result.current.favoriteIds).toEqual([1, 2]);
  });

  it("persists removal and clears the last favorite", async () => {
    const { wrapper } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => result.current.toggleFavorite(1));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([]));
    expect(updateFavorite).toHaveBeenCalledWith("user-a", 1, false);
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
  });

  it("rolls back only the failed recipe while a different write is pending", async () => {
    const failed = deferred<void>();
    const successful = deferred<void>();
    vi.mocked(updateFavorite).mockImplementation((_uid, id) =>
      id === 1 ? failed.promise : successful.promise,
    );
    const { wrapper, store } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
    });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([2]));
    await act(async () => failed.reject(new Error("Failed write")));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([2, 1]));
    expect(fetchFavoriteIds).toHaveBeenCalledOnce();
    expect(store.getState().notification.title).toBe(
      "Favorites couldn't be updated",
    );
    serverIds = [1, 2];
    await act(async () => successful.resolve());
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
    expect(result.current.favoriteIds).toEqual([1, 2]);
    expect(fetchFavoriteIds).toHaveBeenCalledTimes(2);
  });

  it("cancels an old read so it cannot overwrite an optimistic update", async () => {
    const oldRead = deferred<number[]>();
    const write = deferred<void>();
    const { wrapper, client } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    vi.mocked(fetchFavoriteIds).mockReturnValueOnce(oldRead.promise);
    act(() => {
      void client.invalidateQueries({ queryKey: favoriteKeys.ids("user-a") });
    });
    vi.mocked(updateFavorite).mockReturnValue(write.promise);
    act(() => result.current.toggleFavorite(2));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1, 2]));
    await act(async () => oldRead.resolve([1]));
    expect(result.current.favoriteIds).toEqual([1, 2]);
    serverIds = [1, 2];
    await act(async () => write.resolve());
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
  });

  it("clears account caches on logout and ignores a late read", async () => {
    const read = deferred<number[]>();
    vi.mocked(fetchFavoriteIds).mockReturnValueOnce(read.promise);
    const { wrapper, client, store } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    client.setQueryData(["favorites", "user-a", "recipes"], [1]);
    act(() => store.dispatch(authActions.logout()));
    expect(result.current.favoriteIds).toEqual([]);
    await act(async () => read.resolve([1]));
    expect(
      client
        .getQueryCache()
        .findAll({ queryKey: favoriteKeys.account("user-a") }),
    ).toEqual([]);
    expect(result.current.favoriteIds).toEqual([]);
  });

  it("does not roll back or notify a new account after an old mutation fails", async () => {
    const write = deferred<void>();
    vi.mocked(updateFavorite).mockReturnValue(write.promise);
    const { wrapper, store, client } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => result.current.toggleFavorite(1));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([]));
    serverIds = [9];
    act(() => store.dispatch(authActions.login(user("user-b"))));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([9]));
    await act(async () => write.reject(new Error("Old failure")));
    expect(result.current.favoriteIds).toEqual([9]);
    expect(store.getState().notification.isShown).toBe(false);
    expect(client.getQueryData(favoriteKeys.ids("user-a"))).toBeUndefined();
  });

  it("reports a load failure and retries a later favorite click without writing unknown state", async () => {
    vi.mocked(fetchFavoriteIds).mockRejectedValueOnce(
      new Error("Firestore internal details"),
    );
    const { wrapper, store } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.errorMessage).toBeTruthy());
    expect(result.current.errorMessage).not.toContain("Firestore");
    expect(store.getState().notification.title).toBe(
      "Favorites couldn't be loaded",
    );
    act(() => result.current.toggleFavorite(1));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    expect(updateFavorite).not.toHaveBeenCalled();
    expect(result.current.errorMessage).toBe("");
  });

  it("isolates a new session of the same account from an older pending write", async () => {
    const oldWrite = deferred<void>();
    const newWrite = deferred<void>();
    vi.mocked(updateFavorite)
      .mockReturnValueOnce(oldWrite.promise)
      .mockReturnValueOnce(newWrite.promise);
    const { wrapper, store } = setup();
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => result.current.toggleFavorite(1));
    await waitFor(() => expect(updateFavorite).toHaveBeenCalledOnce());
    act(() => store.dispatch(authActions.logout()));
    act(() => store.dispatch(authActions.login(user())));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => result.current.toggleFavorite(1));
    await waitFor(() => expect(updateFavorite).toHaveBeenCalledTimes(2));
    await act(async () => oldWrite.reject(new Error("Old session failure")));
    expect(result.current.favoriteIds).toEqual([]);
    expect(store.getState().notification.isShown).toBe(false);
    serverIds = [];
    await act(async () => newWrite.resolve());
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
    expect(result.current.favoriteIds).toEqual([]);
    expect(fetchFavoriteIds).toHaveBeenCalledTimes(3);
  });

  it("keeps the query usable after Strict Mode effect replay", async () => {
    const { wrapper } = setup(true, true);
    const { result } = renderHook(useFavoritesController, { wrapper });
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1]));
    act(() => result.current.toggleFavorite(2));
    await waitFor(() => expect(result.current.favoriteIds).toEqual([1, 2]));
    await waitFor(() => expect(result.current.pendingIds).toEqual([]));
  });
});
