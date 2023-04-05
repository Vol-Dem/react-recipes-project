import classes from "./Credits.module.scss";

const Credits = ({ credits }) => {
  const { creditsText, sourceUrl, sourceName } = credits;

  return (
    <div className={classes["recipe__credits"]}>
      <p>
        Source: {creditsText} - <a href={sourceUrl}>{sourceName}</a>
      </p>
    </div>
  );
};

export default Credits;
