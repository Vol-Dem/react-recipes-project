import { act, renderHook } from "@testing-library/react";
import { useGetDataFromHttp } from "./useGetDataFromHttp";

const hookMocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  throwAsyncError: vi.fn(),
  timeout: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
}));
vi.mock("react-router-dom", () => ({
  useMatches: () => [{}, { pathname: "/recipes" }],
  useNavigate: () => hookMocks.navigate,
}));
vi.mock("../../../shared/hooks/useThrowAsyncError", () => ({
  useThrowAsyncError: () => hookMocks.throwAsyncError,
}));
vi.mock("../../../shared/utils/async", () => ({
  timeout: hookMocks.timeout,
}));
vi.mock("../store/recipesThunks", () => ({
  getRecipes: () => ({ type: "recipe/getRecipes" }),
}));

const createResponse = ({ data, ok = true, status = 200 }) => ({
  json: vi.fn().mockResolvedValue(data),
  ok,
  status,
});

describe("useGetDataFromHttp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    hookMocks.timeout.mockReturnValue(new Promise(() => {}));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("transforms successful response data", async () => {
    const transformData = vi.fn();
    const recipe = { id: 42, title: "Pasta" };
    fetch.mockResolvedValue(createResponse({ data: recipe }));
    const { result } = renderHook(() => useGetDataFromHttp());

    await act(() => result.current({ url: "/recipes/42" }, transformData));

    expect(transformData).toHaveBeenCalledWith(recipe);
    expect(hookMocks.throwAsyncError).not.toHaveBeenCalled();
  });

  it("activates fallback mode when the API daily limit is reached", async () => {
    fetch.mockResolvedValue(
      createResponse({
        data: { code: 402, status: "failure" },
        ok: false,
        status: 402,
      }),
    );
    const { result } = renderHook(() => useGetDataFromHttp());

    await act(() => result.current({ url: "/recipes/42" }, vi.fn()));

    expect(hookMocks.navigate).toHaveBeenCalledWith("/recipes");
    expect(hookMocks.dispatch.mock.calls.map(([action]) => action.type)).toEqual(
      [
        "recipe/setDailyLimitIsReached",
        "recipe/resetRecipes",
        "recipe/getRecipes",
        "notification/showNotification",
      ],
    );
    expect(hookMocks.throwAsyncError).not.toHaveBeenCalled();
  });

  it("reports a safe message for failed responses", async () => {
    fetch.mockResolvedValue(
      createResponse({
        data: { message: "Internal provider details", status: "failure" },
        ok: false,
        status: 500,
      }),
    );
    const { result } = renderHook(() => useGetDataFromHttp());

    await act(() => result.current({ url: "/recipes/42" }, vi.fn()));

    expect(hookMocks.throwAsyncError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unable to load recipes. Please try again",
      }),
    );
  });
});
