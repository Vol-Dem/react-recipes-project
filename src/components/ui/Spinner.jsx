import classes from "./Spinner.module.scss";

const Spinner = ({ size = "big" }) => {
  return (
    <div className={`${classes.spinner} ${classes[size]}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
