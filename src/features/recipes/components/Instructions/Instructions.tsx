import classes from "./Instructions.module.scss";

const Instructions = ({ instructions }: { instructions?: string }) => {
  return (
    <p className={classes["recipe__instructions"]}>
      {instructions?.replace(/(<([^>]+)>)/gi, "")}
    </p>
  );
};

export default Instructions;
