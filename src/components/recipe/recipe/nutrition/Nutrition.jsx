import classes from "./Nutrition.module.scss";

const Nutrition = ({ nutrition, nutrients }) => {
  return (
    <>
      <ul className={classes["recipe__nutrition"]}>
        {nutrients.map((nutrient) => {
          return (
            <li key={nutrient}>
              <span className={classes["recipe__nutrition-amount"]}>
                {nutrition?.nutrients
                  .find(
                    ({ name }) =>
                      name === nutrient[0].toUpperCase() + nutrient.slice(1)
                  )
                  ?.amount.toFixed() || "??"}
              </span>
              <span className={classes["recipe__nutrition-unit"]}>kcal</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Nutrition;
