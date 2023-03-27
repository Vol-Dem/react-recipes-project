import classes from "./Diets.module.scss";

const Diets = ({ diets }) => {
  return (
    <ul className={classes["recipe__diets"]}>
      {diets?.map((diet, i) => (
        <li key={diet}>
          {i !== 0 ? "/  " : ""}
          {diet}
        </li>
      ))}
    </ul>
  );
};

export default Diets;
