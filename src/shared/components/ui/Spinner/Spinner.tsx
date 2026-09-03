import classes from "./Spinner.module.scss";

interface SpinnerProps {
  label?: string;
  size?: "big" | "small";
}

const Spinner = ({ label = "Loading", size = "big" }: SpinnerProps) => {
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
