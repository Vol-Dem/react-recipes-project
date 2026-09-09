import { fireEvent, render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { initAuth } from "../features/auth/store/authThunks";
import { authActions } from "../features/auth/store/authSlice";
import { selectAuthFormIsOpen } from "../features/auth/store/authSelectors";
import AppProviders from "./providers";
import type { AppDispatch } from "./store";
import type { QueryClient } from "@tanstack/react-query";

const { unsubscribe } = vi.hoisted(() => ({ unsubscribe: vi.fn() }));

vi.mock("../features/auth/store/authThunks", () => ({
  initAuth: vi.fn(() => () => unsubscribe),
}));

const AuthStateProbe = ({ name }: { name: string }) => {
  const isOpen = useSelector(selectAuthFormIsOpen);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <button
      aria-label={name}
      onClick={() => dispatch(authActions.openAuthForm())}
    >
      {isOpen ? "Open" : "Closed"}
    </button>
  );
};

describe("AppProviders store lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isolates state between provider instances", () => {
    render(
      <>
        <AppProviders>
          <AuthStateProbe name="First" />
        </AppProviders>
        <AppProviders>
          <AuthStateProbe name="Second" />
        </AppProviders>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "First" }));

    expect(screen.getByRole("button", { name: "First" })).toHaveTextContent(
      "Open",
    );
    expect(screen.getByRole("button", { name: "Second" })).toHaveTextContent(
      "Closed",
    );
  });

  it("preserves state and the auth subscription when children change", () => {
    const { rerender, unmount } = render(
      <AppProviders>
        <AuthStateProbe name="Before navigation" />
      </AppProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Before navigation" }));

    rerender(
      <AppProviders>
        <AuthStateProbe name="After navigation" />
      </AppProviders>,
    );

    expect(
      screen.getByRole("button", { name: "After navigation" }),
    ).toHaveTextContent("Open");
    expect(initAuth).toHaveBeenCalledOnce();
    expect(unsubscribe).not.toHaveBeenCalled();

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("starts with fresh state after the provider unmounts", () => {
    const { unmount } = render(
      <AppProviders>
        <AuthStateProbe name="First mount" />
      </AppProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "First mount" }));
    unmount();

    render(
      <AppProviders>
        <AuthStateProbe name="New mount" />
      </AppProviders>,
    );

    expect(screen.getByRole("button", { name: "New mount" })).toHaveTextContent(
      "Closed",
    );
  });
});

describe("AppProviders query cache lifecycle", () => {
  it("preserves its client across navigation and isolates separate providers", () => {
    const clients = new Map<string, QueryClient>();
    const Probe = ({ name }: { name: string }) => {
      const client = useQueryClient();
      return <button onClick={() => clients.set(name, client)}>{name}</button>;
    };
    const { rerender } = render(
      <AppProviders>
        <Probe name="Before" />
      </AppProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Before" }));
    clients.get("Before")!.setQueryData(["test"], "cached recipe");
    rerender(
      <AppProviders>
        <Probe name="After" />
      </AppProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "After" }));
    expect(clients.get("After")).toBe(clients.get("Before"));
    expect(clients.get("After")!.getQueryData(["test"])).toBe("cached recipe");

    render(
      <AppProviders>
        <Probe name="Separate" />
      </AppProviders>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Separate" }));
    expect(clients.get("Separate")).not.toBe(clients.get("Before"));
    expect(clients.get("Separate")!.getQueryData(["test"])).toBeUndefined();
    clients.forEach((client) => client.clear());
  });
});
