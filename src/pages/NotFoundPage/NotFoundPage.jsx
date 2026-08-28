import { NavLink } from "react-router-dom";
import Card from "../../shared/components/ui/Card/Card";
import classes from "../ErrorPage/ErrorPage.module.scss";
import { usePageSetup } from "../../shared/hooks/usePageSetup";

const NotFoundPage = ({ title }) => {
  usePageSetup(title);

  return (
    <section className={classes["error-page"]}>
      <Card className={classes["error-card"]}>
        <h1 className={classes["error-page__title"]}>404</h1>
        <p className={classes["error-page__subtitle"]}>Page not found.</p>
        <p className={classes["error-page__message"]}>
          The page you requested does not exist.
        </p>
        <NavLink to="/" className={classes["error-page__link"]}>
          Home
        </NavLink>
      </Card>
    </section>
  );
};

export default NotFoundPage;
