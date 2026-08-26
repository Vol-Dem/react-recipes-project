import classes from "./Credits.module.scss";

const Credits = ({ text, sourceName, sourceUrl }) => {
  return (
    <footer className={classes["recipe__credits"]}>
      <p>
        Source: {text} - <a href={sourceUrl}>{sourceName}</a>
      </p>
    </footer>
  );
};

export default Credits;
