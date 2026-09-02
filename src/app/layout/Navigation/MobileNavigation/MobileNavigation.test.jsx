import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import authSlice from "../../../../features/auth/store/authSlice";
import MobileNavigation from "./MobileNavigation";

describe("MobileNavigation", () => {
  it("only exposes links while open and returns focus on Escape", async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: { auth: authSlice.reducer } });

    render(
      <Provider store={store}>
        <MobileNavigation />
      </Provider>,
    );

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });
});
