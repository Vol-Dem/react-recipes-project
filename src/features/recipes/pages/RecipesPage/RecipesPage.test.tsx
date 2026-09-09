import {
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

vi.mock("../../api/recipeApi");
const mockedFetchRecipes = vi.mocked(fetchRecipesFromApi);
const { params } = vi.hoisted(() => ({ params: {} as { recipeId?: string } }));
vi.mock("next/navigation", () => ({
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
  const setup = () => {
    const client = makeQueryClient();
    clients.push(client);
    const store = makeStore();
    return {
      store,
      ...render(
        <Provider store={store}>
          <QueryClientProvider client={client}>
            <RecipesPage>
              <ListProbe />
            </RecipesPage>
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
    await waitFor(() =>
      expect(screen.queryByText("Your recipe book")).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId("section-search").className).toMatch(/_mt0_/);
    expect(screen.getByRole("combobox", { name: /Sort\s+by/ })).toHaveValue(
      "-",
    );
  });

  it("does not show a back-to-list state when a detail URL loads without a search", () => {
    params.recipeId = "152";
    setup();
    expect(screen.getByTestId("list-context")).toHaveTextContent("false:true");
    expect(screen.queryByText("Your recipe book")).not.toBeInTheDocument();
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
