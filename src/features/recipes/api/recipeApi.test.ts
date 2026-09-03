import axios from "axios";
import { fetchRecipesFromApi } from "./recipeApi";

vi.mock("axios");
const mockedAxiosGet = vi.mocked(axios.get);

describe("fetchRecipesFromApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns response data", async () => {
    const responseData = { results: [{ id: 1 }] };
    mockedAxiosGet.mockResolvedValue({ data: responseData });

    await expect(fetchRecipesFromApi("https://test.com/api")).resolves.toEqual(
      responseData,
    );
    expect(axios.get).toHaveBeenCalledWith("https://test.com/api");
  });

  it("returns bulk recipe arrays without changing their shape", async () => {
    const responseData = [{ id: 1 }];
    mockedAxiosGet.mockResolvedValue({ data: responseData });

    await expect(fetchRecipesFromApi("https://test.com/bulk")).resolves.toEqual(
      responseData,
    );
  });

  it("preserves request errors and their response metadata", async () => {
    const requestError = Object.assign(new Error("Network error"), {
      response: { status: 503 },
    });
    mockedAxiosGet.mockRejectedValue(requestError);

    await expect(fetchRecipesFromApi("https://test.com/api")).rejects.toBe(
      requestError,
    );
  });
});
