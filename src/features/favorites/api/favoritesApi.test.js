const firestoreMocks = vi.hoisted(() => ({
  arrayRemove: vi.fn((value) => ({ operation: "remove", value })),
  arrayUnion: vi.fn((value) => ({ operation: "add", value })),
  doc: vi.fn(() => "favorites-reference"),
  getDoc: vi.fn(),
  getFirestore: vi.fn(() => "firestore"),
  setDoc: vi.fn(),
}));

vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../../../config/firebase", () => ({ default: "firebase-app" }));

import { fetchFavoriteIds, updateFavorite } from "./favoritesApi";

describe("favorites API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the stored favorite IDs", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      data: () => ({ favList: [10, 20] }),
      exists: () => true,
    });

    await expect(fetchFavoriteIds("user-id")).resolves.toEqual([10, 20]);
    expect(firestoreMocks.doc).toHaveBeenCalledWith(
      "firestore",
      "favorites",
      "user-id",
    );
  });

  it("returns an empty list for missing or malformed data", async () => {
    firestoreMocks.getDoc
      .mockResolvedValueOnce({ exists: () => false })
      .mockResolvedValueOnce({
        data: () => ({ favList: "invalid" }),
        exists: () => true,
      });

    await expect(fetchFavoriteIds("user-id")).resolves.toEqual([]);
    await expect(fetchFavoriteIds("user-id")).resolves.toEqual([]);
  });

  it("updates individual favorites atomically", async () => {
    firestoreMocks.setDoc.mockResolvedValue();

    await updateFavorite("user-id", 42, true);
    await updateFavorite("user-id", 42, false);

    expect(firestoreMocks.setDoc).toHaveBeenNthCalledWith(
      1,
      "favorites-reference",
      { favList: { operation: "add", value: 42 } },
      { merge: true },
    );
    expect(firestoreMocks.setDoc).toHaveBeenNthCalledWith(
      2,
      "favorites-reference",
      { favList: { operation: "remove", value: 42 } },
      { merge: true },
    );
  });
});
