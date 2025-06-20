/* eslint-disable react/no-array-index-key */
import React from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { MONTH_LIST, PickerType, TimeUnit } from '../../const/datePicker';
import { SUNDAY_DATE, areDatesEqual, getYearRange, isToday } from '../../libs';
import Icon from '../Icon';
import InputDropdown from './InputDropdown';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

export const CancelButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-14px py-0.5 px-2 rounded text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-10-dark hover:bg-neutral-20 dark:hover:bg-neutral-20-dark active:bg-neutral-30 dark:active:bg-neutral-30-dark border focus:ring-3 border-neutral-40 dark:border-neutral-40-dark drop-shadow focus:ring-primary-focus dark:focus:ring-primary-focus-dark"
  >
    Cancel
  </button>
);

export type InputDateValue = Date | null;

export interface InputDatePickerRef {
  element: HTMLDivElement | null;
  value: InputDateValue;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}
export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'required' | 'checked'
  > {
  value?: InputDateValue;
  defaultValue?: InputDateValue;
  clearable?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: InputDateValue) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<InputDatePickerRef | null>
    | React.RefCallback<InputDatePickerRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  disabledDate?: (date: Date) => boolean;
  width?: number;
  showTime?: boolean;
  picker?: PickerType;
  format?: string;
}

/**
 * The Date Picker component lets users select a date. User can also set a time of the date.
 */
const DatePicker = ({
  id,
  value: valueProp,
  defaultValue = valueProp,
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = 'Input date',
  disabled: disabledProp = false,
  fullWidth,
  inputRef,
  size = 'default',
  clearable = false,
  error: errorProp,
  success: successProp,
  loading = false,
  disabledDate,
  width,
  showTime = false,
  format: formatProps,
  picker = 'date',
  ...props
}: DatePickerProps) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue || null,
  );

  let format = formatProps;
  if (!format) {
    if (picker === 'year') format = 'YYYY';
    else if (picker === 'month') format = 'M/YYYY';
    else format = 'D/M/YYYY';
    if (showTime) format = `${format} HH:mm:ss`;
  }

  const isControlled = typeof valueProp !== 'undefined';
  const value = isControlled && !dropdownOpen ? valueProp : internalValue;
  const [timeValue, setTimeValue] = React.useState({
    hours: value?.getHours() ?? null,
    minutes: value?.getMinutes() ?? null,
    seconds: value?.getSeconds() ?? null,
  });
  const [tempValue, setTempValue] = React.useState<InputDateValue>(
    value || null,
  );

  const [calendarView, setCalendarView] = React.useState<PickerType>(picker);
  const [displayedDate, setDisplayedDate] = React.useState(value ?? new Date());
  const yearRange = getYearRange(displayedDate.getFullYear());

  const firstDate = new Date(
    displayedDate.getFullYear(),
    displayedDate.getMonth(),
    1,
  );
  const lastDate = new Date(
    displayedDate.getFullYear(),
    displayedDate.getMonth() + 1,
    0,
  );

  const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

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
  }, [dropdownOpen, timeValue.hours, timeValue.minutes, timeValue.seconds]);

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => {
      elementRef.current?.focus();
    },
    reset: () => {
      setInternalValue(defaultValue || null);
    },
    disabled,
  }));

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

  const handleFocus = () => {
    if (disabled) return;
    handleChangeView(picker);
    setFocused(true);
    setDropdownOpen(true);
  };

  const handleBlur = (event?: React.FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event?.relatedTarget as Node | null;

    const dropdownContainsTarget = dropdownRef.current?.contains(relatedTarget);
    const selectElementContainsTarget =
      elementRef.current?.contains(relatedTarget);

    if (dropdownContainsTarget || selectElementContainsTarget) {
      return;
    }
    setFocused(false);
    setDropdownOpen(false);
  };

  const handleDropdown = () => {
    if (disabled) return;
    setFocused(true);
    setDropdownOpen((prev) => {
      return !prev;
    });
  };

  const days: Array<string> = Array.from({ length: 7 }).map((_, idx) =>
    dayFormatter.format(
      new Date(
        SUNDAY_DATE.getFullYear(),
        SUNDAY_DATE.getMonth(),
        SUNDAY_DATE.getDate() + idx,
      ),
    ),
  );

  const dates = Array.from({ length: lastDate.getDate() }).map(
    (_, idx) =>
      new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate() + idx,
      ),
  );

  const dateMatrix: Array<Array<InputDateValue>> = Array(days.length).fill([]);

  while (dates.length > 0) {
    const dateRow = days.map((_, idx) => {
      if (dates.length > 0 && dates[0].getDay() === idx) {
        const currentDate = dates.shift();
        return currentDate ?? null;
      }
      return null;
    });
    dateMatrix.push(dateRow);
  }

  const handleChangeView = (view: PickerType) => {
    setCalendarView(view);
  };

  const handleJumpMonth = (month: number) => {
    if (picker === 'month') {
      handleSelectDate(new Date(displayedDate.getFullYear(), month));
    } else {
      setDisplayedDate(new Date(displayedDate.getFullYear(), month));
      handleChangeView('date');
    }
  };

  const handleJumpYear = (year: number) => {
    if (picker === 'year') {
      handleSelectDate(new Date(year, 0)); // january 1, <YEAR>
    } else {
      setDisplayedDate(new Date(year, displayedDate.getMonth()));
      setCalendarView('month');
    }
  };

  const handlePrevMonth = () => {
    const prevMonth =
      displayedDate.getMonth() === 0 ? 11 : displayedDate.getMonth() - 1;
    const prevYear =
      displayedDate.getMonth() === 0
        ? displayedDate.getFullYear() - 1
        : displayedDate.getFullYear();
    setDisplayedDate(new Date(prevYear, prevMonth));
  };

  const handleNextMonth = () => {
    const nextMonth =
      displayedDate.getMonth() === 11 ? 0 : displayedDate.getMonth() + 1;
    const nextYear =
      displayedDate.getMonth() === 11
        ? displayedDate.getFullYear() + 1
        : displayedDate.getFullYear();
    setDisplayedDate(new Date(nextYear, nextMonth));
  };

  const handleChangeYear = (jump: number) => {
    setDisplayedDate(
      new Date(displayedDate.getFullYear() + jump, displayedDate.getMonth()),
    );
  };

  const handleChange = (newValue: InputDateValue) => {
    onChange?.(newValue);
    if (!isControlled) {
      setInternalValue(newValue);
    }

    setDisplayedDate(newValue || new Date());
    handleBlur();
  };

  const handleConfirmDateTime = () => {
    handleChange(internalValue);
  };

  const handleSelectDate = (selectedDate: Date) => {
    const selectedTime = {
      hours: timeValue.hours ?? 0,
      minutes: timeValue.minutes ?? 0,
      seconds: timeValue.seconds ?? 0,
    };
    setTimeValue(selectedTime);
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.hours,
      selectedTime.minutes,
      selectedTime.seconds,
    );
    setDisplayedDate(newDate);
    if (showTime) {
      setInternalValue(newDate);
    } else {
      handleChange(newDate);
    }
  };

  const handleSelectTime = (category: TimeUnit, selected: number) => {
    const selectedDate = value || new Date();
    const selectedTime = {
      hours: timeValue.hours ?? 0,
      minutes: timeValue.minutes ?? 0,
      seconds: timeValue.seconds ?? 0,
      [category]: selected,
    };
    setTimeValue(selectedTime);

    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.hours,
      selectedTime.minutes,
      selectedTime.seconds,
    );
    setInternalValue(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const selectedTime = {
      hours: showTime ? today.getHours() : 0,
      minutes: showTime ? today.getMinutes() : 0,
      seconds: showTime ? today.getSeconds() : 0,
    };
    setTimeValue(selectedTime);
    handleChange(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        selectedTime.hours,
        selectedTime.minutes,
        selectedTime.seconds,
      ),
    );
  };

  const handleClearValue = () => {
    handleChange(null);
    setTimeValue({
      hours: null,
      minutes: null,
      seconds: null,
    });
  };

  React.useEffect(() => {
    setTempValue(value);
    setDisplayedDate(value || new Date());
    if (isControlled) setInternalValue(value);
  }, [value, dropdownOpen]);

  const dropdownContent = (
    <div className="min-w-60">
      {calendarView === 'date' && (
        <>
          <div className="flex">
            <div>
              <div className="flex justify-between items-center gap-2 p-2 border-b border-neutral-40 dark:border-neutral-40-dark">
                <div className="flex items-center">
                  <Icon
                    name="chevron-double-left"
                    size={20}
                    strokeWidth={2}
                    onClick={() => handleChangeYear(-1)}
                    className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
                  />
                  <Icon
                    name="chevron-left"
                    size={20}
                    strokeWidth={2}
                    onClick={handlePrevMonth}
                    className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
                  />
                </div>
                <div className="flex items-center gap-4 text-16px font-semibold text-neutral-100 dark:text-neutral-100-dark">
                  <button
                    type="button"
                    className="shrink-0 hover:text-primary-hover dark:hover:text-primary-hover-dark w-[84px]"
                    onClick={() => handleChangeView('month')}
                  >
                    {monthFormatter.format(displayedDate)}
                  </button>
                  <button
                    type="button"
                    className="shrink-0 hover:text-primary-hover dark:hover:text-primary-hover-dark w-10"
                    onClick={() => handleChangeView('year')}
                  >
                    {displayedDate.getFullYear()}
                  </button>
                </div>
                <div className="flex items-center">
                  <Icon
                    name="chevron-right"
                    size={20}
                    strokeWidth={2}
                    onClick={handleNextMonth}
                    className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
                  />
                  <Icon
                    name="chevron-double-right"
                    size={20}
                    strokeWidth={2}
                    onClick={() => handleChangeYear(1)}
                    className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
                  />
                </div>
              </div>
              <div className="text-12px p-2">
                <table className="w-full">
                  <thead>
                    <tr>
                      {days.map((day) => (
                        <th key={day}>
                          <div className="text-center p-1 font-normal w-8">
                            {day}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dateMatrix.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((date, dateIdx) => {
                          const isDateDisabled =
                            date === null || disabledDate?.(date);
                          const isDateSelected = date
                            ? tempValue !== null &&
                              areDatesEqual(date, tempValue)
                            : false;

                          return (
                            <td
                              key={dateIdx}
                              aria-label={
                                date ? date.toDateString() : 'Disabled date'
                              }
                              className="px-0"
                            >
                              <div className="flex justify-center items-center">
                                {date && (
                                  <button
                                    type="button"
                                    onClick={() => handleSelectDate(date)}
                                    className={cx(
                                      'rounded-md text-14px mt-0.5 transition-colors duration-200 ease-in w-7 h-7 flex items-center justify-center',
                                      {
                                        'cursor-not-allowed text-neutral-50 dark:text-neutral-50-dark':
                                          isDateDisabled,
                                        'cursor-pointer text-neutral-100 dark:text-neutral-100-dark':
                                          !isDateDisabled,
                                        'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                                          !isDateDisabled && !isDateSelected,
                                        'border border-primary-main':
                                          isToday(date) && !isDateSelected,
                                        'bg-primary-main dark:bg-primary-main-dark !text-neutral-10 dark:!text-neutral-10-dark':
                                          isDateSelected,
                                      },
                                    )}
                                    disabled={isDateDisabled}
                                  >
                                    {date?.getDate()}
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showTime && (
              <div className="border-l border-neutral-40 dark:border-neutral-40-dark text-14px">
                <div className="h-[49px] border-b border-neutral-40 dark:border-neutral-40-dark" />
                <div className="flex">
                  {Object.keys(TimeUnit).map((key) => {
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
              </div>
            )}
          </div>
          {showTime ? (
            <div className="border-t border-neutral-40 dark:border-neutral-40-dark flex items-center justify-between py-2 px-3">
              <button
                className="text-14px text-primary-main dark:text-primary-main-dark hover:text-primary-hover dark:hover:text-primary-hover-dark"
                type="button"
                onClick={handleToday}
              >
                Now
              </button>
              <button
                type="button"
                onClick={handleConfirmDateTime}
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
          ) : (
            <button
              className="border-t border-neutral-40 dark:border-neutral-40-dark flex justify-center p-2.5 text-14px text-primary-main dark:text-primary-main-dark hover:text-primary-hover dark:hover:text-primary-hover-dark w-full"
              type="button"
              onClick={handleToday}
            >
              Today
            </button>
          )}
        </>
      )}
      {calendarView === 'month' && (
        <>
          <div className="flex justify-between items-center gap-2 p-2 border-b border-neutral-40 dark:border-neutral-40-dark">
            <Icon
              name="chevron-double-left"
              size={20}
              strokeWidth={2}
              onClick={() => handleChangeYear(-1)}
              className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
            />
            <button
              type="button"
              className="text-16px font-medium text-neutral-100 dark:text-neutral-100-dark hover:text-primary-hover dark:hover:text-primary-hover-dark"
              onClick={() => handleChangeView('year')}
            >
              {displayedDate.getFullYear()}
            </button>
            <Icon
              name="chevron-double-right"
              size={20}
              strokeWidth={2}
              onClick={() => handleChangeYear(1)}
              className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
            />
          </div>
          <div className="grid grid-cols-3 p-2 gap-y-1 text-14px">
            {MONTH_LIST.map((item) => {
              const isDateSelected =
                value &&
                value.getFullYear() === displayedDate.getFullYear() &&
                value.getMonth() === item.value;
              return (
                <div
                  className="flex justify-center items-center h-12 text-neutral-100 dark:text-neutral-100-dark"
                  key={item.value}
                >
                  <button
                    type="button"
                    onClick={() => handleJumpMonth(item.value)}
                    className={cx(
                      'w-full h-8 transition-colors duration-200 ease-in px-3 py-0.5 flex items-center justify-center rounded-md',
                      {
                        'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                          !isDateSelected,
                        'bg-primary-main dark:bg-primary-main-dark text-neutral-10 dark:text-neutral-10-dark rounded-md':
                          isDateSelected,
                      },
                    )}
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
          {picker === 'date' && (
            <div className="flex justify-end gap-3 px-2">
              <CancelButton onClick={() => handleChangeView(picker)} />
            </div>
          )}
        </>
      )}
      {calendarView === 'year' && (
        <>
          <div className="flex justify-between items-center gap-2 p-2 border-b border-neutral-40 dark:border-neutral-40-dark">
            <Icon
              name="chevron-double-left"
              size={20}
              strokeWidth={2}
              onClick={() => handleChangeYear(-12)}
              className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
            />
            <div className="text-16px font-medium text-neutral-100 dark:text-neutral-100-dark">
              {`${yearRange[0]} - ${yearRange[yearRange.length - 1]}`}
            </div>
            <Icon
              name="chevron-double-right"
              size={20}
              strokeWidth={2}
              onClick={() => handleChangeYear(12)}
              className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
            />
          </div>
          <div className="grid grid-cols-3 p-2 gap-y-1 text-14px">
            {yearRange.map((item) => {
              const isDateSelected = value?.getFullYear() === item;
              return (
                <div
                  className="flex justify-center items-center h-12 w-20 text-neutral-100 dark:text-neutral-100-dark"
                  key={item}
                >
                  <button
                    type="button"
                    onClick={() => handleJumpYear(item)}
                    className={cx(
                      'w-full h-8 transition-colors duration-200 ease-in px-3 py-0.5 flex items-center justify-center rounded-md',
                      {
                        'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                          !isDateSelected,
                        'bg-primary-main dark:bg-primary-main-dark text-neutral-10 rounded-md dark:text-neutral-10-dark':
                          isDateSelected,
                      },
                    )}
                  >
                    {item}
                  </button>
                </div>
              );
            })}
          </div>
          {(picker === 'date' || picker === 'month') && (
            <div className="flex justify-end gap-3 px-2">
              <CancelButton onClick={() => handleChangeView(picker)} />
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      className={cx(
        'relative text-14px',
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
            'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus dark:focus:ring-primary-focus-dark focus:!border-primary-main dark:focus:!border-primary-main-dark':
              !disabled,
            'ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark':
              focused,
            'py-[3px]': size === 'default',
            'py-[9px]': size === 'large',
          },
        )}
        ref={elementRef}
        style={width ? { width } : undefined}
      >
        <input
          {...props}
          tabIndex={!disabled ? 0 : -1}
          id={id}
          value={value ? dayjs(value).format(format) : ''}
          placeholder={focused ? '' : placeholder}
          className={cx(
            'w-full outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark text-neutral-90 dark:text-neutral-90-dark disabled:cursor-not-allowed',
            {
              'text-14px py-0.5': size === 'default',
              'text-18px py-0.5': size === 'large',
            },
          )}
          disabled={disabled}
          aria-label={label}
          autoComplete="off"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleFocus}
          onChange={() => {}}
        />
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={clearable && focused && !!value}
          onClear={handleClearValue}
        >
          {(!clearable ||
            (clearable && !focused) ||
            (clearable && focused && !value)) && (
            <Icon
              name="calendar"
              size={20}
              strokeWidth={2}
              onClick={disabled ? undefined : handleDropdown}
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

DatePicker.isFormInput = true;

export default DatePicker;
