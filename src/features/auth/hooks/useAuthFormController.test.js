import { act, renderHook } from "@testing-library/react";
import {
  ERROR_MESSAGE_INVALID_INPUT,
  MESSAGE_AGREEMENT,
} from "../../../shared/constants";
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

  it("disables client-side validation in login mode", () => {
    const { result } = renderHook(() => useAuthFormController());

    expect(result.current).toMatchObject({
      fields: {
        agreement: false,
        email: { value: "", isValid: true },
        password: { value: "", isValid: true },
      },
      mode: {
        isLogin: true,
        showErrors: false,
      },
    });
    expect(result.current.validation.email).toBeNull();
    expect(result.current.validation.password).toBeNull();
  });

  it("submits login credentials without client-side validation", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(
        { target: { value: "not-an-email" } },
      );
      result.current.actions.changePassword(
        { target: { value: "x" } },
      );
    });

    expect(result.current.fields.email.isValid).toBe(true);
    expect(result.current.fields.password.isValid).toBe(true);

    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.authRequest).toHaveBeenCalledWith(
      true,
      "not-an-email",
      "x",
    );
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/request",
      payload: [true, "not-an-email", "x"],
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
    expect(result.current.validation.email.email).toBe(true);
    expect(result.current.validation.password.minLength).toBe(8);

    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: MESSAGE_AGREEMENT,
    });
  });

  it("rejects weak signup credentials", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.switchAuthMode();
      result.current.actions.changeAgreement();
      result.current.actions.changeEmail({
        target: { value: "user@example.com" },
      });
      result.current.actions.changePassword({
        target: { value: "password" },
      });
    });
    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.authRequest).not.toHaveBeenCalled();
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: ERROR_MESSAGE_INVALID_INPUT,
    });
  });

  it("submits signup credentials that satisfy every rule", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.switchAuthMode();
      result.current.actions.changeAgreement();
      result.current.actions.changeEmail({
        target: { value: "user@example.com" },
      });
      result.current.actions.changePassword({
        target: { value: "Strong1!" },
      });
    });
    act(() => {
      result.current.actions.submitAuth({ preventDefault: vi.fn() });
    });

    expect(hookMocks.authRequest).toHaveBeenCalledWith(
      false,
      "user@example.com",
      "Strong1!",
    );
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

  it("rejects password reset requests with an invalid email", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail({
        target: { value: "invalid-email" },
      });
    });
    act(() => {
      result.current.actions.submitPasswordReset({
        preventDefault: vi.fn(),
      });
    });

    expect(hookMocks.resetUserPassword).not.toHaveBeenCalled();
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: ERROR_MESSAGE_INVALID_INPUT,
    });
  });
});
