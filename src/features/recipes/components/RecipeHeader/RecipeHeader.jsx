import { useEffect, useState } from "react";
import FoodImg from "../../../../assets/icons/food.svg?react";
import ButtonBack from "../../../../shared/components/ui/ButtonBack/ButtonBack";
import Diets from "../Diets/Diets";
import classes from "./RecipeHeader.module.scss";

const RecipeHeader = ({ diets, image, onBack, showBackButton, title }) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const imageClassName = `${classes["recipe__img"]} ${
    imageIsLoading ? classes["recipe__img--hidden"] : ""
  }`;

  useEffect(() => {
    setImageIsLoading(true);
  }, [image]);

  return (
    <div className={`${classes["recipe__head"]} ${classes["animation-show"]}`}>
      {showBackButton && <ButtonBack onClick={onBack} />}
      <Diets diets={diets} />
      <h1 className={classes["recipe__title"]}>{title}</h1>
      <div className={classes["recipe__img-container"]}>
        <img
          src={image}
          alt={title}
          className={imageClassName}
          onLoad={() => setImageIsLoading(false)}
        />
        {imageIsLoading && <FoodImg className={classes["default-img"]} />}
      </div>
    </div>
  );
};

export default RecipeHeader;
