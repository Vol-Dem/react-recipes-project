import classes from "./Nutrition.module.scss";
import type { Nutrient } from "../../types";

interface NutritionProps {
  nutrition?: { nutrients: Nutrient[] };
  nutrients: { nutrient: string; unit: string }[];
}

const Nutrition = ({ nutrition, nutrients }: NutritionProps) => {
  return (
    <>
      <ul className={classes["recipe__nutrition"]}>
        {nutrients.map((element) => {
          return (
            <li key={element.nutrient}>
              <span className={classes["recipe__nutrition-amount"]}>
                {nutrition?.nutrients
                  .find(
                    ({ name }) =>
                      name ===
                      element.nutrient[0].toUpperCase() +
                        element.nutrient.slice(1),
                  )
                  ?.amount.toFixed() || "??"}
              </span>
              <span className={classes["recipe__nutrition-unit"]}>
                {element.unit}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Nutrition;
