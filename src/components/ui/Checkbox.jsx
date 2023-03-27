import classes from "./Checkbox.module.scss";

const Checkbox = ({ value, name }) => {
  return (
    <div>
      <label htmlFor={value} className={classes.label}>
        <input
          type="checkbox"
          id={value}
          value={value}
          name={name}
          className={classes.checkbox}
        />
        {value}
      </label>
    </div>
  );
};

export default Checkbox;
