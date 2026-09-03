import classes from "./Ingredients.module.scss";
import { useId, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { Ingredient } from "../../types";

const IngredientName = ({ name }: { name: string }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const tooltipId = useId();

  if (name.length <= 20) {
    return <span>{name}</span>;
  }

  const shortName = `${name.split(" ").slice(0, 2).join(" ")}... (?)`;
  const tooltipIsVisible = isFocused || isHovered || isPinned;

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "mouse") {
      setIsHovered(true);
    }
  };
  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "mouse") {
      setIsHovered(false);
    }
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isPinned) {
      setIsPinned(false);
      event.currentTarget.blur();
      return;
    }

    setIsPinned(true);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setIsPinned(false);
      event.currentTarget.blur();
    }
  };
  const handleBlur = () => {
    setIsFocused(false);
    setIsPinned(false);
  };

  return (
    <span
      className={`${classes["recipe__ingredients-name"]} ${
        tooltipIsVisible ? classes["recipe__ingredients-name--visible"] : ""
      }`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        type="button"
        className={classes["recipe__ingredients-name-button"]}
        aria-label={`Full ingredient name: ${name}`}
        aria-expanded={tooltipIsVisible}
        aria-controls={tooltipId}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
      >
        {shortName}
      </button>
      <span
        id={tooltipId}
        className={classes["recipe__ingredients-name-fullname"]}
        aria-hidden="true"
      >
        {name}
      </span>
    </span>
  );
};

const Ingredients = ({ ingredients }: { ingredients?: Ingredient[] }) => {
  return (
    <div>
      <ul className={classes["recipe__ingredients"]}>
        {ingredients?.map((ingredient, i) => {
          let amount: number | string = ingredient.amount;
          if (amount % 1 !== 0) {
            amount = amount.toFixed(1);
          }
          return (
            <li key={ingredient.id + `${i}`}>
              <IngredientName name={ingredient.name} />
              <span className={classes["recipe__ingredients-dots"]}></span>
              <span>
                {amount} {ingredient.unit}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Ingredients;
