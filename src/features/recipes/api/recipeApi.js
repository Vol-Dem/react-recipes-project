import axios from "axios";

export const fetchRecipesFromApi = async (requestUrl) => {
  const response = await axios.get(requestUrl);

  return response.data;
};
