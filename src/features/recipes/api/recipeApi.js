import axios from "axios";

export const fetchRecipesFromApi = async (requestUrl) => {
  try {
    const response = await axios.get(requestUrl);

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
