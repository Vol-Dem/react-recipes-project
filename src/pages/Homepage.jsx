import classes from "./Homepage.module.scss";
import SearchBox from "../components/search/SearchBox";
import Logo from "../components/layout/logo/Logo";
import { useEffect } from "react";
import { RESULT_NUM } from "../variables/constants";
import { lazy } from "react";
import { Suspense } from "react";
import Spinner from "../components/ui/Spinner";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions, getRecipes } from "../store/recipe";
import { collection, getFirestore, limit } from "firebase/firestore";
import firebaseApp from "../config";
import ErrorMessage from "../components/ui/ErrorMessage";
import Card from "../components/ui/Card";

const RecipeItemList = lazy(() =>
  import("../components/recipe/recipe-item-list/RecipeItemList")
);

const firestore = getFirestore(firebaseApp);
const recipeRef = collection(firestore, "recipes");

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const errorMessage = useSelector((state) => state.recipe.errorMessage);
  const recipesIsLoading = useSelector(
    (state) => state.recipe.recipesIsLoading
  );
  const recipesPerPageIsEmpty = !!useSelector(
    (state) => state.recipe.recipesPerPage
  ).length;

  const getFormDataHandler = (data) => {
    const query = data.query || "";
    const cuisine = data.cuisine || "";
    const diet = data.diet || "";
    const intolerance = data.intolerance || "";
    const type = data.type || "";
    const maxReadyTime = data.maxReadyTime || "";
    const minCalories = data.minCalories || "";
    const maxCalories = data.maxCalories || "";

    const requestUrl = `${
      process.env.REACT_APP_SPOONACULAR_API_URL
    }/recipes/complexSearch?apiKey=${
      process.env.REACT_APP_SPOONACULAR_API_KEY
    }&query=${query}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerance}&type=${type}${
      maxReadyTime && `&maxReadyTime=${maxReadyTime}`
    }${minCalories && `&minCalories=${minCalories}`}${
      maxCalories && `&maxCalories=${maxCalories}`
    }&number=${RESULT_NUM}&addRecipeNutrition=true`;

    const title = query || "Search result";
    const emptyMessage = `No results for "${query}". Try checking your spelling`;
    const resultsAmount = limit(+process.env.REACT_APP_AMOUNT_PER_PAGE + 1);

    dispatch(recipeActions.setTitle(title));
    dispatch(recipeActions.setEmptyMessage(emptyMessage));
    dispatch(recipeActions.setOrderBy([]));
    dispatch(recipeActions.setCurrentPage(1));
    dispatch(getRecipes({ requestUrl, firebaseRef: recipeRef, resultsAmount }));
    navigate("/");
  };

  useEffect(() => {
    return () => {
      dispatch(recipeActions.resetRecipes());
      dispatch(recipeActions.setOrderBy([]));
      dispatch(recipeActions.setErrorMessage(""));
    };
  }, [dispatch]);

  return (
    <>
      <section
        data-testid="section-search"
        className={`${classes["section-search"]} ${
          recipesPerPageIsEmpty || recipeIsOpen ? classes.mt0 : ""
        }`}
      >
        {recipeIsOpen || (!recipesPerPageIsEmpty && <Logo />)}
        <SearchBox getFormData={getFormDataHandler} />
      </section>
      {errorMessage && (
        <Card>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Card>
      )}
      <section
        className={`${classes["section-content"]} ${
          recipeIsOpen && recipesPerPageIsEmpty ? classes["recipe-columns"] : ""
        }`}
      >
        {(recipesIsLoading || recipesPerPageIsEmpty) && (
          <Suspense fallback={<Spinner />}>
            <RecipeItemList firebaseRef={recipeRef} />
          </Suspense>
        )}

        <Outlet />
      </section>
    </>
  );
};

export default Homepage;
