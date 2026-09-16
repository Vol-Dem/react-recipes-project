import { ClockIcon, UsersIcon, StarIcon } from "@heroicons/react/24/outline";
import classes from "./Info.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useFavorites } from "../../../favorites/context/FavoritesContext";
import { authActions } from "../../../auth/store/authSlice";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";
import type { AppDispatch } from "../../../../app/store";

interface InfoProps {
  readyInMinutes: number;
  servings: number;
  recipeId: string | number;
}

const Info = ({ readyInMinutes, servings, recipeId }: InfoProps) => {
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteIds, pendingIds, isLoading, toggleFavorite } = useFavorites();
  const addToFavoristes = () => {
    if (!isAuth) {
      dispatch(authActions.openAuthForm());
    } else {
      toggleFavorite(+recipeId);
    }
  };
  const isFavorite = favoriteIds.includes(+recipeId);
  const isFav = isAuth && isFavorite;

  return (
    <div className={classes["recipe__info"]}>
      <div className={classes["recipe__params"]}>
        <div className={classes["recipe__param"]}>
          <ClockIcon aria-hidden="true" focusable="false" /> {readyInMinutes}{" "}
          min
        </div>
        <div className={classes["recipe__param"]}>
          <UsersIcon aria-hidden="true" focusable="false" /> {servings} servings
        </div>
      </div>
      <div className={classes["recipe__actions"]}>
        <button
          type="button"
          onClick={addToFavoristes}
          disabled={isAuth && (isLoading || pendingIds.includes(+recipeId))}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFav}
          className={`${classes["recipe__fav"]} ${
            isFav ? classes["recipe__fav--active"] : ""
          }`}
        >
          <StarIcon aria-hidden="true" focusable="false" />
        </button>
      </div>
    </div>
  );
};

export default Info;
