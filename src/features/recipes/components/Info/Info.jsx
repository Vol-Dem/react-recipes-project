import classes from "./Info.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import ServingsIcon from "../../../../assets/icons/servings.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { sendFav } from "../../../favorites/store/favoritesSlice";
import { authActions } from "../../../auth/store/authSlice";
import StarIcon from "../../../../assets/icons/star.svg?react";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";

const Info = ({ readyInMinutes, servings, recipeId }) => {
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const dispatch = useDispatch();
  const addToFavoristes = () => {
    if (!isAuth) {
      dispatch(authActions.openAuthForm());
    } else {
      dispatch(sendFav(+recipeId));
    }
  };
  const favList = useSelector((state) => state.fav.favList);
  const isFav = isAuth && favList.includes(+recipeId);

  return (
    <div className={classes["recipe__info"]}>
      <div className={classes["recipe__params"]}>
        <div className={classes["recipe__param"]}>
          <ClockIcon /> {readyInMinutes} min
        </div>
        <div className={classes["recipe__param"]}>
          <ServingsIcon /> {servings} servings
        </div>
      </div>
      <div className={classes["recipe__actions"]}>
        <StarIcon
          onClick={addToFavoristes}
          className={`${classes["recipe__fav"]} ${
            isFav ? classes["recipe__fav--active"] : ""
          }`}
        />
      </div>
    </div>
  );
};

export default Info;
