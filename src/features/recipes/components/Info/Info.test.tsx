import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import authSlice from "../../../auth/store/authSlice";
import { FavoritesProvider } from "../../../favorites/context/FavoritesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Info from "./Info";

describe("Info", () => {
  it("exposes the favorite action as a keyboard-operable toggle button", async () => {
    const user = userEvent.setup();
    const store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
    });

    const client = new QueryClient();
    const { unmount } = render(
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <FavoritesProvider>
            <Info readyInMinutes={30} servings={2} recipeId="42" />
          </FavoritesProvider>
        </QueryClientProvider>
      </Provider>,
    );

    const favoriteButton = screen.getByRole("button", {
      name: "Add to favorites",
    });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

    favoriteButton.focus();
    await user.keyboard("{Enter}");

    expect(store.getState().auth.authFormIsOpen).toBe(true);
    unmount();
    client.clear();
  });
});
