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
  const [sortedRecipes, setSortedRecipes] = useState([]);
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
            calories: recipe.nutrition.nutrients[0].amount,
            servings: recipe.servings,
          };
        });
        setSearchResult(recipies);
      });

    // setSearchResult([
    //   {
    //     id: 22,
    //     title: "Title 1",
    //     img: "img1.jpg",
    //     time: 15,
    //     calories: 130,
    //     servings: "3",
    //   },
    //   {
    //     id: 23,
    //     title: "Title 2",
    //     img: "img2.jpg",
    //     time: 20,
    //     calories: 200,
    //     servings: "5",
    //   },
    // ]);
    console.log("useEfffff");
  };

  useEffect(getRecipesHandler, [formData]);

  const searchQueryHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const filterOpenHandler = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  const sortHandler = (e) => {
    const sortB = e ? e.target.value : "calories-asc";
    const [sortBy, sortType] = sortB.split("-");
    console.log(sortBy, sortType);
    const res = searchResult
      .sort((a, b) =>
        sortType === "asc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]
      )
      .slice();
    console.log(res);
    setSortedRecipes(res);
  };

  useEffect(sortHandler, [searchResult]);
  console.log(sortedRecipes);
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
              {formData.query ? formData.query : "Search results"} (
              {searchResult.length})
            </h1>
            <Sort onSort={sortHandler} />
          </div>
          <RecipeCardList>
            <RecipeCard data={sortedRecipes} />
          </RecipeCardList>
        </Card>
      )}
    </section>
  );
};

export default Homepage;
