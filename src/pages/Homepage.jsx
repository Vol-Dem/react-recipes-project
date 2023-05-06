import classes from "./Homepage.module.scss";
import SearchBox from "../components/search/SearchBox";
import { useState, useContext } from "react";
import Logo from "../components/layout/logo/Logo";
import RecipeContext from "../store/recipe-context";
import ErrorBoundary from "../components/error-boundary/ErrorBoundary";
import { useEffect } from "react";
import { useThrowAsyncError } from "../hooks/use-throw-async-error";
import { RESULT_NUM } from "../variables/constants";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  endAt,
  startAt,
  limitToLast,
} from "firebase/firestore";
import firebaseApp from "../config";
import { useGetDataFromFirebase } from "../hooks/use-get-data-from-firebase";
import { useGetDataFromHttp } from "../hooks/use-get-data-from-http";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../components/ui/Spinner";

const RecipeItemList = lazy(() =>
  import("../components/recipe/recipe-item-list/RecipeItemList")
);
const Recipe = lazy(() => import("../components/recipe/recipe/Recipe"));

const firestore = getFirestore(firebaseApp);
const recipeRef = collection(firestore, "recipes");

const Homepage = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [recipesPerPage, setRecipesPerPage] = useState([]);
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);
  const [searchResultIsOpen, setSearchResultIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);
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

  const throwAsyncError = useThrowAsyncError();

  const recipeCtx = useContext(RecipeContext);
  const recipeId = recipeCtx.recipeId;
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const closeRecipe = recipeCtx.closeRecipe;
  const dailyLimitReached = recipeCtx.dailyLimitReached;

  const [firebaseDataState, getRecipesFromFirebase] = useGetDataFromFirebase();
  const { lastVisible, firstVisible } = firebaseDataState;
  const getRecipeFromHttp = useGetDataFromHttp();

  const epmtyMessage = `No results for "${formData.query}". Try checking your spelling`;

  const getFormDataHandler = (data) => {
    setFormData((prevState) => {
      return {
        ...Object.fromEntries(Object.keys(prevState).map((key) => [key, ""])),
        ...data,
      };
    });

    closeRecipe();
  };

  useEffect(() => {
    if (!dailyLimitReached) {
      const start = (currentPage - 1) * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const end = currentPage * +process.env.REACT_APP_AMOUNT_PER_PAGE;
      const recipes = searchResult.slice(start, end);
      setRecipesPerPage(recipes);
      const amountOfPages = Math.ceil(
        searchResult.length / +process.env.REACT_APP_AMOUNT_PER_PAGE
      );
      if (currentPage === amountOfPages) setIsLastPage(true);
    }
  }, [searchResult, currentPage, dailyLimitReached]);

  useEffect(() => {
    const formDataIsEmpty = !Object.values(formData).join("");
    if (formDataIsEmpty) {
      return;
    }
    setCurrentPage(1);
    setSearchResultIsOpen(true);
    setRecipesIsLoading(true);

    if (!dailyLimitReached) {
      const requestUrl = `${
        process.env.REACT_APP_SPOONACULAR_API_URL
      }/recipes/complexSearch?apiKey=${
        process.env.REACT_APP_SPOONACULAR_API_KEY
      }&query=${formData.query}&cuisine=${formData.cuisine}&diet=${
        formData.diet
      }&intolerances=${formData.intolerance}&type=${formData.type}${
        formData.maxReadyTime && `&maxReadyTime=${formData.maxReadyTime}`
      }${formData.minCalories && `&minCalories=${formData.minCalories}`}${
        formData.maxCalories && `&maxCalories=${formData.maxCalories}`
      }&number=${RESULT_NUM}&addRecipeNutrition=true`;

      const getRecipes = (data) => {
        const recipes = data.results?.map((recipe) => {
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

        setSearchResult(recipes);
        setSearchResultIsOpen(true);
        setRecipesIsLoading(false);
      };

      getRecipeFromHttp({ url: requestUrl }, getRecipes);
    } else {
      const getRecipes = async () => {
        try {
          const recipeQuery = query(
            recipeRef,
            orderBy("nutrition"),
            limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
          );
          const [recipes, isLast] = await getRecipesFromFirebase(recipeQuery);

          setIsLastPage(isLast);
          setRecipesPerPage(recipes);
          setSearchResultIsOpen(true);
          setRecipesIsLoading(false);
        } catch (error) {
          setRecipesIsLoading(false);
          throwAsyncError(error);
        }
      };
      getRecipes();
    }
  }, [
    formData,
    throwAsyncError,
    dailyLimitReached,
    getRecipesFromFirebase,
    getRecipeFromHttp,
  ]);

  useEffect(() => {
    return () => {
      closeRecipe();
    };
  }, [closeRecipe]);

  const nextPageHandler = async () => {
    if (!dailyLimitReached) {
      setCurrentPage((prevState) => prevState + 1);
    } else {
      try {
        setRecipesIsLoading(true);
        setCurrentPage((prevState) => prevState + 1);

        const recipeQuery = query(
          recipeRef,
          orderBy("nutrition"),
          startAt(lastVisible),
          limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
        );

        const [recipes, isLast] = await getRecipesFromFirebase(recipeQuery);
        setIsLastPage(isLast);
        setRecipesPerPage(recipes);
        setSearchResultIsOpen(true);
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
          recipeRef,
          orderBy("nutrition"),
          endAt(firstVisible),
          limitToLast(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1)
        );
        const [recipes] = await getRecipesFromFirebase(recipeQuery);

        setRecipesPerPage(recipes);
        setSearchResultIsOpen(true);
        setRecipesIsLoading(false);
      } catch (error) {
        setRecipesIsLoading(false);
        throwAsyncError(error);
      }
    }
  };

  return (
    <>
      <section
        className={`${classes["section-search"]} ${
          searchResultIsOpen ? classes.mt0 : ""
        }`}
      >
        {!searchResultIsOpen && <Logo />}
        <SearchBox getFormData={getFormDataHandler} />
      </section>
      <section
        className={`${classes["section-content"]} ${
          recipeIsOpen ? classes["recipe-columns"] : ""
        }`}
      >
        <div>
          {searchResultIsOpen && (
            <Suspense fallback={<Spinner />}>
              <ErrorBoundary>
                <RecipeItemList
                  data={recipesPerPage}
                  query={formData.query}
                  epmtyMessage={epmtyMessage}
                  nextPage={nextPageHandler}
                  prevPage={prevPageHandler}
                  isLastPage={isLastPage}
                  currentPage={currentPage}
                  recipesIsLoading={recipesIsLoading}
                />
              </ErrorBoundary>
            </Suspense>
          )}
        </div>

        {recipeIsOpen && (
          <Suspense fallback={<Spinner />}>
            <ErrorBoundary key={recipeId}>
              <Recipe />
            </ErrorBoundary>
          </Suspense>
        )}
      </section>
    </>
  );
};

export default Homepage;
