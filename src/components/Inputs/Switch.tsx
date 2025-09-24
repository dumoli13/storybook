import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

export interface SwitchRef {
  element: HTMLInputElement | null;
  value: boolean;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'defaultChecked' | 'onChange' | 'size' | 'required'
  > {
  defaultChecked?: boolean;
  initialChecked?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (checked: boolean) => void;
  helperText?: React.ReactNode;
  inputRef?:
    | React.RefObject<SwitchRef | null>
    | React.RefCallback<SwitchRef | null>;
  size?: 'default' | 'large';
  fullWidth?: boolean;
  error?: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
  width?: number;
  loading?: boolean;
  required?: boolean;
}

/**
 * The Switch component is used for toggling between two states. Most commonly used for setting on or off.
 */
const Switch = ({
  id,
  name,
  defaultChecked,
  initialChecked = false,
  checked: checkedProp,
  label,
  labelPosition = 'top',
  onChange,
  className,
  helperText,
  disabled: disabledProp = false,
  inputRef,
  size = 'default',
  fullWidth = false,
  error: errorProp,
  trueLabel = 'Yes',
  falseLabel = 'No',
  width,
  loading = false,
  required,
  ...props
}: SwitchProps) => {
  const elementRef = React.useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked || initialChecked,
  );
  const isControlled = checkedProp !== undefined;
  const value = isControlled ? checkedProp : internalChecked;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => elementRef.current?.focus(),
    reset: () => setInternalChecked(initialChecked),
    disabled,
  }));

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  const handleChange = () => {
    const newChecked = !value;
    onChange?.(newChecked);
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
  };

  const inputId = `switch-${id || name}-${React.useId()}`;

  return (
    <div
      className={cx(
        'relative',
        {
          'w-full': fullWidth,
        },
        className,
      )}
      style={width ? { width } : undefined}
    >
      <div
        className={cx(
          'relative flex text-neutral-90 dark:text-neutral-90-dark',
          {
            'flex-col gap-0.5': labelPosition === 'top',
            'flex items-center gap-4': labelPosition === 'left',
          },
        )}
      >
        {label && (
          <InputLabel id={inputId} size={size} required={required}>
            {label}
          </InputLabel>
        )}
        <div
          role="button"
          tabIndex={!disabled ? 0 : -1}
          className={cx(
            'w-fit flex items-center gap-2.5 border rounded-md focus:ring-3',
            {
              'bg-neutral-20 dark:bg-neutral-20-dark opacity-50':
                loading || disabled,
              'cursor-default': loading,
              'cursor-not-allowed': disabled,
              'p-[7px]': size === 'default',
              'p-[11px]': size === 'large',
              'border-neutral-40 dark:border-neutral-40-dark focus:ring-primary-focus dark:focus:ring-primary-focus-dark bg-neutral-10 dark:bg-neutral-10-dark cursor-pointer hover:border-primary-hover dark:hover:border-primary-hover-dark':
                !isError && !loading && !disabled,
              'border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
                isError,
            },
          )}
          onMouseDown={!loading && !disabled ? handleChange : undefined}
          onKeyDown={(e) => {
            if (!loading && !disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault(); // Prevent default scroll on Space key
              handleChange();
            }
          }}
        >
          <input
            {...props}
            tabIndex={!disabled ? 0 : -1}
            id={inputId}
            type="checkbox"
            className="sr-only"
            checked={value}
            readOnly
            ref={elementRef}
          />
          {loading ? (
            <div
              className={cx(
                'rounded-full transition-colors relative bg-neutral-50 dark:bg-neutral-50-dark',
                {
                  'w-7 h-4': size === 'default',
                  'w-8 h-5': size === 'large',
                },
              )}
            >
              <div className="absolute left-0.5 top-0.5 transition-transform duration-500 translate-x-1.5 text-neutral-10 dark:text-neutral-10-dark">
                <Icon
                  name="loader"
                  size={size === 'default' ? 12 : 16}
                  animation="spin"
                  strokeWidth={4}
                />
              </div>
            </div>
          ) : (
            <div
              className={cx('rounded-full transition-colors relative', {
                'w-7 h-4': size === 'default',
                'w-8 h-5': size === 'large',
                'bg-neutral-40 dark:bg-neutral-40-dark': !value && !disabled,
                'bg-primary-main dark:bg-primary-main-dark': value && !disabled,
                'bg-neutral-60 dark:bg-neutral-60-dark cursor-not-allowed':
                  disabled,
              })}
            >
              <div
                className={cx(
                  'absolute left-0.5 top-0.5 rounded-full bg-neutral-10 dark:bg-neutral-10-dark transition-all duration-500',
                  {
                    'translate-x-3': value,
                    'w-3 h-3': size === 'default',
                    'w-4 h-4': size === 'large',
                  },
                )}
              />
            </div>
          )}

          <div
            className={cx('min-w-5', {
              'text-12px': size === 'default',
              'text-16px': size === 'large',
            })}
          >
            {value ? trueLabel : falseLabel}
          </div>
        </div>
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

Switch.isFormInput = true;

export default Switch;
