import {
  fetchFavoriteRecipes,
  fetchFavoriteRecipePage,
} from "./favoriteRecipesApi";
import { fetchRecipesFromApi } from "../../recipes/api/recipeApi";
import { fetchRecipePage } from "../../recipes/api/recipePagination";
import { where } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  where: vi.fn(() => "favorites-filter"),
}));
vi.mock("../../recipes/api/recipeApi", () => ({
  fetchRecipesFromApi: vi.fn(),
}));
vi.mock("../../recipes/api/recipePagination", () => ({
  fetchRecipePage: vi.fn(),
}));

describe("favorite recipe requests", () => {
  afterEach(() => vi.clearAllMocks());

  it("maps bulk results and forwards cancellation", async () => {
    vi.mocked(fetchRecipesFromApi).mockResolvedValue([
      {
        id: 1,
        title: "Pasta",
        image: "recipe.jpg",
        readyInMinutes: 20,
        servings: 2,
        nutrition: { nutrients: [{ name: "Calories", amount: 200 }] },
      },
    ]);
    const signal = new AbortController().signal;
    await expect(fetchFavoriteRecipes([1], signal)).resolves.toEqual([
      {
        id: 1,
        title: "Pasta",
        img: "recipe.jpg",
        readyInMinutes: 20,
        servings: 2,
        calories: 200,
      },
    ]);
    expect(fetchRecipesFromApi).toHaveBeenCalledWith(
      "/api/recipes/bulk?ids=1",
      signal,
    );
  });

  it("filters every Firestore page by the selected favorite IDs", async () => {
    const order = { sortBy: "calories", sortType: "desc" } as const;
    await fetchFavoriteRecipePage([1, 2], order);
    expect(where).toHaveBeenCalledWith("id", "in", [1, 2]);
    expect(fetchRecipePage).toHaveBeenCalledWith(
      order,
      undefined,
      "favorites-filter",
    );
  });

  it("never sends empty IDs to the API or Firestore", async () => {
    await expect(fetchFavoriteRecipes([])).resolves.toEqual([]);
    await expect(fetchFavoriteRecipePage([], {})).resolves.toEqual({
      recipes: [],
      isLastPage: true,
      nextCursor: undefined,
    });
    expect(fetchRecipesFromApi).not.toHaveBeenCalled();
    expect(fetchRecipePage).not.toHaveBeenCalled();
    expect(where).not.toHaveBeenCalled();
  });
});
