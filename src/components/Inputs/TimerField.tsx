import React from 'react';
import cx from 'classnames';
import { TimeUnit } from '../../const/datePicker';
import Icon from '../Icon';
import InputDropdown from './InputDropdown';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

export interface TimerFieldRef {
  element: HTMLInputElement | null;
  value: number | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}
export interface TimerFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'required' | 'checked'
  > {
  id?: string;
  value?: number | null;
  defaultValue?: number | null;
  clearable?: boolean;
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
  inputRef?:
    | React.RefObject<TimerFieldRef | null>
    | React.RefCallback<TimerFieldRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
}

/**
 * The Timer Field component is used for collecting time value from users
 */
const TimerField = ({
  id,
  value: valueProp,
  defaultValue = valueProp,
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = 'hh:mm:ss',
  disabled: disabledProp = false,
  fullWidth,
  startIcon,
  endIcon,
  inputRef,
  size = 'default',
  clearable = false,
  error: errorProp,
  success: successProp,
  loading = false,
  width,
  ...props
}: TimerFieldProps) => {
  const elementRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState<
    'hour' | 'minute' | 'second' | null
  >(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<number | null>(
    defaultValue !== undefined ? defaultValue : null,
  );

  const isControlled = valueProp !== undefined;

  // Sync `internalStringValue` with `valueProp` when `valueProp` changes
  const value = isControlled ? valueProp : internalValue;
  const [timeValue, setTimeValue] = React.useState({
    hours: value ? Math.floor(value / 3600) : null,
    minutes: value ? Math.floor((value % 3600) / 60) : null,
    seconds: value ? value % 60 : null,
  });
  const displayValue = dropdownOpen || !isControlled ? internalValue : value;

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  const scrollRefs = {
    hours: React.useRef<HTMLDivElement>(null),
    minutes: React.useRef<HTMLDivElement>(null),
    seconds: React.useRef<HTMLDivElement>(null),
  };

  const itemRefs = {
    hours: React.useRef<(HTMLButtonElement | null)[]>([]),
    minutes: React.useRef<(HTMLButtonElement | null)[]>([]),
    seconds: React.useRef<(HTMLButtonElement | null)[]>([]),
  };

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => {
      valueRef.current?.focus();
    },
    reset: () => {
      setInternalValue(defaultValue !== undefined ? defaultValue : null);
    },
    disabled,
  }));

  const handleSelectTime = (category: TimeUnit, selected: number) => {
    const selectedTime = {
      hours: timeValue.hours ?? 0,
      minutes: timeValue.minutes ?? 0,
      seconds: timeValue.seconds ?? 0,
      [category]: selected,
    };
    setTimeValue(selectedTime);
  };

  const handleFocus = (component: 'hour' | 'minute' | 'second' = 'hour') => {
    if (disabled) return;
    setFocused(component);
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    setFocused(null);
    setDropdownOpen(false);
  };

  const handleClearValue = () => {
    onChange?.(null);
    if (!isControlled) {
      setInternalValue(null);
    }
  };

  const handleConfirmTime = () => {
    const newDuration = timeValue
      ? (timeValue.hours ?? 0) * 3600 +
        (timeValue.minutes ?? 0) * 60 +
        (timeValue.seconds ?? 0)
      : null;

    onChange?.(newDuration);

    if (!isControlled) {
      setInternalValue(newDuration);
    }

    handleBlur();
  };

  const handleDropdown = () => {
    if (disabled) return;
    setFocused('hour');
    setDropdownOpen((prev) => {
      return !prev;
    });
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownContainsTarget = dropdownRef.current?.contains(target);
      const selectElementContainsTarget = elementRef.current?.contains(target);

      if (dropdownContainsTarget || selectElementContainsTarget) {
        elementRef.current?.focus();
        return;
      }

      handleBlur();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (!dropdownOpen) return;

    // Delay to ensure dropdown is fully rendered before scrolling
    setTimeout(() => {
      (Object.keys(timeValue) as Array<keyof typeof timeValue>).forEach(
        (unit) => {
          const value = timeValue[unit];
          const container = scrollRefs[unit]?.current;
          const item = value !== null ? itemRefs[unit].current[value] : null;
          if (container && item) {
            const containerTop = container.getBoundingClientRect().top;
            const itemTop = item.getBoundingClientRect().top;
            const offset = itemTop - containerTop - 8; // Adjust for 8px padding

            container.scrollTo({
              top: container.scrollTop + offset,
              behavior: 'smooth',
            });
          }
        },
      );
    }, 50); // Small delay for rendering
  }, [dropdownOpen, timeValue]);

  React.useEffect(() => {
    if (dropdownOpen) {
      setTimeValue({
        hours: value ? Math.floor(value / 3600) : null,
        minutes: value ? Math.floor((value % 3600) / 60) : null,
        seconds: value ? value % 60 : null,
      });
    }
  }, [dropdownOpen]);

  const dropdownContent = (
    <div className="border-l border-neutral-40 dark:border-neutral-40-dark text-14px">
      <div className="flex">
        {Object.keys(timeValue).map((key) => {
          const unit = key as TimeUnit;
          const length = unit === TimeUnit.hours ? 24 : 60;
          return (
            <div
              key={unit}
              ref={scrollRefs[unit]}
              className="text-neutral-100 dark:text-neutral-100-dark max-h-[234px] overflow-y-auto p-2 apple-scrollbar flex flex-col gap-1 border-l border-neutral-40 dark:border-neutral-40-dark first:border-none"
            >
              {Array.from({ length }).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  ref={(el) => {
                    itemRefs[unit].current[idx] = el;
                  }}
                  className={cx('w-10 text-center rounded py-0.5', {
                    'bg-primary-main dark:bg-primary-main-dark text-neutral-10 dark:text-neutral-10-dark cursor-default':
                      idx === timeValue[unit],
                    'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                      idx !== timeValue[unit],
                  })}
                  onClick={() => handleSelectTime(unit, idx)}
                >
                  {idx.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <div className="border-t border-neutral-40 dark:border-neutral-40-dark flex items-center justify-end py-2 px-3">
        <button
          type="button"
          onClick={handleConfirmTime}
          className={cx(
            'text-14px py-0.5 px-2 rounded disabled:border',
            'text-neutral-10 disabled:border-neutral-40 disabled:text-neutral-60 disabled:bg-neutral-30 bg-primary-main hover:bg-primary-hover active:bg-primary-pressed',
            'dark:text-neutral-10-dark dark:disabled:border-neutral-40-dark dark:disabled:text-neutral-60-dark dark:disabled:bg-neutral-30-dark dark:bg-primary-main-dark dark:hover:bg-primary-hover-dark dark:active:bg-primary-pressed-dark',
          )}
          disabled={disabled}
        >
          OK
        </button>
      </div>
    </div>
  );

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
        <InputLabel id={id} size={size}>
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
            'border-neutral-50 dark:border-neutral-50-dark hover:border-primary-main dark:hover:border-primary-main-dark focus:ring-primary-main dark:focus:ring-primary-main-dark':
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
      >
        {!!startIcon && (
          <div className="text-neutral-70 dark:text-neutral-70-dark">
            {startIcon}
          </div>
        )}
        <div
          className={cx('flex items-center w-full', {
            'text-14px py-0.5': size === 'default',
            'text-18px py-0.5': size === 'large',
          })}
        >
          <input
            {...props}
            tabIndex={!disabled ? 0 : -1}
            id={id}
            value={
              displayValue
                ? `${Math.floor(displayValue / 3600)
                    .toLocaleString('en-US')
                    .padStart(2, '0')}:${Math.floor((displayValue % 3600) / 60)
                    .toLocaleString('en-US')
                    .padStart(
                      2,
                      '0',
                    )}:${(displayValue % 60).toLocaleString('en-US').padStart(2, '0')}`
                : ''
            }
            placeholder={focused ? '' : placeholder}
            onFocus={() => handleFocus('hour')}
            onChange={() => {}}
            ref={elementRef}
            className="w-full outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark disabled:cursor-not-allowed"
            disabled={disabled}
            autoComplete="off"
          />
        </div>
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={clearable && !!focused && !!value}
          onClear={handleClearValue}
          endIcon={endIcon}
        >
          {(!clearable ||
            (clearable && !focused) ||
            (clearable && focused && !value)) && (
            <Icon
              name="clock"
              size={20}
              strokeWidth={2}
              onClick={handleDropdown}
              disabled={disabled}
              className="rounded-full hover:bg-neutral-30 dark:hover:bg-neutral-30-dark text-neutral-70 dark:text-neutral-70-dark transition-color p-0.5"
            />
          )}
        </InputEndIconWrapper>
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
      <InputDropdown
        open={dropdownOpen}
        elementRef={elementRef}
        dropdownRef={dropdownRef}
        maxHeight={336}
      >
        {dropdownContent}
      </InputDropdown>
    </div>
  );
};

TimerField.isFormInput = true;

export default TimerField;
