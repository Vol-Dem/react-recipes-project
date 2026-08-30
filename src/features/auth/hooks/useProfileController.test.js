import { act, renderHook } from "@testing-library/react";
import { useProfileController } from "./useProfileController";

const hookMocks = vi.hoisted(() => ({
  changeUserName: vi.fn((payload) => ({
    type: "auth/changeUserName",
    payload,
  })),
  changeUserPassword: vi.fn((payload) => ({
    type: "auth/changeUserPassword",
    payload,
  })),
  dispatch: vi.fn(),
  state: {
    auth: {
      errorMessage: "",
      user: {
        email: "user@example.com",
        userName: "Test User",
      },
    },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => hookMocks.dispatch,
  useSelector: (selector) => selector(hookMocks.state),
}));
vi.mock("../store/authThunks", () => ({
  changeUserName: hookMocks.changeUserName,
  changeUserPassword: hookMocks.changeUserPassword,
}));

const createFormEvent = (name, value) => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.name = name;
  input.value = value;
  form.append(input);

  return {
    currentTarget: form,
    preventDefault: vi.fn(),
  };
};

describe("useProfileController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides profile data and inactive edit modes", () => {
    const { result } = renderHook(() => useProfileController());

    expect(result.current).toMatchObject({
      editing: { name: false, password: false },
      status: { errorMessage: "" },
      user: {
        email: "user@example.com",
        userName: "Test User",
      },
    });
  });

  it("toggles profile field edit modes independently", () => {
    const { result } = renderHook(() => useProfileController());

    act(() => {
      result.current.actions.toggleNameEditing();
    });
    expect(result.current.editing).toEqual({
      name: true,
      password: false,
    });

    act(() => {
      result.current.actions.togglePasswordEditing();
    });
    expect(result.current.editing).toEqual({
      name: true,
      password: true,
    });
  });

  it("submits the updated name and closes its edit mode", () => {
    const { result } = renderHook(() => useProfileController());
    const event = createFormEvent("name", "Updated User");

    act(() => {
      result.current.actions.toggleNameEditing();
      result.current.actions.submitName(event);
    });

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(hookMocks.changeUserName).toHaveBeenCalledWith("Updated User");
    expect(result.current.editing.name).toBe(false);
  });

  it("submits the updated password", () => {
    const { result } = renderHook(() => useProfileController());
    const event = createFormEvent("pass", "new-password");

    act(() => {
      result.current.actions.submitPassword(event);
    });

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(hookMocks.changeUserPassword).toHaveBeenCalledWith("new-password");
  });
});
