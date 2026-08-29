import { act, renderHook } from "@testing-library/react";
import { MESSAGE_AGREEMENT } from "../../../shared/constants";
import { useAuthFormController } from "./useAuthFormController";

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

describe("useAuthFormController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("provides the initial login state and stable validation", () => {
    const { result } = renderHook(() => useAuthFormController());

    expect(result.current).toMatchObject({
      fields: {
        agreement: false,
        email: { value: "", isValid: false },
        password: { value: "", isValid: false },
      },
      mode: {
        isLogin: true,
        showErrors: false,
      },
    });
    expect(result.current.validation.email.disableErrorOnBlur).toBe(true);
    expect(result.current.validation.password.disableErrorOnBlur).toBe(true);
  });

  it("submits valid credentials through the auth thunk", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(
        { target: { value: "user@example.com" } },
      );
      result.current.actions.changePassword(
        { target: { value: "password" } },
      );
    });

    expect(result.current.fields.email.isValid).toBe(true);
    expect(result.current.fields.password.isValid).toBe(true);

    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
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
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(
        { target: { value: "user@example.com" } },
      );
      result.current.actions.switchAuthMode();
    });

    expect(result.current.mode.isLogin).toBe(false);
    expect(result.current.fields.email).toEqual({
      value: "",
      isValid: false,
    });
    expect(result.current.validation.email.disableErrorOnBlur).toBe(false);

    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: MESSAGE_AGREEMENT,
    });
  });

  it("submits password reset requests for the current email", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(
        { target: { value: "user@example.com" } },
      );
    });
    act(() => {
      result.current.actions.submitPasswordReset({
        preventDefault: vi.fn(),
      });
    });

    expect(hookMocks.resetUserPassword).toHaveBeenCalledWith(
      "user@example.com",
    );
  });
});
