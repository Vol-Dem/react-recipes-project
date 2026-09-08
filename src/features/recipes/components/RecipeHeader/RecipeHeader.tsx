import FoodImg from "../../../../assets/icons/food.svg?react";
import ButtonBack from "../../../../shared/components/ui/ButtonBack/ButtonBack";
import Image from "../../../../shared/components/ui/Image/Image";
import Diets from "../Diets/Diets";
import classes from "./RecipeHeader.module.scss";
import {
  RECIPE_HEADER_IMAGE_HEIGHT,
  RECIPE_HEADER_IMAGE_SIZES,
  RECIPE_HEADER_IMAGE_WIDTH,
} from "../../constants/images";

interface RecipeHeaderProps {
  diets: string[];
  image: string;
  onBack: () => void;
  showBackButton: boolean;
  title: string;
}

const RecipeHeader = ({
  diets,
  image,
  onBack,
  showBackButton,
  title,
}: RecipeHeaderProps) => {
  return (
    <div className={`${classes["recipe__head"]} ${classes["animation-show"]}`}>
      {showBackButton && <ButtonBack onClick={onBack} />}
      <Diets diets={diets} />
      <h1 className={classes["recipe__title"]}>{title}</h1>
      <div className={classes["recipe__img-container"]}>
        <Image
          src={image}
          alt={title}
          width={RECIPE_HEADER_IMAGE_WIDTH}
          height={RECIPE_HEADER_IMAGE_HEIGHT}
          sizes={RECIPE_HEADER_IMAGE_SIZES}
          loading="eager"
          fallback={
            <FoodImg
              className={classes["default-img"]}
              aria-hidden="true"
              focusable="false"
            />
          }
        />
      </div>
    </div>
  );
};

export default RecipeHeader;
