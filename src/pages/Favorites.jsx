import { useState } from "react";
import RecipeItemList from "../components/recipe/recipe-item-list/RecipeItemList";
import classes from "./Favorites.module.scss";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useThrowAsyncError } from "../hooks/use-throw-async-error";
import Recipe from "../components/recipe/recipe/Recipe";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";
import { useContext } from "react";
import RecipeContext from "../store/recipe-context";
import {
  getFirestore,
  query,
  where,
  collection,
  orderBy,
  startAt,
  limit,
  endAt,
  limitToLast,
} from "firebase/firestore";
import firebaseApp from "../config";
import { useGetDataFromFirebase } from "../hooks/use-get-data-from-firebase";
import { useGetDataFromHttp } from "../hooks/use-get-data-from-http";

const firestore = getFirestore(firebaseApp);
const favRef = collection(firestore, "recipes");

const Favorites = () => {
  const [favRecipes, setFavRecipes] = useState([]);
  const [recipesPerPage, setRecipesPerPage] = useState([]);
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const favList = useSelector((state) => state.fav.favList);

  const throwAsyncError = useThrowAsyncError();

  const [firebaseDataState, getRecipesFromFirebase] = useGetDataFromFirebase();
  const getRecipeFromHttp = useGetDataFromHttp();

  const { lastVisible, firstVisible } = firebaseDataState;

  const recipeCtx = useContext(RecipeContext);
  const recipeId = recipeCtx.recipeId;
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const dailyLimitReached = recipeCtx.dailyLimitReached;

  const favListIsEmpty = !favList.length;
  const epmtyMessage = "Your fav list is empty";

  useEffect(() => {
    if (!dailyLimitReached) {
      const start = (currentPage - 1) * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const end = currentPage * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const resPerPage = favRecipes.slice(start, end);
      setRecipesPerPage(resPerPage);
      const amountOfPages = Math.ceil(
        favRecipes.length / +process.env.REACT_APP_AMOUNT_PER_PAGE
      );
      if (currentPage === amountOfPages) setIsLastPage(true);
    }
  }, [favRecipes, currentPage, dailyLimitReached]);

  useEffect(() => {
    if (favListIsEmpty) {
      return;
    }
    setCurrentPage(1);
    setRecipesIsLoading(true);
    if (!dailyLimitReached) {
      const favListQuery = favList.join(",");
      const requestUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&ids=${favListQuery}&includeNutrition=true`;

      const getRecipes = (data) => {
        const recipes = data?.map((recipe) => {
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
        setFavRecipes(recipes);
        setRecipesIsLoading(false);
      };

      getRecipeFromHttp({ url: requestUrl }, getRecipes);
    } else {
      const getFavs = async () => {
        try {
          const recipeQuery = query(
            favRef,
            where("id", "in", favList),
            orderBy("nutrition"),
            limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
          );

          const [recipes, isLast] = await getRecipesFromFirebase(recipeQuery);
          setIsLastPage(isLast);
          setRecipesPerPage(recipes);
          setRecipesIsLoading(false);
        } catch (error) {
          setRecipesIsLoading(false);
          throwAsyncError(error);
        }
      };
      getFavs();
    }
  }, [
    favList,
    throwAsyncError,
    favListIsEmpty,
    dailyLimitReached,
    getRecipesFromFirebase,
    getRecipeFromHttp,
  ]);

  const nextPageHandler = async () => {
    if (!dailyLimitReached) {
      setCurrentPage((prevState) => prevState + 1);
    } else {
      try {
        setRecipesIsLoading(true);
        setCurrentPage((prevState) => prevState + 1);

        const recipeQuery = query(
          favRef,
          where("id", "in", favList),
          orderBy("nutrition"),
          startAt(lastVisible),
          limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
        );

        const [recipes, isLast] = await getRecipesFromFirebase(recipeQuery);
        setIsLastPage(isLast);
        setRecipesPerPage(recipes);
        setRecipesIsLoading(false);
      } catch (error) {
        setRecipesIsLoading(false);
        throwAsyncError(error);
      }
    }
  };

  const prevPageHandler = async () => {
    if (!dailyLimitReached) {
      setIsLastPage(false);
      setCurrentPage((prevState) => prevState - 1);
    } else {
      try {
        setIsLastPage(false);
        setRecipesIsLoading(true);
        setCurrentPage((prevState) => prevState - 1);

        const recipeQuery = query(
          favRef,
          where("id", "in", favList),
          orderBy("nutrition"),
          endAt(firstVisible),
          limitToLast(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
        );
        const [recipes] = await getRecipesFromFirebase(recipeQuery);
        setRecipesPerPage(recipes);
        setRecipesIsLoading(false);
      } catch (error) {
        setRecipesIsLoading(false);
        throwAsyncError(error);
      }
    }
  };

  return (
    <section
      className={`${classes["section-favorites"]} ${
        recipeIsOpen ? classes["recipe-columns"] : ""
      }`}
    >
      <div>
        {favRecipes && (
          <RecipeItemList
            data={recipesPerPage}
            title="Favorites"
            epmtyMessage={epmtyMessage}
            nextPage={nextPageHandler}
            prevPage={prevPageHandler}
            isLastPage={isLastPage}
            currentPage={currentPage}
            recipesIsLoading={recipesIsLoading}
          />
        )}
      </div>

      {recipeIsOpen && (
        <ErrorBoundary key={recipeId}>
          <Recipe />
        </ErrorBoundary>
      )}
    </section>
  );
};

export default Favorites;
