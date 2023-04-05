import classes from "./RecipeItemList.module.scss";
import { useState, useEffect, useContext } from "react";
import Card from "../../ui/Card";
import RecipeItem from "../recipe-item/RecipeItem";
import Sort from "../sort/Sort";
import Spinner from "../../ui/Spinner";
import RecipeContext from "../../../store/recipe-context";
import {
  API_URL,
  API_KEY,
  TIMEOUT_SEC,
  RESULT_NUM,
} from "../../../variables/constants";
import { timeout } from "../../../variables/utils";
import { useThrowAsyncError } from "../../../hooks/use-throw-async-error";

function RecipeItemList({ data }) {
  const [searchResult, setSearchResult] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);

  const throwAsyncError = useThrowAsyncError();

  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;

  const requestData = data;
  const title = requestData.query || "Search results";

  useEffect(() => {
    setSearchResult([]);
    setRecipesIsLoading(true);

    const getRecipesHandler = async () => {
      try {
        const fetchRecs = fetch(
          `${API_URL}/recipes/complexSearch?apiKey=${API_KEY}&query=${
            requestData.query
          }&cuisine=${requestData.cuisine}&diet=${
            requestData.diet
          }&intolerances=${requestData.intolerance}&type=${requestData.type}${
            requestData.maxReadyTime &&
            `&maxReadyTime=${requestData.maxReadyTime}`
          }${
            requestData.minCalories && `&minCalories=${requestData.minCalories}`
          }${
            requestData.maxCalories && `&maxCalories=${requestData.maxCalories}`
          }&number=${RESULT_NUM}&addRecipeNutrition=true`
        );

        const res = await Promise.race([fetchRecs, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        console.log(data);

        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);
        if (data.totalResults === 0)
          throw new Error(
            `No results for "${requestData.query}". Try checking your spelling`
          );

        const recipies = data.results?.map((recipe) => {
          return {
            id: recipe.id,
            title: recipe.title,
            img: recipe.image,
            time: recipe.readyInMinutes,
            calories: recipe.nutrition.nutrients.find(
              ({ name }) => name === "Calories"
            ).amount,
            servings: recipe.servings,
          };
        });

        setSearchResult(recipies);
        setRecipesIsLoading(false);
      } catch (error) {
        throwAsyncError(error);
        setRecipesIsLoading(false);
      }
    };
    getRecipesHandler();
  }, [requestData]);

  const sortHandler = (e) => {
    if (!searchResult.length) {
      return;
    }

    const sortB = e ? e.target.value : "calories-asc";
    const [sortBy, sortType] = sortB.split("-");

    const res = searchResult
      .slice()
      .sort((a, b) =>
        sortType === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
      );

    setSortedRecipes(res);
  };

  useEffect(sortHandler, [searchResult]);

  return (
    <div
      className={`${classes["search-result"]} ${
        recipeIsOpen ? classes["hidden-md"] : ""
      }`}
    >
      <Card>
        {recipesIsLoading && <Spinner />}
        {searchResult.length !== 0 && (
          <>
            <div className={classes["search-result__head"]}>
              {!recipeIsOpen && (
                <h1 className={classes["search-result__title"]}>
                  {title} ({searchResult.length})
                </h1>
              )}
              <Sort onSort={sortHandler} />
            </div>
            <div
              className={`${classes["cards-container"]} ${
                recipeIsOpen ? classes["cards-container--side"] : ""
              }`}
            >
              <RecipeItem data={sortedRecipes} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default RecipeItemList;
