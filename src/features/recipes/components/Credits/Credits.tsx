import classes from "./Credits.module.scss";

interface CreditsProps {
  text: string;
  sourceName: string;
  sourceUrl: string;
}

const Credits = ({ text, sourceName, sourceUrl }: CreditsProps) => {
  return (
    <footer className={classes["recipe__credits"]}>
      <p>
        Source: {text} - <a href={sourceUrl}>{sourceName}</a>
      </p>
    </footer>
  );
};

export default Credits;
