import React from "react";
import cx from "classnames";

interface InputLabelProps {
  id?: string;
  children: string;
  size?: "default" | "large";
  required?: boolean;
}

function InputLabel({
  id,
  children,
  size = "default",
  required,
}: Readonly<InputLabelProps>) {
  return (
    <label
      htmlFor={id}
      className={cx(
        "shrink-0 block text-left text-neutral-80 dark:text-neutral-100-dark mb-1",
        {
          "text-12px": size === "default",
          "text-16px": size === "large",
        }
      )}
    >
      {children}
      {required && (
        <span className="text-danger-main dark:text-danger-main-dark">*</span>
      )}
    </label>
  );
}

export default InputLabel;
