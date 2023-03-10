import SearchBox from "../components/search-bar/SearchBox";
import classes from "./Homepage.module.css";
import { useState, useEffect } from "react";
import RecipeCardList from "../components/recipe-card-list/RecipeCardList";
import RecipeCard from "../components/recipe-card/RecipeCard";
import Card from "../components/ui/Card";
import Sort from "../components/sort/Sort";
import Recipe from "../components/recipe/Recipe";
import Spinner from "../components/ui/Spinner";
// import testImg from "./../assets/test.jpg";

const Homepage = () => {
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);
  const [recipeIsOpen, setRecipeIsOpen] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [searchResultIsOpen, setSearchResultIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [formData, setFormData] = useState({
    query: "",
    cuisine: "",
    diet: "",
    intolerance: "",
    type: "",
    maxReadyTime: "",
    minCalories: "",
    maxCalories: "",
  });

  const getFormDataHandler = (data) => {
    setFormData({
      query: "",
      cuisine: "",
      diet: "",
      intolerance: "",
      type: "",
      maxReadyTime: "",
      minCalories: "",
      maxCalories: "",
      ...data,
    });
    console.log(formData);
  };

  const getRecipesHandler = () => {
    if (Object.values(formData).join("") === "") {
      return;
    }

    setSearchInput("");
    setSearchResult([]);
    setFilterIsOpen(false);
    setRecipeIsOpen(false);
    setCurrentRecipeId(null);
    setErrorMessage("");
    setSearchResultIsOpen(true);
    setRecipesIsLoading(true);

    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=5303df5a010c4a06a1d6ac24c41091f9&query=${
        formData.query
      }&cuisine=${formData.cuisine}&diet=${formData.diet}&intolerances=${
        formData.intolerance
      }&type=${formData.type}${
        formData.maxReadyTime && `&maxReadyTime=${formData.maxReadyTime}`
      }${formData.minCalories && `&minCalories=${formData.minCalories}`}${
        formData.maxCalories && `&maxCalories=${formData.maxCalories}`
      }&number=2&addRecipeNutrition=true`
    )
      .then((response) => {
        console.log(response);
        // if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "failure")
          throw new Error(`${data.message} (${data.code})`);
        if (data.totalResults === 0)
          throw new Error(`No results. Try checking your spelling`);
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
        setErrorMessage(error.message);
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

  useEffect(getRecipesHandler, [formData]);

  const searchQueryHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const filterOpenHandler = () => {
    setFilterIsOpen(!filterIsOpen);
  };

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

  const recipeOpenHandler = (e) => {
    const recipeId = e.target.closest("#recipe").dataset.id;
    setRecipeIsOpen(true);
    setCurrentRecipeId(+recipeId);
  };

  const closeRecipeHandler = () => {
    setRecipeIsOpen(false);
  };

  useEffect(() => {
    const windowSizeHandler = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  });

  return (
    <section
      className={`${classes["section-search"]} ${
        searchResultIsOpen && classes.animate
      }`}
    >
      {!searchResultIsOpen && (
        <div className={classes.logo}>Your book of recipes</div>
      )}
      <SearchBox
        getFormData={getFormDataHandler}
        className={searchResult.length ? "search-filled" : ""}
        searchInput={searchInput}
        onSearchQueryChange={searchQueryHandler}
        filterState={filterIsOpen}
        onFilterChange={filterOpenHandler}
      />
      <div className={`${classes.container} ${recipeIsOpen && classes.recipe}`}>
        <div>
          {searchResultIsOpen && (windowWidth > 768 || !recipeIsOpen) && (
            <Card>
              {recipesIsLoading && <Spinner />}
              <div className={classes.error}>{errorMessage}</div>
              {searchResult.length !== 0 &&
                (windowWidth > 768 || !recipeIsOpen) && (
                  <>
                    <div className={classes["search-result"]}>
                      <div
                        className={`${classes["search-head"]} ${
                          recipeIsOpen && classes.side
                        }`}
                      >
                        {!recipeIsOpen && (
                          <h1 className={classes["search-head__title"]}>
                            {formData.query || "Search results"} (
                            {searchResult.length})
                          </h1>
                        )}
                        <Sort onSort={sortHandler} />
                      </div>
                      <RecipeCardList open={recipeIsOpen}>
                        <RecipeCard
                          data={sortedRecipes}
                          onRecipeOpen={recipeOpenHandler}
                          recipeIsOpen={recipeIsOpen}
                          currentRecipeId={currentRecipeId}
                        />
                      </RecipeCardList>
                    </div>
                  </>
                )}
            </Card>
          )}
        </div>
        {recipeIsOpen && (
          <Card>
            <Recipe
              recipeId={currentRecipeId}
              onRecipeClose={closeRecipeHandler}
            />
          </Card>
        )}
      </div>
    </section>
  );
};

export default Homepage;
