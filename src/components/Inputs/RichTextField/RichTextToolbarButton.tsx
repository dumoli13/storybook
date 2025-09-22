import React from 'react';
import cx from 'classnames';

interface RichTextToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const RichTextToolbarButton = ({
  active,
  onClick,
  children,
  disabled = false,
}: RichTextToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cx(
      'shrink-0 h-8 w-8 rounded-md text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-20-dark disabled:cursor-not-allowed',
      {
        '!bg-primary-surface !dark:bg-primary-surface-dark': active,
        'hover:border border-neutral-40 dark:border-neutral-40-dark': !disabled,
      },
    )}
  >
    {children}
  </button>
);

export default RichTextToolbarButton;
