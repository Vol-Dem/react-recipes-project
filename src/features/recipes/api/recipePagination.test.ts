const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  limit: vi.fn((value) => ({ limit: value })),
  orderBy: vi.fn((field, direction) => ({ field, direction })),
  query: vi.fn((...constraints) => constraints),
  startAfter: vi.fn((cursor) => ({ after: cursor })),
}));
vi.mock("firebase/firestore", () => mocks);
vi.mock("./recipeRepository", () => ({
  getRecipesCollection: () => "recipes",
}));
import { fetchRecipePage } from "./recipePagination";
import type {
  QueryConstraint,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const documents = Array.from({ length: 9 }, (_, index) => ({
  id: String(index),
  data: () => ({
    id: index,
    title: `Recipe ${index}`,
    image: "",
    readyInMinutes: 10,
    servings: 2,
    nutrition: { nutrients: [{ name: "Calories", amount: 200 }] },
  }),
}));

describe("recipe pagination", () => {
  afterEach(() => vi.clearAllMocks());

  it("uses the last displayed document as the exclusive next-page cursor", async () => {
    mocks.getDocs.mockResolvedValue({ docs: documents });
    const page = await fetchRecipePage({});
    expect(page.recipes.map((recipe) => recipe.id)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(page.nextCursor).toBe(documents[7]);
    expect(page.isLastPage).toBe(false);
    expect(mocks.limit).toHaveBeenCalledWith(9);
    expect(mocks.startAfter).not.toHaveBeenCalled();
    await fetchRecipePage({}, page.nextCursor);
    expect(mocks.startAfter).toHaveBeenCalledWith(documents[7]);
  });

  it.each([0, 3, 8])(
    "has no next cursor for a final page of %s recipes",
    async (length) => {
      mocks.getDocs.mockResolvedValue({ docs: documents.slice(0, length) });
      const page = await fetchRecipePage({});
      expect(page.isLastPage).toBe(true);
      expect(page.nextCursor).toBeUndefined();
      expect(page.recipes).toHaveLength(length);
    },
  );

  it("does not reuse a different request's cursor or sort", async () => {
    mocks.getDocs.mockResolvedValue({ docs: documents });
    const cursor = documents[7] as unknown as QueryDocumentSnapshot;
    await fetchRecipePage({ sortBy: "calories", sortType: "desc" }, cursor);
    await fetchRecipePage({});
    expect(mocks.startAfter).toHaveBeenCalledOnce();
    expect(mocks.query).toHaveBeenLastCalledWith(
      "recipes",
      { field: "nutrition", direction: undefined },
      { limit: 9 },
    );
  });

  it("includes the favorites filter without sharing it with search", async () => {
    mocks.getDocs.mockResolvedValue({ docs: documents });
    const filter = { type: "where" } as QueryConstraint;
    await fetchRecipePage({}, undefined, filter);
    expect(mocks.query).toHaveBeenLastCalledWith(
      "recipes",
      filter,
      { field: "nutrition", direction: undefined },
      { limit: 9 },
    );
    await fetchRecipePage({});
    expect(mocks.query).toHaveBeenLastCalledWith(
      "recipes",
      { field: "nutrition", direction: undefined },
      { limit: 9 },
    );
  });
});
