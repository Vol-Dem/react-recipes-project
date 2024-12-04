import { useEffect } from "react";
import Card from "./Card";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import CrossSvg from "../../assets/CrossSvg";
import { motion } from "framer-motion";

const Modal = (props) => {
  const { title, className, onClose, disableClass } = props;
  useEffect(() => {
    const scrollTop = document.documentElement.scrollTop;
    const disableScrollHandler = (e) => {
      window.scrollTo(0, scrollTop);
    };
    window.addEventListener("scroll", disableScrollHandler);
    return () => {
      window.removeEventListener("scroll", disableScrollHandler);
    };
  }, []);

  return (
    <>
      {createPortal(
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
            layout
            variants={{
              hidden: { opacity: 0, y: "-30%", x: "-50%" },
              visible: { opacity: 1, y: "-50%", x: "-50%" },
              exit: { opacity: 0, y: "-30%", x: "-50%" },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            // transition={{ type: "spring", duration: 0.3 }}
            className={`${classes.modal} ${classes["modal--content"]} ${
              className ? className : ""
            }`}
          >
            <Card>
              {title && <h2 className={classes.title}>{title}</h2>}
              {props.children}
              <button className={classes["modal__close"]} onClick={onClose}>
                <CrossSvg />
              </button>
            </Card>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Modal;
