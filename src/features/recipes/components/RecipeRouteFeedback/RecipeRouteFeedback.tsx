"use client";

import { useRouter } from "next/navigation";
import Card from "../../../../shared/components/ui/Card/Card";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import { useRecipeList } from "../../context/RecipeListContext";
import classes from "./RecipeRouteFeedback.module.scss";

interface RecipeRouteFeedbackProps {
  message: string;
  onRetry?: () => void;
}

const RecipeRouteFeedback = ({
  message,
  onRetry,
}: RecipeRouteFeedbackProps) => {
  const router = useRouter();
  const { listHref } = useRecipeList();

  return (
    <Card>
      <ErrorMessage>{message}</ErrorMessage>
      <div className={classes.actions}>
        <ButtonSecondary
          onClick={() => router.push(listHref, { scroll: false })}
        >
          Back to list
        </ButtonSecondary>
        {onRetry && (
          <ButtonSecondary onClick={onRetry}>Try again</ButtonSecondary>
        )}
      </div>
    </Card>
  );
};

export default RecipeRouteFeedback;
