import SearchBox from "../components/search-bar/SearchBox";
import classes from "./Homepage.module.css";
import { useState } from "react";
import RecipeCardList from "../components/recipe-card-list/RecipeCardList";
import RecipeCard from "../components/recipe-card/RecipeCard";
import Card from "../components/ui/Card";
import Sort from "../components/sort/Sort";

const Homepage = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [queryTitle, setQueryTitle] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  function getRecipesHandler(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const test = Object.fromEntries(data);
    const query = data.get("query");
    const cuisine = data.getAll("cuisine").toString();
    const diet = data.getAll("diet").toString();
    const intolerance = data.getAll("intolerance").toString();
    const type = data.getAll("type").toString();
    const maxReadyTime = data.get("max-ready-time");
    const minCalories = data.get("min-calories");
    const maxCalories = data.get("max-calories");
    console.log(test);
    console.log(query);
    console.log(cuisine);
    console.log(typeof maxReadyTime);
    setQueryTitle(query);
    setSearchQuery("");
    setFilterIsOpen(false);
    // e.target.reset();

    fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=5303df5a010c4a06a1d6ac24c41091f9&query=${query}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerance}&type=${type}${
        maxReadyTime && `&maxReadyTime=${maxReadyTime}`
      }${minCalories && `&minCalories=${minCalories}`}${
        maxCalories && `&maxCalories=${maxCalories}`
      }&number=2&addRecipeNutrition=true`
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

  const filterOpenHandler = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  return (
    <section
      className={`${classes["section-search"]} ${
        searchResult.length && classes.animate
      }`}
    >
      {!searchResult.length && (
        <div className={classes.logo}>Your book of recipes</div>
      )}
      <SearchBox
        getFormData={getRecipesHandler}
        className={searchResult.length ? "search-filled" : ""}
        searchQuery={searchQuery}
        onSearchQueryChange={searchQueryHandler}
        filterState={filterIsOpen}
        onFilterChange={filterOpenHandler}
      />
      {searchResult.length && (
        <Card>
          <div className={classes["search-head"]}>
            <h1 className={classes["search-head__title"]}>
              {queryTitle ? queryTitle : "Search results"}
            </h1>
            <Sort />
          </div>
          <RecipeCardList>
            <RecipeCard data={searchResult} />
          </RecipeCardList>
        </Card>
      )}
    </section>
  );
};

export default Homepage;
