import React from 'react';
import cx from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { TimeUnit } from '../../const/datePicker';
import { TimerFieldProps } from '../../types';
import Icon from '../Icon';
import InputDropdown from './InputDropdown';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

const convertTime = (time: number | null) => {
  if (!time) return '';

  const hours = Math.floor(time / 3600)
    .toLocaleString('en-US')
    .padStart(2, '0');
  const minutes = Math.floor((time % 3600) / 60)
    .toLocaleString('en-US')
    .padStart(2, '0');
  const seconds = (time % 60).toLocaleString('en-US').padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

/**
 * The Timer Field component is used for collecting time value from users
 */
const TimerField = ({
  id,
  name,
  value: valueProp,
  defaultValue,
  initialValue = null,
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
  required,
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
    defaultValue || initialValue,
  );

  const isControlled = valueProp !== undefined;
  // Sync `internalStringValue` with `valueProp` when `valueProp` changes
  const value = isControlled ? valueProp : internalValue;
  const [inputValue, setInputValue] = React.useState(convertTime(value));
  const [timeValue, setTimeValue] = React.useState({
    hours: value ? Math.floor(value / 3600) : null,
    minutes: value ? Math.floor((value % 3600) / 60) : null,
    seconds: value ? value % 60 : null,
  });

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
    focus: () => valueRef.current?.focus(),
    reset: () => setInternalValue(initialValue),
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

  const debounceTextToValue = useDebouncedCallback((input: string) => {
    if (clearable && input.length === 0) {
      setTimeValue({ hours: 0, minutes: 0, seconds: 0 });
      onChange?.(null);
      if (!isControlled) setInternalValue(null);

      return;
    }

    const isValid = /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(input);

    if (isValid) {
      const inputArr = input.split(':');
      const hours = Number(inputArr[0]);
      const minutes = Number(inputArr[1]);
      const seconds = Number(inputArr[2]);
      setTimeValue({ hours, minutes, seconds });

      const newDuration = hours * 3600 + minutes * 60 + seconds;
      onChange?.(newDuration);
      if (!isControlled) setInternalValue(newDuration);
      handleBlur();
    }
  }, 500);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounceTextToValue(e.target.value);
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
      for (const unit of Object.keys(timeValue) as Array<
        keyof typeof timeValue
      >) {
        const value = timeValue[unit];
        const container = scrollRefs[unit]?.current;
        const item = value === null ? null : itemRefs[unit].current[value];
        if (container && item) {
          const containerTop = container.getBoundingClientRect().top;
          const itemTop = item.getBoundingClientRect().top;
          const offset = itemTop - containerTop - 8; // Adjust for 8px padding

          container.scrollTo({
            top: container.scrollTop + offset,
            behavior: 'smooth',
          });
        }
      }
    }, 50); // Small delay for rendering
  }, [dropdownOpen, timeValue]);

  React.useEffect(() => {
    if (dropdownOpen) {
      const hours = value ? Math.floor(value / 3600) : null;
      const minutes = value ? Math.floor((value % 3600) / 60) : null;
      const seconds = value ? value % 60 : null;
      setTimeValue({ hours, minutes, seconds });

      setInputValue(convertTime(value));
    }
  }, [value, dropdownOpen]);

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

  const inputId = `timerfield-${id || name}-${React.useId()}`;

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
            tabIndex={disabled ? -1 : 0}
            id={inputId}
            name={name}
            value={inputValue}
            placeholder={focused ? '' : placeholder}
            onFocus={() => handleFocus('hour')}
            onChange={handleChangeInput}
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
