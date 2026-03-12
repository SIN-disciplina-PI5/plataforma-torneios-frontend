import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  toggle: () => void;
}

const Button = ({ toggle }: ButtonProps) => {
  return (
    <button className={styles.button} onClick={toggle}>
      Menu
    </button>
  );
};

export default Button;