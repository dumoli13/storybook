import React from 'react';
import cx from 'classnames';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

interface InputContainerProps {
  inputId: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  required?: boolean;
  className?: string;
  focused?: boolean;
  error?: boolean | string;
  success?: boolean;
  helperText?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  size?: 'default' | 'large';
  width?: number;
  parentRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const InputContainer = ({
  inputId,
  label,
  autoHideLabel,
  labelPosition,
  required,
  className,
  focused,
  error,
  success,
  helperText,
  disabled,
  size,
  width,
  parentRef,
  children,
}: InputContainerProps) => {
  const helperMessage = error && typeof error === 'string' ? error : helperText;
  const isError = !!error;

  return (
    <div
      className={cx(
        'relative w-full',
        {
          'flex items-center gap-4': labelPosition === 'left',
        },
        className,
      )}
    >
      {((autoHideLabel && focused) || !autoHideLabel) && label && (
        <InputLabel id={inputId} size={size} required={required}>
          {label}
        </InputLabel>
      )}
      <div
        className={cx('relative border rounded-md flex flex-col w-full', {
          'border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
            isError,
          'border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
            !isError && success,
          'border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark':
            !isError && !success && !disabled,
          'bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark':
            disabled,
          'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus focus:!border-primary-main':
            !disabled,
          'ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark':
            focused,
        })}
        style={width ? { width } : undefined}
        ref={parentRef}
      >
        {children}
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

export default InputContainer;
