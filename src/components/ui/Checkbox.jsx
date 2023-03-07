import classes from "./Checkbox.module.css";

const Checkbox = (props) => {
  return (
    <div>
      <label htmlFor={props.value} className={classes.label}>
        <input
          type="checkbox"
          id={props.value}
          value={props.value}
          name={props.name}
          className={classes.checkbox}
        />
        {props.value}
      </label>
    </div>
  );
};

export default Checkbox;
