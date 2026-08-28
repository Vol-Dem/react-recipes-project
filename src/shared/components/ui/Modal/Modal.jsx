import Card from "../Card/Card";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import CloseIcon from "../../../../assets/icons/CloseIcon";
import { motion } from "framer-motion";

const Modal = ({ children, className, disableClass, onClose, title }) => {
  return createPortal(
    <div className={`${disableClass || ""}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${classes.modal} ${classes["modal--backdrop"]}`}
        onClick={onClose}
      ></motion.div>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        layout
        variants={{
          hidden: { opacity: 0, y: "-30%", x: "-50%" },
          visible: { opacity: 1, y: "-50%", x: "-50%" },
          exit: { opacity: 0, y: "-30%", x: "-50%" },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${classes.modal} ${classes["modal--content"]} ${
          className ? className : ""
        }`}
      >
        <Card>
          {title && <h2 className={classes.title}>{title}</h2>}
          {children}
          <button
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
