import { useSyncExternalStore } from "react";
import { vi } from "vitest";

const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
};

export const useTestSearchParams = () =>
  new URLSearchParams(
    useSyncExternalStore(
      subscribe,
      () => window.location.search,
      () => "",
    ),
  );

export const mockNextHistory = () => {
  window.history.replaceState(null, "", "/");
  const pushState = window.history.pushState.bind(window.history);
  // Model Next's native-history integration; browsers alone do not notify React.
  vi.spyOn(window.history, "pushState").mockImplementation((...args) => {
    pushState(...args);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
};
