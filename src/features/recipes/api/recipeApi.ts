import axios from "axios";
import type { RecipeApiResponse } from "../types";

export const fetchRecipesFromApi = async (
  requestUrl: string,
): Promise<RecipeApiResponse> => {
  const response = await axios.get<RecipeApiResponse>(requestUrl);

  return response.data;
};
