import classes from "./Card.module.scss";
import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return <div className={`${classes.card} ${className || ""}`}>{children}</div>;
};

export default Card;
