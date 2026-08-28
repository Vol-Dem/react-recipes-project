import FoodImg from "../../../../assets/icons/food.svg?react";
import ButtonBack from "../../../../shared/components/ui/ButtonBack/ButtonBack";
import Image from "../../../../shared/components/ui/Image/Image";
import Diets from "../Diets/Diets";
import classes from "./RecipeHeader.module.scss";

const RecipeHeader = ({ diets, image, onBack, showBackButton, title }) => {
  return (
    <div className={`${classes["recipe__head"]} ${classes["animation-show"]}`}>
      {showBackButton && <ButtonBack onClick={onBack} />}
      <Diets diets={diets} />
      <h1 className={classes["recipe__title"]}>{title}</h1>
      <div className={classes["recipe__img-container"]}>
        <Image
          src={image}
          alt={title}
          fallback={<FoodImg className={classes["default-img"]} />}
        />
      </div>
    </div>
  );
};

export default RecipeHeader;
