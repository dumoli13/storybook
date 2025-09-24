import React from 'react';
import cx from 'classnames';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

const formatValue = (value: string | number | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }

  const numberValue = Number(value);
  if (isNaN(numberValue)) return value.toString(); // In case it's not a valid number

  // Format number with thousand separators
  return numberValue.toLocaleString('en-US');
};

export interface NumberTextfieldRef {
  element: HTMLInputElement | null;
  value: number | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface NumberTextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'size'
    | 'required'
    | 'checked'
    | 'max'
    | 'min'
  > {
  id?: string;
  value?: number | null;
  defaultValue?: number | null;
  initialValue?: number | null;
  max?: number;
  min?: number;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: number | null) => void;
  className?: string;
  helperText?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
  inputRef?:
    | React.RefObject<NumberTextfieldRef | null>
    | React.RefCallback<NumberTextfieldRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
  required?: boolean;
}

/**
 * The Number Text Field component is used for collecting numeric data from users. This component will format thousand separator on blur.
 */
const NumberTextField = ({
  id,
  name,
  value: valueProp,
  defaultValue,
  initialValue = null,
  max,
  min,
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  onChange,
  onFocus,
  onBlur,
  className,
  helperText,
  placeholder = '',
  disabled: disabledProp = false,
  fullWidth,
  startIcon,
  endIcon,
  clearable = false,
  inputRef,
  size = 'default',
  error: errorProp,
  success: successProp,
  loading = false,
  width,
  required,
  ...props
}: NumberTextFieldProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const elementRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<number | null>(
    () => {
      let initialVal = defaultValue ?? initialValue;

      // Apply min/max constraints to initial value
      if (initialVal !== null) {
        if (min !== undefined && initialVal < min) {
          initialVal = min;
        } else if (max !== undefined && initialVal > max) {
          initialVal = max;
        }
      }

      return initialVal;
    },
  );
  const [internalStringValue, setInternalStringValue] = React.useState<string>(
    internalValue?.toString() ?? '',
  );
  const [internalError, setInternalError] = React.useState<string | undefined>(
    '',
  );

  const isControlled = valueProp !== undefined;

  // Sync `internalStringValue` with `valueProp` when `valueProp` changes
  React.useEffect(() => {
    if (isControlled) {
      setInternalStringValue(valueProp?.toString() ?? '');
    }
  }, [valueProp, isControlled]);

  const value = isControlled ? valueProp : internalValue;
  const displayValue = focused
    ? internalStringValue
    : isControlled
    ? value || ''
    : formatValue(internalStringValue);

  const helperMessage = (errorProp || internalError) ?? helperText;
  const isError = !!(errorProp || internalError);
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => elementRef.current?.focus(),
    reset: () => {
      setInternalValue(initialValue);
      setInternalStringValue(initialValue?.toString());
    },
    disabled,
  }));

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const selectElementContainsTarget = elementRef.current?.contains(target);

      if (selectElementContainsTarget) {
        elementRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
    if (isControlled) {
      setInternalStringValue(valueProp?.toString() ?? '');
    }
    setFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!isControlled) {
      let constrainedValue = internalValue;

      if (internalValue !== null && typeof internalValue === 'number') {
        if (min !== undefined && internalValue < min) {
          constrainedValue = min;
          setInternalStringValue(min.toString());
        } else if (max !== undefined && internalValue > max) {
          constrainedValue = max;
          setInternalStringValue(max.toString());
        }
      }
      setInternalValue(constrainedValue);
    }

    onBlur?.(event);
    const relatedTarget = event.relatedTarget;

    const selectElementContainsTarget =
      parentRef.current?.contains(relatedTarget);

    if (selectElementContainsTarget) {
      return;
    }

    setFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const decimalRegex = /^-?\d*\.?\d*$/;
    // Allow decimal numbers and dot input
    if (decimalRegex.test(inputValue)) {
      setInternalStringValue(inputValue);

      // Only convert to number if input is not "-" or "."
      const newValue =
        inputValue === '' || inputValue === '.' || inputValue === '-'
          ? null
          : Number(inputValue);

      let constrainedValue = newValue;

      if (newValue !== null && typeof newValue === 'number') {
        if (min !== undefined && newValue < min) {
          constrainedValue = min;
          setInternalError(`Must be at least asdfasf${min}`);
        } else if (max !== undefined && newValue > max) {
          constrainedValue = max;
          setInternalError(`Must be no more than asfasf${max}`);
        } else if (internalError) {
          setInternalError('');
        }
      }

      setInternalStringValue(newValue.toString());
      if (!isControlled) setInternalValue(newValue);
      onChange?.(constrainedValue);
    }
  };

  const handleClearValue = () => {
    onChange?.(null);
    if (!isControlled) {
      setInternalValue(null);
    }
    setInternalStringValue('');
  };

  const inputId = `numbertextfield-${id || name}-${React.useId()}`;

  return (
    <div
      className={cx(
        'relative',
        {
          'w-full': fullWidth,
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
        className={cx(
          'relative px-3 border rounded-md flex gap-2 items-center',
          {
            'w-full': fullWidth,
            'border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
              isError,
            'border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
              !isError && successProp,
            'border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark':
              !isError && !successProp && !disabled,
            'bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark':
              disabled,
            'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus focus:!border-primary-main':
              !disabled,
            'ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark':
              focused,
            'py-[3px]': size === 'default',
            'py-[9px]': size === 'large',
          },
        )}
        style={width ? { width } : undefined}
        ref={parentRef}
      >
        {!!startIcon && (
          <div className="text-neutral-70 dark:text-neutral-70-dark">
            {startIcon}
          </div>
        )}
        <input
          {...props}
          tabIndex={!disabled ? 0 : -1}
          id={inputId}
          value={displayValue}
          onChange={handleChange}
          placeholder={focused ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cx(
            'w-full outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark text-neutral-90 dark:text-neutral-90-dark disabled:cursor-not-allowed',
            {
              'text-14px py-0.5': size === 'default',
              'text-18px py-0.5': size === 'large',
            },
          )}
          disabled={disabled}
          autoComplete="off"
          ref={elementRef}
        />
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={clearable && focused && !!value}
          onClear={handleClearValue}
          endIcon={endIcon}
        />
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

NumberTextField.isFormInput = true;

export default NumberTextField;
