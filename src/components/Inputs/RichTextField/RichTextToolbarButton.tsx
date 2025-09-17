import React from "react";
import cx from "classnames";

interface RichTextToolbarButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const RichTextToolbarButton = ({
  active,
  onMouseDown,
  children,
}: RichTextToolbarButtonProps) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    className={cx(
      "shrink-0 h-8 w-8 hover:border border-neutral-40 dark:border-neutral-40-dark rounded-md",
      {
        "bg-neutral-30 dark:bg-neutral-30-dark": active,
        "bg-neutral-10 dark:bg-neutral-10-dark": !active,
      }
    )}
  >
    {children}
  </button>
);

export default RichTextToolbarButton;
