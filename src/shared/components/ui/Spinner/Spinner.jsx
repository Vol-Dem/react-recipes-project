import classes from "./Spinner.module.scss";

const Spinner = ({ label = "Loading", size = "big" }) => {
  return (
    <div
      className={`${classes.spinner} ${classes[size]}`}
      role="status"
      aria-label={label}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
