import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import authSlice from "../../../auth/store/authSlice";
import favoritesSlice from "../../../favorites/store/favoritesSlice";
import Info from "./Info";

describe("Info", () => {
  it("exposes the favorite action as a keyboard-operable toggle button", async () => {
    const user = userEvent.setup();
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
        fav: favoritesSlice.reducer,
      },
    });

    render(
      <Provider store={store}>
        <Info readyInMinutes={30} servings={2} recipeId="42" />
      </Provider>,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Add to favorites",
    });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

    favoriteButton.focus();
    await user.keyboard("{Enter}");

    expect(store.getState().auth.authFormIsOpen).toBe(true);
  });
});
