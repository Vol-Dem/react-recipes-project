import SearchBox from "../components/search-bar/SearchBox";
import classes from "./Homepage.module.css";
import { useState, useEffect } from "react";
import RecipeCardList from "../components/recipe-card-list/RecipeCardList";
import RecipeCard from "../components/recipe-card/RecipeCard";
import Card from "../components/ui/Card";
import Sort from "../components/sort/Sort";

const Homepage = () => {
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
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
      ...formData,
      ...data,
    });
  };

  const getRecipesHandler = () => {
    // e.preventDefault();
    // const data = new FormData(e.target);
    if (Object.values(formData).join("") === "") {
      return;
    }

    setSearchInput("");
    setFilterIsOpen(false);
    // e.target.reset();
    console.log(formData);

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
  };

  useEffect(getRecipesHandler, [formData]);

  const searchQueryHandler = (e) => {
    setSearchInput(e.target.value);
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
        getFormData={getFormDataHandler}
        className={searchResult.length ? "search-filled" : ""}
        searchInput={searchInput}
        onSearchQueryChange={searchQueryHandler}
        filterState={filterIsOpen}
        onFilterChange={filterOpenHandler}
      />
      {searchResult.length && (
        <Card>
          <div className={classes["search-head"]}>
            <h1 className={classes["search-head__title"]}>
              {formData.query ? formData.query : "Search results"}
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
