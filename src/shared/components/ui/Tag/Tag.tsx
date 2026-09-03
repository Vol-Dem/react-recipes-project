import classes from "./Tag.module.scss";
import type { MouseEventHandler, PropsWithChildren } from "react";

interface TagProps extends PropsWithChildren {
  query: string;
  type: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const Tag = ({ children, query, type, onClick }: TagProps) => {
  return (
    <button
      type="button"
      data-query={query}
      data-type={type}
      className={classes.tag}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Tag;
