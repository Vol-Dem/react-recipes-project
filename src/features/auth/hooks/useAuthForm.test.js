import { act, renderHook } from "@testing-library/react";
import { MESSAGE_AGREEMENT } from "../../../shared/constants";
import { useAuthForm } from "./useAuthForm";

const hookMocks = vi.hoisted(() => ({
  authRequest: vi.fn((...payload) => ({ type: "auth/request", payload })),
  authWithGoogle: vi.fn(() => ({ type: "auth/google" })),
  dispatch: vi.fn(),
  resetUserPassword: vi.fn((payload) => ({
    type: "auth/resetPassword",
    payload,
  })),
  state: {
    auth: {
      errorMessage: "",
      successMessage: "",
      isLoading: false,
      showResetPassword: false,
    },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
  useSelector: (selector) => selector(hookMocks.state),
}));
vi.mock("../store/authThunks", () => ({
  authRequest: hookMocks.authRequest,
  authWithGoogle: hookMocks.authWithGoogle,
  resetUserPassword: hookMocks.resetUserPassword,
}));

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("provides the initial login state and stable validation", () => {
    const { result } = renderHook(() => useAuthForm());

    expect(result.current).toMatchObject({
      agreement: false,
      email: { value: "", isValid: false },
      isLogin: true,
      password: { value: "", isValid: false },
      showErrors: false,
    });
    expect(result.current.emailValidation.disableErrorOnBlur).toBe(true);
    expect(result.current.passwordValidation.disableErrorOnBlur).toBe(true);
  });

  it("submits valid credentials through the auth thunk", () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.changeEmail(
        { target: { value: "user@example.com" } },
        true,
      );
      result.current.changePassword(
        { target: { value: "password" } },
        true,
      );
    });
    act(() => {
      result.current.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.authRequest).toHaveBeenCalledWith(
      true,
      "user@example.com",
      "password",
    );
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/request",
      payload: [true, "user@example.com", "password"],
    });
  });

  it("resets fields when switching mode and requires signup agreement", () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.changeEmail(
        { target: { value: "user@example.com" } },
        true,
      );
      result.current.switchAuthMode();
    });

    expect(result.current.isLogin).toBe(false);
    expect(result.current.email).toEqual({ value: "", isValid: false });
    expect(result.current.emailValidation.disableErrorOnBlur).toBe(false);

    act(() => {
      result.current.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: MESSAGE_AGREEMENT,
    });
  });

  it("submits password reset requests for the current email", () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.changeEmail(
        { target: { value: "user@example.com" } },
        true,
      );
    });
    act(() => {
      result.current.submitPasswordReset({ preventDefault: vi.fn() });
    });

    expect(hookMocks.resetUserPassword).toHaveBeenCalledWith(
      "user@example.com",
    );
  });
});
