import { act, renderHook } from "@testing-library/react";
import { useGetDataFromHttp } from "./useGetDataFromHttp";

const hookMocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  throwAsyncError: vi.fn(),
  timeout: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
}));
vi.mock("../../../shared/hooks/useThrowAsyncError", () => ({
  useThrowAsyncError: () => hookMocks.throwAsyncError,
}));
vi.mock("../../../shared/utils/async", () => ({
  timeout: hookMocks.timeout,
}));
interface ResponseOptions {
  data: unknown;
  ok?: boolean;
  status?: number;
}

const createResponse = ({ data, ok = true, status = 200 }: ResponseOptions) =>
  ({
    json: vi.fn().mockResolvedValue(data),
    ok,
    status,
  }) as unknown as Response;

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
    vi.mocked(fetch).mockResolvedValue(createResponse({ data: recipe }));
    const { result } = renderHook(() => useGetDataFromHttp());

    await act(() => result.current({ url: "/recipes/42" }, transformData));

    expect(transformData).toHaveBeenCalledWith(recipe);
    expect(hookMocks.throwAsyncError).not.toHaveBeenCalled();
  });

  it("activates fallback mode when the API daily limit is reached", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createResponse({
        data: { code: 402, status: "failure" },
        ok: false,
        status: 402,
      }),
    );
    const { result } = renderHook(() => useGetDataFromHttp());

    await act(() => result.current({ url: "/recipes/42" }, vi.fn()));

    expect(
      hookMocks.dispatch.mock.calls.map(([action]) => action.type),
    ).toEqual([
      "recipe/setDailyLimitIsReached",
      "notification/showNotification",
    ]);
    expect(hookMocks.throwAsyncError).not.toHaveBeenCalled();
  });

  it("reports a safe message for failed responses", async () => {
    vi.mocked(fetch).mockResolvedValue(
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
