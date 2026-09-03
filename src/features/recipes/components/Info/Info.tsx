import classes from "./Info.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import ServingsIcon from "../../../../assets/icons/servings.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../../favorites/store/favoritesThunks";
import { authActions } from "../../../auth/store/authSlice";
import StarIcon from "../../../../assets/icons/star.svg?react";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";
import { selectIsFavorite } from "../../../favorites/store/favoritesSelectors";
import type { AppDispatch, RootState } from "../../../../app/store";

interface InfoProps {
  readyInMinutes: number;
  servings: number;
  recipeId: string | number;
}

const Info = ({ readyInMinutes, servings, recipeId }: InfoProps) => {
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const addToFavoristes = () => {
    if (!isAuth) {
      dispatch(authActions.openAuthForm());
    } else {
      dispatch(toggleFavorite(+recipeId));
    }
  };
  const isFavorite = useSelector((state: RootState) =>
    selectIsFavorite(state, +recipeId),
  );
  const isFav = isAuth && isFavorite;

  return (
    <div className={classes["recipe__info"]}>
      <div className={classes["recipe__params"]}>
        <div className={classes["recipe__param"]}>
          <ClockIcon aria-hidden="true" focusable="false" /> {readyInMinutes}{" "}
          min
        </div>
        <div className={classes["recipe__param"]}>
          <ServingsIcon aria-hidden="true" focusable="false" /> {servings}{" "}
          servings
        </div>
      </div>
      <div className={classes["recipe__actions"]}>
        <button
          type="button"
          onClick={addToFavoristes}
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
