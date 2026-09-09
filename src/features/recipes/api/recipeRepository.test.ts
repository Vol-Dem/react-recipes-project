const mocks = vi.hoisted(() => ({
  collection: vi.fn(() => "recipes-collection"),
  doc: vi.fn(() => "recipe-reference"),
  getDoc: vi.fn(),
  getFirestore: vi.fn(() => "firestore"),
}));
vi.mock("firebase/firestore", () => mocks);
vi.mock("../../../config/firebase", () => ({ default: "firebase-app" }));
import {
  fetchRecipeFromFirestore,
  getRecipesCollection,
} from "./recipeRepository";

describe("recipeRepository", () => {
  afterEach(() => vi.clearAllMocks());

  it("returns the recipes collection", () => {
    expect(getRecipesCollection()).toBe("recipes-collection");
    expect(mocks.collection).toHaveBeenCalledWith("firestore", "recipes");
  });

  it("loads a recipe document", async () => {
    mocks.getDoc.mockResolvedValue({
      data: () => ({ id: 42, title: "Pasta" }),
    });
    await expect(fetchRecipeFromFirestore(42)).resolves.toEqual({
      id: 42,
      title: "Pasta",
    });
    expect(mocks.doc).toHaveBeenCalledWith("firestore", "recipes", "42");
  });
});
