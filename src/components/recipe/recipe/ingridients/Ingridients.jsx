import classes from "./Ingridients.module.scss";

const Ingridients = ({ ingridients }) => {
  return (
    <div>
      <ul className={classes["recipe__ingridients"]}>
        {ingridients?.map((ingridient) => (
          <li key={ingridient.id}>
            <span>{ingridient.name}</span>
            <span className={classes["recipe__ingridients-dots"]}></span>
            <span>
              {ingridient.amount} {ingridient.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingridients;
