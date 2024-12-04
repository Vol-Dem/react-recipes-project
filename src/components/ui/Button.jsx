import classes from "./Button.module.scss";
import { motion } from "framer-motion";

const Buttton = (props) => {
  const { className, disabled, onClick, button } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1, transition: { type: "spring" } }}
      whileTap={{ scale: 0.95 }}
      className={`${classes.btn} ${props.className || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
      {...button}
    >
      {props.children}
    </motion.button>
    // <button
    //   className={`${classes.btn} ${props.className || ""}`}
    //   onClick={props.onClick}
    //   disabled={props.disabled}
    // >
    //   {props.children}
    // </button>
  );
};

export default Buttton;
