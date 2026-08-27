import axios from "axios";
import { fetchRecipesFromApi } from "./recipeApi";

vi.mock("axios");

describe("fetchRecipesFromApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns response data", async () => {
    const responseData = { results: [{ id: 1 }] };
    axios.get.mockResolvedValue({ data: responseData });

    await expect(fetchRecipesFromApi("https://test.com/api")).resolves.toEqual(
      responseData,
    );
    expect(axios.get).toHaveBeenCalledWith("https://test.com/api");
  });

  it("normalizes request failures as errors", async () => {
    axios.get.mockRejectedValue(new Error("Network error"));

    await expect(
      fetchRecipesFromApi("https://test.com/api"),
    ).rejects.toThrow("Error: Network error");
  });
});
