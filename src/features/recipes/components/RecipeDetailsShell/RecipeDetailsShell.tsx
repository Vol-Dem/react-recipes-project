import type { PropsWithChildren, ReactNode } from "react";
import Card from "../../../../shared/components/ui/Card/Card";
import classes from "./RecipeDetailsShell.module.scss";

interface RecipeDetailsShellProps extends PropsWithChildren {
  header: ReactNode;
}

const RecipeDetailsShell = ({ children, header }: RecipeDetailsShellProps) => (
  <Card>
    <article data-testid="recipe">
      <div className={classes["recipe__head-container"]}>{header}</div>
      {children}
    </article>
  </Card>
);

export default RecipeDetailsShell;
