import { useRouteError } from "react-router-dom";
import Card from "../components/ui/Card";
import classes from "./ErrorPage.module.scss";

const PageNotFound = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <section className={classes["error-page"]}>
      <Card>
        <h1 className={classes["error-page__title"]}>{error.status}</h1>
        <p className={classes["error-page__subtitle"]}>
          Sorry, an unexpected error has occurred.
        </p>
        <p className={classes["error-page__message"]}>
          <i>{error.statusText || error.message}</i>
        </p>
      </Card>
    </section>
  );
};

export default PageNotFound;
