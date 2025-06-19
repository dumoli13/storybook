import React from 'react';
import cx from 'classnames';

interface InputHelperProps {
  message?: React.ReactNode;
  error: boolean;
  size: 'default' | 'large';
}

function InputHelper({ message, error, size }: Readonly<InputHelperProps>) {
  return message ? (
    <div
      className={cx('w-full text-left mt-1', {
        'text-danger-main dark:text-danger-main-dark': error,
        'text-neutral-60 dark:text-neutral-60-dark': !error,
        'text-12px': size === 'default',
        'text-16px': size === 'large',
      })}
    >
      {message}
    </div>
  ) : null;
}

export default InputHelper;
