import Card from "../Card/Card";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import CloseIcon from "../../../../assets/icons/CloseIcon";
import { motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const MODAL_BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const MODAL_CONTENT_VARIANTS = {
  hidden: { opacity: 0, x: "-50%", y: "-30%" },
  visible: { opacity: 1, x: "-50%", y: "-50%" },
  exit: { opacity: 0, x: "-50%", y: "-30%" },
};

const Modal = ({
  ariaLabel = "Dialog",
  children,
  className,
  disableClass,
  labelledBy,
  onClose,
  title,
}) => {
  const dialogRef = useRef(null);
  const generatedTitleId = useId();
  const titleId = labelledBy || (title ? generatedTitleId : undefined);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const appRoot = document.getElementById("app-root");
    const appWasInert = appRoot?.inert;

    if (appRoot) {
      appRoot.inert = true;
    }

    const initialFocusTarget =
      dialogRef.current?.querySelector(FOCUSABLE_ELEMENTS) || dialogRef.current;
    initialFocusTarget?.focus();

    return () => {
      if (appRoot) {
        appRoot.inert = appWasInert;
      }

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll(FOCUSABLE_ELEMENTS),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return createPortal(
    <div className={`${disableClass || ""}`}>
      <motion.div
        variants={MODAL_BACKDROP_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${classes.modal} ${classes["modal--backdrop"]}`}
        onClick={onClose}
      ></motion.div>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={titleId ? undefined : ariaLabel}
        aria-labelledby={titleId}
        tabIndex="-1"
        layout
        variants={MODAL_CONTENT_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${classes.modal} ${classes["modal--content"]} ${
          className ? className : ""
        }`}
        onKeyDown={handleKeyDown}
      >
        <Card>
          {title && (
            <h2 id={generatedTitleId} className={classes.title}>
              {title}
            </h2>
          )}
          {children}
          <button
            type="button"
            className={classes["modal__close"]}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </Card>
      </motion.div>
    </div>,
    document.body,
  );
};

export default Modal;
