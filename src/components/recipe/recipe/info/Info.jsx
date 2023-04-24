import classes from "./Info.module.scss";
import { ReactComponent as ClockIcon } from "./../../../../assets/clock.svg";
import { ReactComponent as ServingsIcon } from "./../../../../assets/servings.svg";
import { useDispatch, useSelector } from "react-redux";
import { sendFav } from "../../../../store/fav";
import { authActions } from "../../../../store/auth";
import { ReactComponent as StarIcon } from "./../../../../assets/star.svg";

const Info = ({ readyInMinutes, servings, recipeId }) => {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const addToFavoristes = () => {
    if (!isAuth) {
      dispatch(authActions.openAuthForm());
    } else {
      dispatch(sendFav(recipeId));
    }
  };
  const favList = useSelector((state) => state.fav.favList);
  const isFav = isAuth && favList.includes(recipeId);

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
