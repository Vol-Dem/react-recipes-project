import classes from "./RecipeCardList.module.css";
import { useState, useEffect, useContext } from "react";
import ErrorContext from "../../store/error-context";
import Card from "../ui/Card";
import RecipeCard from "../recipe-card/RecipeCard";
import Sort from "../sort/Sort";
import Spinner from "../ui/Spinner";
// import testImg from "./../../assets/test.jpg";
import RecipeContext from "../../store/recipe-context";
import ErrorMessage from "../ui/ErrorMessage";

function RecipeCardList(props) {
  const [searchResult, setSearchResult] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);

  const [recipesIsLoading, setRecipesIsLoading] = useState(false);

  const errorCtx = useContext(ErrorContext);
  const setError = errorCtx.setErrorMessage;
  const errorMessage = errorCtx.errorMessage;

  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;

  const requestData = props.data;

  const getRecipesHandler = () => {
    setSearchResult([]);
    setError("");
    setRecipesIsLoading(true);

    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=5303df5a010c4a06a1d6ac24c41091f9&query=${
        requestData.query
      }&cuisine=${requestData.cuisine}&diet=${requestData.diet}&intolerances=${
        requestData.intolerance
      }&type=${requestData.type}${
        requestData.maxReadyTime && `&maxReadyTime=${requestData.maxReadyTime}`
      }${requestData.minCalories && `&minCalories=${requestData.minCalories}`}${
        requestData.maxCalories && `&maxCalories=${requestData.maxCalories}`
      }&number=2&addRecipeNutrition=true`
    )
      .then((response) => {
        console.log(response);
        // if (response.status >= 400) {
        //   throw new Error("Server responds with error!");
        // }
        return response.json();
      })
      .then((data) => {
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
      })
      .catch((error) => {
        setRecipesIsLoading(false);
        setError(error.message);
      });

    // setRecipesIsLoading(false);
    // setSearchResult([
    //   {
    //     id: 22,
    //     title: "Title 1",
    //     img: testImg,
    //     time: 15,
    //     calories: 130,
    //     servings: "3",
    //   },
    //   {
    //     id: 23,
    //     title: "Title 2",
    //     img: testImg,
    //     time: 20,
    //     calories: 200,
    //     servings: "5",
    //   },
    //   {
    //     id: 24,
    //     title: "Title 2",
    //     img: testImg,
    //     time: 20,
    //     calories: 200,
    //     servings: "5",
    //   },
    //   {
    //     id: 25,
    //     title: "Title 2",
    //     img: testImg,
    //     time: 20,
    //     calories: 200,
    //     servings: "5",
    //   },
    //   {
    //     id: 26,
    //     title: "Title 2",
    //     img: testImg,
    //     time: 20,
    //     calories: 2060,
    //     servings: "5",
    //   },
    // ]);
  };

  useEffect(getRecipesHandler, [requestData]);

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
    <Card>
      {recipesIsLoading && <Spinner />}
      {!recipeIsOpen && errorMessage !== "" && <ErrorMessage />}
      {searchResult.length !== 0 && (
        <>
          <div className={classes["search-result"]}>
            <div
              className={`${classes["search-head"]} ${
                recipeIsOpen ? classes.side : ""
              }`}
            >
              {!recipeIsOpen && (
                <h1 className={classes["search-head__title"]}>
                  {requestData.query || "Search results"} ({searchResult.length}
                  )
                </h1>
              )}
              <Sort onSort={sortHandler} />
            </div>
            <div
              className={`${classes["recipe-container"]} ${
                recipeIsOpen ? classes.side : ""
              }`}
            >
              <RecipeCard data={sortedRecipes} />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default RecipeCardList;
