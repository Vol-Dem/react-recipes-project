import { act, renderHook } from "@testing-library/react";
import {
  ERROR_MESSAGE_INVALID_INPUT,
  MESSAGE_AGREEMENT,
} from "../../../shared/constants";
import { useAuthFormController } from "./useAuthFormController";
import type { ChangeEvent, FormEvent } from "react";

const hookMocks = vi.hoisted(() => ({
  authRequest: vi.fn((...payload: unknown[]) => ({
    type: "auth/request",
    payload,
  })),
  authWithGoogle: vi.fn(() => ({ type: "auth/google" })),
  dispatch: vi.fn(),
  resetUserPassword: vi.fn((payload: string) => ({
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
  useSelector: <Result>(selector: (state: typeof hookMocks.state) => Result) =>
    selector(hookMocks.state),
}));
vi.mock("../store/authThunks", () => ({
  authRequest: hookMocks.authRequest,
  authWithGoogle: hookMocks.authWithGoogle,
  resetUserPassword: hookMocks.resetUserPassword,
}));

const createChangeEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const createSubmitEvent = () =>
  ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

describe("useAuthFormController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("requires login values without applying format or strength rules", () => {
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
    expect(result.current.validation.email).toEqual({ required: true });
    expect(result.current.validation.password).toEqual({ required: true });
  });

  it("submits nonempty login credentials without stricter checks", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(createChangeEvent("not-an-email"));
      result.current.actions.changePassword(createChangeEvent("x"));
    });

    expect(result.current.fields.email.isValid).toBe(true);
    expect(result.current.fields.password.isValid).toBe(true);

    act(() => {
      result.current.actions.submitAuth(createSubmitEvent());
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

  it("rejects empty login credentials", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.submitAuth(createSubmitEvent());
    });

    expect(result.current.mode.showErrors).toBe(true);
    expect(hookMocks.authRequest).not.toHaveBeenCalled();
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: ERROR_MESSAGE_INVALID_INPUT,
    });
  });

  it("resets fields when switching mode and requires signup agreement", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(createChangeEvent("user@example.com"));
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
      result.current.actions.submitAuth(createSubmitEvent());
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
      result.current.actions.changeEmail(createChangeEvent("user@example.com"));
      result.current.actions.changePassword(createChangeEvent("password"));
    });
    act(() => {
      result.current.actions.submitAuth(createSubmitEvent());
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
      result.current.actions.changeEmail(createChangeEvent("user@example.com"));
      result.current.actions.changePassword(createChangeEvent("Strong1!"));
    });
    act(() => {
      result.current.actions.submitAuth(createSubmitEvent());
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
      result.current.actions.changeEmail(createChangeEvent("user@example.com"));
    });
    act(() => {
      result.current.actions.submitPasswordReset(createSubmitEvent());
    });

    expect(hookMocks.resetUserPassword).toHaveBeenCalledWith(
      "user@example.com",
    );
  });

  it("rejects password reset requests with an invalid email", () => {
    const { result } = renderHook(() => useAuthFormController());

    act(() => {
      result.current.actions.changeEmail(createChangeEvent("invalid-email"));
    });
    act(() => {
      result.current.actions.submitPasswordReset(createSubmitEvent());
    });

    expect(hookMocks.resetUserPassword).not.toHaveBeenCalled();
    expect(hookMocks.dispatch).toHaveBeenCalledWith({
      type: "auth/setErrorMessage",
      payload: ERROR_MESSAGE_INVALID_INPUT,
    });
  });
});
