const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(() => "recipes-collection"),
  doc: vi.fn(() => "recipe-reference"),
  endAt: vi.fn((cursor) => ({ type: "endAt", cursor })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn(() => "firestore"),
  limit: vi.fn((amount) => ({ type: "limit", amount })),
  limitToLast: vi.fn((amount) => ({ type: "limitToLast", amount })),
  orderBy: vi.fn((field, direction) => ({
    type: "orderBy",
    field,
    direction,
  })),
  query: vi.fn((...constraints) => constraints),
  startAt: vi.fn((cursor) => ({ type: "startAt", cursor })),
  where: vi.fn((...parameters) => ({ type: "where", parameters })),
}));

vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../../../config/firebase", () => ({ default: "firebase-app" }));

import {
  createFavoriteRecipesFilter,
  createNextPageRequest,
  createPreviousPageRequest,
  createRecipeResultsLimit,
  fetchRecipeFromFirestore,
  fetchRecipesFromFirestore,
  getRecipesCollection,
} from "./recipeRepository";
import { RECIPES_PER_PAGE } from "../../../shared/constants";

describe("recipeRepository", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates reusable Firestore query values", () => {
    expect(getRecipesCollection()).toBe("recipes-collection");
    expect(createFavoriteRecipesFilter([1, 2])).toEqual({
      type: "where",
      parameters: ["id", "in", [1, 2]],
    });
    expect(createRecipeResultsLimit()).toEqual({
      type: "limit",
      amount: RECIPES_PER_PAGE + 1,
    });
  });

  it("fetches one page and retains the Firestore cursors", async () => {
    const documents = Array.from({ length: 9 }, (_, id) => ({
      id: `document-${id}`,
      data: () => ({ id }),
    }));
    firestoreMocks.getDocs.mockResolvedValue({ docs: documents });

    await expect(
      fetchRecipesFromFirestore({
        queryParameters: ["recipes-reference", undefined, "result-limit"],
        sortBy: "calories",
        sortType: "asc",
      }),
    ).resolves.toEqual({
      recipes: Array.from({ length: 8 }, (_, id) => ({ id })),
      isLastPage: false,
    });

    expect(createNextPageRequest().position).toEqual({
      type: "startAt",
      cursor: documents[8],
    });
    expect(createPreviousPageRequest().position).toEqual({
      type: "endAt",
      cursor: documents[0],
    });
  });

  it("loads a recipe document", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      data: () => ({ id: 42, title: "Pasta" }),
    });

    await expect(fetchRecipeFromFirestore(42)).resolves.toEqual({
      id: 42,
      title: "Pasta",
    });
    expect(firestoreMocks.doc).toHaveBeenCalledWith(
      "firestore",
      "recipes",
      "42",
    );
  });
});
