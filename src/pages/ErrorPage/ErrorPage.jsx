import { NavLink, useRouteError } from "react-router-dom";
import Card from "../../shared/components/ui/Card/Card";
import classes from "./ErrorPage.module.scss";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <section className={classes["error-page"]}>
      <Card className={classes["error-card"]}>
        <h1 className={classes["error-page__title"]}>{error.status}</h1>
        <p className={classes["error-page__subtitle"]}>
          Sorry, an unexpected error has occurred.
        </p>
        <p className={classes["error-page__message"]}>
          <i>{error.statusText || error.message}</i>
        </p>
        {error.status === 404 && (
          <NavLink to="/" className={classes["error-page__link"]}>
            Home
          </NavLink>
        )}
      </Card>
    </section>
  );
};

export default ErrorPage;
