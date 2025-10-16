import React from 'react';
import cx from 'classnames';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';
import { RadioGroupProps, SelectValue } from '../../types/inputs';

/**
 * RadioGroup components allow users to select one option from a set.
 */
const RadioGroup = <T, D = undefined>({
  value: valueProp,
  defaultValue,
  initialValue = null,
  id,
  name,
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  options,
  direction = 'column',
  onChange,
  helperText,
  disabled: disabledProp = false,
  fullWidth,
  inputRef,
  size = 'default',
  error: errorProp,
  success: successProp,
  loading = false,
  width,
  className,
  required,
  ...props
}: RadioGroupProps<T, D>) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);

  const [internalValue, setInternalValue] = React.useState<
    T | null | undefined
  >(defaultValue ?? initialValue);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const helperMessage =
    typeof errorProp === 'boolean' ? helperText : errorProp || helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value: options.find((option) => option.value === value) || null,
    focus: () => {
      const firstRadio = elementRef.current?.querySelector(
        'input[type="radio"]',
      );
      if (firstRadio instanceof HTMLInputElement) {
        firstRadio.focus();
      }
    },
    reset: () => setInternalValue(initialValue),
    disabled,
  }));

  const handleChange = (option: SelectValue<T, D>) => {
    if (disabled) return;

    onChange?.(option);
    if (!isControlled) {
      setInternalValue(option.value);
    }
  };

  const handleFocus = () => {
    if (disabled) return;
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const inputId = `radiogroup-${id || name}-${React.useId()}`;

  return (
    <div
      className={cx(
        'relative',
        {
          'w-full': fullWidth,
          'flex items-start gap-4': labelPosition === 'left',
        },
        className,
      )}
      ref={elementRef}
      style={width ? { width } : undefined}
      {...props}
    >
      {((autoHideLabel && focused) || !autoHideLabel) && label && (
        <InputLabel id={inputId} size={size} required={required}>
          {label}
        </InputLabel>
      )}

      <div
        className={cx('flex gap-2', {
          'w-full': fullWidth,
          'flex-row': direction === 'row',
          'flex-col': direction === 'column',
        })}
        role="radiogroup"
        aria-labelledby={label ? inputId : undefined}
      >
        {options.map((option, index) => {
          const isChecked = option.value === value;
          const radioId = `${inputId}-${index}`;

          return (
            <label
              key={String(option.value)}
              htmlFor={radioId}
              className={cx('flex items-center cursor-pointer', {
                'cursor-not-allowed opacity-50': disabled,
              })}
            >
              <div
                className={cx(
                  'shrink-0 rounded-full border flex justify-center items-center transition-all box-border relative',
                  {
                    'w-5 h-5': size === 'default',
                    'w-7 h-7': size === 'large',
                    'bg-neutral-10 dark:bg-neutral-10-dark hover:border-primary-main dark:hover:border-primary-main-dark':
                      !disabled,
                    'bg-primary-main dark:bg-primary-main-dark':
                      !disabled && isChecked,
                    'bg-neutral-50 dark:bg-neutral-50-dark':
                      disabled && isChecked,
                    'ring-3 ring-primary-focus': focused && !disabled,
                    'border-success-main dark:border-success-main-dark':
                      successProp,
                    'border-danger-main dark:border-danger-main-dark': isError,
                    'border-primary-main dark:border-primary-main-dark':
                      !!successProp && !isError && !disabled && isChecked,
                    'border-neutral-50 dark:border-neutral-50-dark':
                      !successProp && !isError && !disabled,
                    '!border-neutral-40 !dark:border-neutral-40-dark': disabled,
                  },
                )}
              >
                <input
                  {...props}
                  id={radioId}
                  type="radio"
                  name={inputId}
                  checked={isChecked}
                  onChange={() => handleChange(option)}
                  disabled={disabled}
                  aria-label={label}
                  className="hidden"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                {isChecked && (
                  <div
                    className={cx(
                      'rounded-full bg-neutral-10 dark:bg-neutral-10-dark',
                      {
                        'w-2 h-2': size === 'default',
                        'w-3 h-3': size === 'large',
                      },
                    )}
                  />
                )}
              </div>
              <span
                className={cx(
                  'ml-2 text-neutral-90 dark:text-neutral-90-dark',
                  {
                    'text-14px': size === 'default',
                    'text-18px': size === 'large',
                  },
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

RadioGroup.isFormInput = true;

export default RadioGroup;
