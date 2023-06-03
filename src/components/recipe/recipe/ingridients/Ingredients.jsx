import classes from "./Ingredients.module.scss";

const Ingredients = ({ ingredients }) => {
  return (
    <div>
      <ul className={classes["recipe__ingredients"]}>
        {ingredients?.map((ingredient, i) => {
          let amount = ingredient.amount;
          if (amount % 1 !== 0) {
            amount = amount.toFixed(1);
          }
          const name = ingredient.name;
          let shortName;
          let nameArr = name.split(" ");
          if (name.length > 20) {
            nameArr.length = 2;
            shortName = nameArr.join(" ") + "... (?)";
          } else {
            shortName = name;
          }

          return (
            <li key={ingredient.id + `${i}`}>
              <span className={classes["recipe__ingredients-name"]}>
                {shortName}
                {name.length > 20 && (
                  <span
                    className={classes["recipe__ingredients-name-fullname"]}
                  >
                    {name}
                  </span>
                )}
              </span>
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
