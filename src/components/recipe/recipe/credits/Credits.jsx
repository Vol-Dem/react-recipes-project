import classes from "./Credits.module.scss";

const Credits = ({ credits }) => {
  const { creditsText, sourceUrl, sourceName } = credits;

  return (
    <footer className={classes["recipe__credits"]}>
      <p>
        Source: {creditsText} - <a href={sourceUrl}>{sourceName}</a>
      </p>
    </footer>
  );
};

export default Credits;
