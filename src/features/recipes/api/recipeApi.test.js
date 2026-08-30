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

  it("preserves request errors and their response metadata", async () => {
    const requestError = Object.assign(new Error("Network error"), {
      response: { status: 503 },
    });
    axios.get.mockRejectedValue(requestError);

    await expect(fetchRecipesFromApi("https://test.com/api")).rejects.toBe(
      requestError,
    );
  });
});
