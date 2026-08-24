import classes from "./Card.module.scss";

const Card = ({ children, className }) => {
  return (
    <div className={`${classes.card} ${className || ""}`}>
      {children}
    </div>
  );
};

export default Card;
