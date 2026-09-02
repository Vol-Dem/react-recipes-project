"use client";

import classes from "./ErrorFallback.module.scss";
import Link from "next/link";

const reloadPage = () => window.location.reload();

const ErrorFallback = ({
  heading,
  message,
  showReloadButton = true,
  status,
}) => (
  <section
    aria-labelledby="error-heading"
    className={classes["error-page"]}
    role="alert"
  >
    <div className={classes["error-card"]}>
      <p className={classes["error-page__status"]}>{status}</p>
      <h1 id="error-heading" className={classes["error-page__heading"]}>
        {heading}
      </h1>
      <p className={classes["error-page__message"]}>{message}</p>
      <div className={classes["error-page__actions"]}>
        <Link href="/" className={classes["error-page__link"]}>
          Home
        </Link>
        {showReloadButton && (
          <button
            type="button"
            className={classes["error-page__reload"]}
            onClick={reloadPage}
          >
            Reload page
          </button>
        )}
      </div>
    </div>
  </section>
);

export default ErrorFallback;
