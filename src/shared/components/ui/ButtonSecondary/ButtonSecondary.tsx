import classes from "./ButtonSecondary.module.scss";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonSecondaryProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

const ButtonSecondary = ({
  children,
  className,
  disabled,
  onClick,
  type = "button",
}: ButtonSecondaryProps) => {
  return (
    <button
      className={`${classes["btn-secondary"]} ${className || ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
