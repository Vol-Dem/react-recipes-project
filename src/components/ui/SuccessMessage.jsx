import classes from "./SuccessMessage.module.scss";
import SuccessIcon from "../../assets/SuccessIcon";

const SuccessMessage = ({ children, className }) => {
  return (
    <div className={`${classes["success"]} ${className || ""}`}>
      <SuccessIcon />
      <span>{children}</span>
    </div>
  );
};

export default SuccessMessage;
