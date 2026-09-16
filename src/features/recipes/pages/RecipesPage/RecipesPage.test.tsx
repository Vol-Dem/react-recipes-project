import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeQueryClient } from "../../../../app/queryClient";
import { makeStore } from "../../../../app/store";
import { fetchRecipesFromApi } from "../../api/recipeApi";
import { useRecipeList } from "../../context/RecipeListContext";
import RecipesPage from "./RecipesPage";
import { FavoritesProvider } from "../../../favorites/context/FavoritesContext";
import { mockNextHistory } from "../../../../test-utils/nextHistory";
import { fetchRecipePage } from "../../api/recipePagination";
import { recipeActions } from "../../store/recipesSlice";
import classes from "./RecipesPage.module.scss";

vi.mock("../../api/recipePagination", () => ({ fetchRecipePage: vi.fn() }));

vi.mock("../../api/recipeApi");
const mockedFetchRecipes = vi.mocked(fetchRecipesFromApi);
const { params } = vi.hoisted(() => ({ params: {} as { recipeId?: string } }));
vi.mock("next/navigation", async () => ({
  useSearchParams: (await import("../../../../test-utils/nextHistory"))
    .useTestSearchParams,
  useParams: () => params,
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));
const ListProbe = () => {
  const { list } = useRecipeList();
  return (
    <output data-testid="list-context">
      {String(list.hasRecipes)}:{String(list.isRecipeOpen)}
    </output>
  );
};

describe("RecipesPage component", () => {
  const clients: QueryClient[] = [];
  const setup = (fallback = false) => {
    const client = makeQueryClient();
    clients.push(client);
    const store = makeStore();
    if (fallback) store.dispatch(recipeActions.setDailyLimitIsReached());
    return {
      store,
      ...render(
        <Provider store={store}>
          <QueryClientProvider client={client}>
            <FavoritesProvider>
              <RecipesPage>
                <ListProbe />
              </RecipesPage>
            </FavoritesProvider>
          </QueryClientProvider>
        </Provider>,
      ),
    };
  };
  const submit = (query: string) => {
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: query },
    });
    fireEvent.click(screen.getByTestId("search-submit"));
  };
  beforeEach(() => {
    mockNextHistory();
    delete params.recipeId;
    mockedFetchRecipes.mockResolvedValue({
      results: [
        {
          id: 152,
          title: "Pizza",
          image: "/test-recipe.jpg",
          readyInMinutes: 35,
          servings: 4,
          nutrition: {
            nutrients: [{ name: "Calories", amount: 237, unit: "kcal" }],
          },
        },
      ],
    });
  });
  afterEach(() => {
    cleanup();
    clients.splice(0).forEach((client) => client.clear());
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders the initial search page without making a request", () => {
    setup();
    expect(screen.getByText("Your recipe book")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.queryByTestId("recipe-item-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
  });

  it("renders query-owned results and shares list presence with detail children", async () => {
    const { store } = setup();
    submit("pasta");
    expect(
      await screen.findByText("Pizza", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(fetchRecipesFromApi).toHaveBeenCalledWith(
      "/api/recipes/search?query=pasta&cuisine=&diet=&intolerance=&type=",
      expect.any(AbortSignal),
    );
    expect(store.getState().recipe).not.toHaveProperty("searchResult");
    expect(screen.getByTestId("recipe-item-list")).toBeInTheDocument();
    expect(screen.getByTestId("list-context")).toHaveTextContent("true:false");
    expect(screen.getByRole("link", { name: /Pizza/ })).toHaveAttribute(
      "href",
      "/recipe/152?query=pasta",
    );
    await waitFor(() =>
      expect(screen.queryByText("Your recipe book")).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId("section-search").className).toMatch(/_mt0_/);
    expect(
      screen.getByRole("combobox", { name: /Sort\s+by/ }),
    ).toHaveTextContent("-");
  });

  it("does not show a back-to-list state when a detail URL loads without a search", () => {
    params.recipeId = "152";
    setup();
    expect(screen.getByTestId("list-context")).toHaveTextContent("false:true");
    expect(screen.queryByText("Your recipe book")).not.toBeInTheDocument();
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
    expect(
      screen.getByTestId("list-context").closest("section"),
    ).not.toHaveClass(classes["recipe-columns"]);
  });

  it("keeps the detail columns while a new Firestore sort order is loading", async () => {
    params.recipeId = "152";
    window.history.replaceState(null, "", "/recipe/152?query=pasta");
    const page = {
      recipes: [
        {
          id: 152,
          title: "Saved pizza",
          img: "",
          readyInMinutes: 35,
          servings: 4,
          calories: 237,
        },
      ],
      isLastPage: true,
      nextCursor: undefined,
    };
    let resolveSorted!: (value: typeof page) => void;
    vi.mocked(fetchRecipePage)
      .mockResolvedValueOnce(page)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSorted = resolve;
          }),
      );
    setup(true);
    await screen.findByText("Saved pizza", {}, { timeout: 5000 });
    const content = screen.getByTestId("list-context").closest("section");
    expect(content).toHaveClass(classes["recipe-columns"]);
    fireEvent.click(screen.getByRole("combobox", { name: /Sort\s+by/ }));
    fireEvent.click(screen.getByRole("option", { name: /Calories ↓/ }));
    await waitFor(() => expect(fetchRecipePage).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId("list-context")).toHaveTextContent("false:true");
    expect(content).toHaveClass(classes["recipe-columns"]);
    await act(async () => resolveSorted(page));
    await screen.findByText("Saved pizza");
    expect(content).toHaveClass(classes["recipe-columns"]);
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
  });

  it("shows a safe error and recovers on a later submission", async () => {
    mockedFetchRecipes.mockRejectedValueOnce(
      new Error("Internal server details"),
    );
    setup();
    submit("pasta");
    expect(await screen.findByTestId("error-message")).toHaveTextContent(
      "Unable to load recipes. Please try again",
    );
    expect(
      screen.queryByText("Internal server details"),
    ).not.toBeInTheDocument();
    submit("pasta");
    expect(
      await screen.findByText("Pizza", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
