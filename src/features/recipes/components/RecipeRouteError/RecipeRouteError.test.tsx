import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "../../../../app/queryClient";
import { RecipeHttpError } from "../../api/requestRecipeJson";
import { recipeDetailsQueryKey } from "../../queries/recipeDetailsQueryKey";
import RecipeRouteError from "./RecipeRouteError";
import RecipeNotFound from "../RecipeNotFound/RecipeNotFound";

const { push, list } = vi.hoisted(() => ({
  push: vi.fn(),
  list: { listHref: "/?query=pasta" },
}));
vi.mock("next/navigation", () => ({
  useParams: () => ({ recipeId: "42" }),
  useRouter: () => ({ push }),
}));
vi.mock("../../context/RecipeListContext", () => ({
  useRecipeList: () => list,
}));

describe("recipe route recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    list.listHref = "/?query=pasta";
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("clears only this recipe's failed queries before retrying the route", async () => {
    const client = makeQueryClient();
    const failedKey = recipeDetailsQueryKey("42", "api");
    await client
      .query({
        queryKey: failedKey,
        queryFn: () => {
          throw new RecipeHttpError(500);
        },
        retry: false,
      })
      .catch(() => {});
    client.setQueryData(recipeDetailsQueryKey("42", "firestore"), {
      title: "Saved recipe",
    });
    client.setQueryData(recipeDetailsQueryKey("43", "api"), {
      title: "Other recipe",
    });
    client.setQueryData(["recipes", "search"], [42, 43]);
    client.setQueryData(["favorites", "user", "ids"], [42]);
    const retry = vi.fn(() =>
      expect(client.getQueryState(failedKey)).toBeUndefined(),
    );
    render(
      <QueryClientProvider client={client}>
        <RecipeRouteError
          error={
            new Error("Private error", { cause: new RecipeHttpError(500) })
          }
          retry={retry}
        />
      </QueryClientProvider>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load recipes. Please try again",
    );
    expect(screen.queryByText("Private error")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
    expect(
      client.getQueryData(recipeDetailsQueryKey("42", "firestore")),
    ).toEqual({ title: "Saved recipe" });
    expect(client.getQueryData(recipeDetailsQueryKey("43", "api"))).toEqual({
      title: "Other recipe",
    });
    expect(client.getQueryData(["recipes", "search"])).toEqual([42, 43]);
    expect(client.getQueryData(["favorites", "user", "ids"])).toEqual([42]);
    client.clear();
  });

  it.each(["/?query=pasta&diet=vegan", "/favorites"])(
    "returns to the correct list: %s",
    (href) => {
      list.listHref = href;
      render(<RecipeNotFound />);
      expect(screen.getByRole("alert")).toHaveTextContent("Recipe not found");
      expect(
        screen.queryByRole("button", { name: "Try again" }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Back to list" }));
      expect(push).toHaveBeenCalledExactlyOnceWith(href, { scroll: false });
    },
  );
});
