import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';

interface InputEndIconWrapperProps {
  loading?: boolean;
  error?: boolean;
  success?: boolean;
  clearable?: boolean;
  onClear?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const InputEndIconWrapper = ({
  loading = false,
  error = false,
  success = false,
  clearable = false,
  onClear,
  endIcon,
  children,
}: InputEndIconWrapperProps) => {
  return (
    <div className="flex gap-0.5 items-center">
      {children}
      {clearable && (
        <Icon
          name="x-mark"
          size={18}
          strokeWidth={2}
          onClick={onClear}
          className="rounded-full p-[3px] text-neutral-70 dark:text-neutral-70-dark hover:bg-neutral-30 dark:hover:bg-neutral-30-dark cursor-pointer transition-color"
        />
      )}
      {loading && (
        <Icon
          name="loader"
          animation="spin"
          strokeWidth={2}
          className="text-neutral-70 dark:text-neutral-70-dark"
        />
      )}
      {success && (
        <Icon
          name="check"
          strokeWidth={3}
          size={12}
          className="shrink-0 rounded-full bg-success-main dark:bg-success-main-dark text-neutral-10 dark:text-neutral-10-dark flex items-center justify-center p-0.5 m-0.5"
        />
      )}
      {error && (
        <div className="h-4 w-4 text-12px shrink-0 rounded-full bg-danger-main dark:bg-danger-main-dark text-neutral-10 dark:text-neutral-10-dark font-bold flex items-center justify-center leading-none">
          !
        </div>
      )}
      {!!endIcon && (
        <div className={cx('text-neutral-70 dark:text-neutral-70-dark')}>
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default InputEndIconWrapper;
