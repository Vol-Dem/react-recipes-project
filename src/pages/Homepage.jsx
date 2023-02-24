import SearchBox from "../components/search-bar/SearchBox";
import classes from "./Homepage.module.css";
import { useState } from "react";
import RecipeCardList from "../components/recipe-card-list/RecipeCardList";
import RecipeCard from "../components/recipe-card/RecipeCard";

const Homepage = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [queryTitle, setQueryTitle] = useState("");

  function getRecipesHandler(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const query = data.get("query");
    const cuisine = data.get("cuisine");
    console.log(query);
    setQueryTitle(query);
    setSearchQuery("");
    // e.target.reset();

    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=5303df5a010c4a06a1d6ac24c41091f9&query=${query}&cuisine=${cuisine}&number=2&addRecipeNutrition=true`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const recipies = data.results.map((recipe) => {
          console.log(recipe);
          return {
            id: recipe.id,
            title: recipe.title,
            img: recipe.image,
            time: recipe.readyInMinutes,
            calories: recipe.nutrition.nutrients,
            servings: recipe.servings,
          };
        });
        setSearchResult(recipies);
      })
      .then(() => console.log(searchResult));
  }

  const searchQueryHandler = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className={classes["section-search"]}>
      {searchResult.length === 0 && (
        <div className={classes.logo}>Your book of recipes</div>
      )}
      <SearchBox
        getFormData={getRecipesHandler}
        className={searchResult.length ? "search-filled" : ""}
        searchQuery={searchQuery}
        onSearchQueryChange={searchQueryHandler}
      />
      {searchResult.length !== 0 && (
        <RecipeCardList>
          <div className={classes["search-head"]}>
            <h1 className={classes["search-head__title"]}>{queryTitle}</h1>
            <div className={classes["search-head__sort"]}>
              <span>Sort by</span>
              <select
                className={classes["search-head__sort--select"]}
                name="sort"
                id=""
              >
                <option value="italian">Calory</option>
                <option value="french">Time</option>
              </select>
            </div>
          </div>
          <RecipeCard data={searchResult} />
        </RecipeCardList>
      )}
    </section>
  );
};

export default Homepage;
