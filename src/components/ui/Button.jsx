import classes from "./Button.module.scss";
import { motion } from "framer-motion";

const Button = ({ button, children, className, disabled, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, transition: { type: "spring" } }}
      whileTap={{ scale: 0.95 }}
      className={`${classes.btn} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...button}
    >
      {children}
    </motion.button>
  );
};

export default Button;
