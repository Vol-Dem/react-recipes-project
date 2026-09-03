import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import authSlice, {
  authActions,
} from "../../../../features/auth/store/authSlice";
import UserNavigation from "./UserNavigation";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("UserNavigation", () => {
  it("opens from its button and returns focus after Escape", async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: { auth: authSlice.reducer } });
    store.dispatch(
      authActions.login({
        idToken: "token",
        userName: "Jamie",
        email: "jamie@example.com",
        emailVerified: true,
        uid: "user-id",
      }),
    );

    render(
      <Provider store={store}>
        <UserNavigation />
      </Provider>,
    );

    const trigger = screen.getByRole("button", { name: "Jamie" });
    const menu = document.getElementById("user-navigation-menu");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-hidden", "true");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveAttribute("aria-hidden", "false");

    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
