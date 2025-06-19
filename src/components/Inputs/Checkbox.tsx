import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';
import InputHelper from './InputHelper';

export interface CheckboxRef {
  element: HTMLInputElement | null;
  value: boolean;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'placeholder' | 'required' | 'value'
  > {
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  inputRef?:
    | React.RefObject<CheckboxRef | null>
    | React.RefCallback<CheckboxRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  loading?: boolean;
  width?: number;
}

/**
 * Checkboxes allow the user to turn an option on or off. 
 */
const Checkbox = ({
  label = '',
  labelPosition = 'right',
  checked: valueProp,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  helperText,
  disabled: disabledProp = false,
  className,
  inputRef,
  size = 'default',
  error: errorProp,
  loading = false,
  width,
  'aria-label': ariaLabel,
  ...props
}: CheckboxProps) => {
  const elementRef = React.useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = React.useState(defaultChecked);
  const [isFocused, setIsFocused] = React.useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => {
      elementRef.current?.focus();
    },
    reset: () => {
      setInternalValue(defaultChecked);
    },
    disabled,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const newChecked = e.target.checked;
      onChange?.(newChecked);
      if (!isControlled) {
        setInternalValue(newChecked);
      }
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const id = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined;

  return (
    <div className={className} style={width ? { width } : undefined}>
      <label
        className={cx('flex w-fit', {
          'cursor-not-allowed opacity-50': disabled,
          'cursor-pointer': !disabled,
          'gap-0.5 items-center':
            (labelPosition === 'top' || labelPosition === 'bottom') &&
            size === 'default',
          'gap-1.5 items-center':
            (labelPosition === 'top' || labelPosition === 'bottom') &&
            size === 'large',
          'flex-col-reverse': labelPosition === 'top',
          'flex-col': labelPosition === 'bottom',
          'gap-2 && h-[42px]':
            (labelPosition === 'left' || labelPosition === 'right') &&
            size === 'default',
          'gap-2 && h-[64px]':
            (labelPosition === 'left' || labelPosition === 'right') &&
            size === 'large',
          'flex-row-reverse': labelPosition === 'left',
          'flex-row': labelPosition === 'right',
        })}
      >
        <div
          role="checkbox"
          aria-checked="true"
          aria-disabled="false"
          aria-label={ariaLabel}
          className={cx(
            'shrink-0rounded-md border flex justify-center items-center transition-all box-border relative',
            {
              'w-5 h-5': size === 'default',
              'w-7 h-7': size === 'large',
              'bg-neutral-20 dark:bg-neutral-20-dark border-neutral-40 dark:border-neutral-40-dark':
                disabled,
              'bg-neutral-10 dark:bg-neutral-10-dark border-neutral-50 dark:border-neutral-50-dark hover:border-primary-main dark:hover:border-primary-main-dark':
                !disabled,
              'bg-primary-main dark:bg-primary-main-dark border-primary-main dark:border-primary-main-dark':
                !disabled && value && !indeterminate,
              'ring-3 ring-primary-focus': isFocused,
            },
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); // Prevent scrolling
              handleChange({
                target: { checked: !value },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
        >
          <input
            id={id}
            tabIndex={!disabled ? 0 : -1}
            type="checkbox"
            className="hidden"
            checked={value}
            onChange={handleChange}
            disabled={disabled}
            aria-label={ariaLabel}
            ref={elementRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {loading && (
            <Icon
              name="loader"
              animation="spin"
              strokeWidth={2}
              className="text-neutral-70 dark:text-neutral-70-dark"
            />
          )}
          {!loading && value && !indeterminate && (
            <Icon
              name="check"
              strokeWidth={4}
              size={size === 'default' ? 14 : 18}
              className={cx({
                'text-neutral-10 dark:text-neutral-10-dark': !disabled,
                'text-neutral-60 dark:text-neutral-60-dark': disabled,
              })}
            />
          )}
          {!loading && !value && indeterminate && (
            <span className="absolute w-2.5 h-2.5 rounded-sm bg-primary-main dark:bg-primary-main-dark" />
          )}
        </div>
        {!!label && (
          <span
            className={cx('text-neutral-90 dark:text-neutral-90-dark', {
              'text-14px': size === 'default',
              'text-18px': size === 'large',
            })}
          >
            {label}
          </span>
        )}
      </label>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

Checkbox.isFormInput = true;

export default Checkbox;
