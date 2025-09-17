/* eslint-disable react/no-array-index-key */
import React from "react";
import cx from "classnames";
import dayjs from "dayjs";
import { MONTH_LIST, PickerType } from "../../const/datePicker";
import { SUNDAY_DATE, areDatesEqual, getYearRange, isToday } from "../../libs";
import { Tag } from "../Displays";
import Icon from "../Icon";
import { CancelButton } from "./DatePicker";
import InputDropdown from "./InputDropdown";
import InputEndIconWrapper from "./InputEndIconWrapper";
import InputHelper from "./InputHelper";
import InputLabel from "./InputLabel";

export type InputMultipleDateValue = Date[];
export interface InputMultipleDatePickerRef {
  element: HTMLDivElement | null;
  value: InputMultipleDateValue;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}
export interface MultipleDatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "required"
  > {
  value?: InputMultipleDateValue;
  defaultValue?: InputMultipleDateValue;
  label?: string;
  labelPosition?: "top" | "left";
  autoHideLabel?: boolean;
  onChange?: (value: InputMultipleDateValue) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<InputMultipleDatePickerRef | null>
    | React.RefCallback<InputMultipleDatePickerRef | null>;
  size?: "default" | "large";
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  disabledDate?: (
    date: Date,
    firstSelectedDate: InputMultipleDateValue
  ) => boolean;
  width?: number;
  picker?: PickerType;
  format?: string;
}

/**
 * The Multiple Date Picker component lets users select multiple date.
 * This component is similar to the Date Picker component but can not set a time of the date.
 *
 */
const MultipleDatePicker = ({
  id,
  name,
  value: valueProp,
  defaultValue,
  label,

  labelPosition = "top",
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = "Input date",
  disabled: disabledProp = false,
  fullWidth,
  inputRef,
  size = "default",
  error: errorProp,
  success: successProp,
  loading = false,
  disabledDate = () => false,
  width,
  format = "D/M/YYYY",
  picker = "date",
}: MultipleDatePickerProps) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [internalValue, setInternalValue] = React.useState(defaultValue || []);
  const isControlled = typeof valueProp !== "undefined";
  const value = isControlled ? valueProp : internalValue;
  const [tempValue, setTempValue] = React.useState<InputMultipleDateValue>([]);

  const [calendarView, setCalendarView] = React.useState<PickerType>(picker);
  const [displayedDate, setDisplayedDate] = React.useState(
    value.length === 0 ? new Date() : value[0]
  );
  const yearRange = getYearRange(displayedDate.getFullYear());

  const firstDate = new Date(
    displayedDate.getFullYear(),
    displayedDate.getMonth(),
    1
  );
  const lastDate = new Date(
    displayedDate.getFullYear(),
    displayedDate.getMonth() + 1,
    0
  );

  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

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
      setInternalValue([]);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    if (disabled) return;
    handleChangeView(picker);
    setFocused(true);
    setDropdownOpen(true);
  };

  const handleBlur = (event?: React.FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event?.relatedTarget;

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
        SUNDAY_DATE.getDate() + idx
      )
    )
  );

  const dates = Array.from({ length: lastDate.getDate() }).map(
    (_, idx) =>
      new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate() + idx
      )
  );

  const dateMatrix: Array<Array<Date | null>> = Array(days.length).fill([]);

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

  const handleChangeView = (view: "date" | "month" | "year") => {
    setCalendarView(view);
  };

  const handleJumpMonth = (month: number) => {
    if (picker === "month") {
      handleSelectDate(new Date(displayedDate.getFullYear(), month));
    } else {
      setDisplayedDate(new Date(displayedDate.getFullYear(), month));
      handleChangeView("date");
    }
  };

  const handleJumpYear = (year: number) => {
    if (picker === "year") {
      handleSelectDate(new Date(year, 0)); // january 1, <YEAR>
    } else {
      setDisplayedDate(new Date(year, displayedDate.getMonth()));
      setCalendarView("month");
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
      new Date(displayedDate.getFullYear() + jump, displayedDate.getMonth())
    );
  };

  const handleChange = (newValue: InputMultipleDateValue) => {
    onChange?.(newValue);
    if (!isControlled) {
      setInternalValue(newValue);
    }
  };

  const handleSelectDate = (selectedDate: Date) => {
    const timestamp = selectedDate.getTime();
    const isDateSelected = value.some((date) => date.getTime() === timestamp);
    const newValue = isDateSelected
      ? value.filter((date) => date.getTime() !== timestamp)
      : [...value, selectedDate];

    // newValue.sort((a, b) => a.getTime() - b.getTime());
    handleChange(newValue);
  };

  const handleClearValue = () => {
    handleChange([]);
  };

  React.useEffect(() => {
    setTempValue(value);
    setDisplayedDate(value[value.length - 1] || new Date());
  }, [value, dropdownOpen]);

  const dropdownContent = (
    <div className="min-w-60">
      {calendarView === "date" && (
        <>
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
                onClick={() => handleChangeView("month")}
              >
                {monthFormatter.format(displayedDate)}
              </button>
              <button
                type="button"
                className="shrink-0 hover:text-primary-hover dark:hover:text-primary-hover-dark w-10"
                onClick={() => handleChangeView("year")}
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
          <div className="text-12px p-2 border-neutral-40 dark:border-neutral-40-dark">
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
                        date === null || disabledDate(date, tempValue);
                      const isDateSelected = date
                        ? tempValue !== null && areDatesEqual(date, tempValue)
                        : false;

                      return (
                        <td
                          key={dateIdx}
                          aria-label={
                            date ? date.toDateString() : "Disabled date"
                          }
                          className="px-0"
                        >
                          <div className="flex justify-center items-center">
                            {date && (
                              <button
                                type="button"
                                onClick={() => handleSelectDate(date)}
                                className={cx(
                                  "rounded-md text-14px mt-0.5 transition-colors duration-200 ease-in w-7 h-7 flex items-center justify-center",
                                  {
                                    "cursor-not-allowed text-neutral-50 dark:text-neutral-50-dark":
                                      isDateDisabled,
                                    "cursor-pointer text-neutral-100 dark:text-neutral-100-dark":
                                      !isDateDisabled,
                                    "hover:bg-neutral-20 dark:hover:bg-neutral-20-dark":
                                      !isDateDisabled && !isDateSelected,
                                    "border border-primary-main dark:border-primary-main-dark":
                                      isToday(date) && !isDateSelected,
                                    "bg-primary-main dark:bg-primary-main-dark !text-neutral-10 dark:!text-neutral-10-dark":
                                      isDateSelected,
                                  }
                                )}
                                disabled={isDateDisabled}
                              >
                                {date.getDate()}
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
        </>
      )}
      {calendarView === "month" && (
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
              onClick={() => handleChangeView("year")}
            >
              {displayedDate.getFullYear()}
            </button>
            <button
              type="button"
              title="Next Year"
              onClick={() => handleChangeYear(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
            >
              <Icon
                name="chevron-double-right"
                size={20}
                strokeWidth={2}
                className="p-1 flex items-center justify-center rounded-full hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100/25 dark:text-neutral-100-dark/25"
              />
            </button>
          </div>
          <div className="grid grid-cols-3 p-2 gap-1 text-14px">
            {MONTH_LIST.map((item) => {
              const isDateDisabled =
                picker === "month" &&
                disabledDate(
                  new Date(displayedDate.getFullYear(), item.value),
                  tempValue
                );
              const isDateSelected = value.some(
                (dateItem) =>
                  dateItem.getFullYear() === displayedDate.getFullYear() &&
                  dateItem.getMonth() === item.value
              );

              return (
                <div
                  className="flex justify-center items-center h-12 text-neutral-100 dark:text-neutral-100-dark"
                  key={item.value}
                >
                  <button
                    type="button"
                    onClick={() => handleJumpMonth(item.value)}
                    className={cx(
                      "w-full h-8 transition-colors duration-200 ease-in px-3 py-0.5 flex items-center justify-center rounded-md",
                      {
                        "cursor-not-allowed text-neutral-50 dark:text-neutral-50-dark":
                          isDateDisabled,
                        "cursor-pointer text-neutral-100 dark:text-neutral-100-dark":
                          !isDateDisabled,
                        "hover:bg-neutral-20 dark:hover:bg-neutral-20-dark":
                          !isDateDisabled && !isDateSelected,
                        "bg-primary-main text-neutral-10 rounded-md":
                          isDateSelected,
                      }
                    )}
                    disabled={isDateDisabled}
                  >
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
          {picker === "date" && (
            <div className="flex justify-end gap-3 px-2">
              <CancelButton onClick={() => handleChangeView("date")} />
            </div>
          )}
        </>
      )}
      {calendarView === "year" && (
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
          <div className="grid grid-cols-3 p-2 gap-1 text-14px">
            {yearRange.map((item) => {
              const isDateDisabled =
                picker === "year" &&
                disabledDate(
                  new Date(item, displayedDate.getMonth()),
                  tempValue
                );

              const dateList = value.map((v) => v.getFullYear());
              const isDateSelected = dateList.includes(item);

              return (
                <div
                  className="flex justify-center items-center h-12 w-20 text-neutral-100 dark:text-neutral-100-dark"
                  key={item}
                >
                  <button
                    type="button"
                    onClick={() => handleJumpYear(item)}
                    className={cx(
                      "w-full h-8 transition-colors duration-200 ease-in px-3 py-0.5 flex items-center justify-center rounded-md",
                      {
                        "cursor-not-allowed text-neutral-50 dark:text-neutral-50-dark":
                          isDateDisabled,
                        "cursor-pointer text-neutral-100 dark:text-neutral-100-dark":
                          !isDateDisabled,
                        "hover:bg-neutral-20 dark:hover:bg-neutral-20-dark":
                          !isDateDisabled && !isDateSelected,
                        "bg-primary-main dark:bg-primary-main-dark text-neutral-10 dark:text-neutral-10-dark":
                          isDateSelected,
                      }
                    )}
                    disabled={isDateDisabled}
                  >
                    {item}
                  </button>
                </div>
              );
            })}
          </div>
          {(picker === "date" || picker === "month") && (
            <div className="flex justify-end gap-3 px-2">
              <CancelButton onClick={() => handleChangeView("date")} />
            </div>
          )}
        </>
      )}
    </div>
  );

  const inputId = `multipledatepicker-${id || name}-${React.useId()}`;

  return (
    <div
      className={cx(
        "relative text-14px",
        {
          "w-full": fullWidth,
          "flex items-center gap-4": labelPosition === "left",
        },
        className
      )}
    >
      {((autoHideLabel && focused) || !autoHideLabel) && label && (
        <InputLabel id={inputId} size={size}>
          {label}
        </InputLabel>
      )}
      <div
        className={cx(
          "relative px-3 border rounded-md flex gap-2 items-center",
          {
            "w-full": fullWidth,
            "border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark":
              isError,
            "border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark":
              !isError && successProp,
            "border-neutral-50 dark:border-neutral-50-dark hover:border-primary-main dark:hover:border-primary-main-dark focus:ring-primary-main dark:focus:ring-primary-main-dark":
              !isError && !successProp && !disabled,
            "bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark":
              disabled,
            "bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3 focus:ring-3 focus:ring-primary-focus focus:!border-primary-main":
              !disabled,
            "ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark":
              focused,
            "py-[3px]": size === "default",
            "py-[9px]": size === "large",
          }
        )}
        ref={elementRef}
        style={width ? { width } : undefined}
      >
        <div
          role="button"
          tabIndex={!disabled ? 0 : -1}
          aria-pressed="true"
          className={cx("flex flex-1 gap-x-2 gap-y-1 items-center flex-wrap", {
            "w-full": fullWidth,
            "cursor-text": !disabled,
            "cursor-not-allowed": disabled,
          })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleFocus}
        >
          {value?.map((selected, index) => {
            const tagValue = dayjs(selected).format(format);
            return (
              <div className="flex items-center py-[1px]" key={tagValue}>
                {disabled ? (
                  <Tag color="neutral">{tagValue}</Tag>
                ) : (
                  <Tag
                    color="info"
                    size={size}
                    onRemove={
                      isControlled
                        ? undefined
                        : () =>
                            handleChange(value.filter((_, i) => i !== index))
                    }
                  >
                    {tagValue}
                  </Tag>
                )}
              </div>
            );
          })}
          {value.length === 0 && (
            <div
              className={cx(
                "w-full outline-none truncate text-neutral-70 dark:text-neutral-70-dark",
                {
                  "text-14px py-0.5": size === "default",
                  "text-18px py-0.5": size === "large",
                }
              )}
            >
              {placeholder}
            </div>
          )}
        </div>
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={focused && !!value}
          onClear={handleClearValue}
        >
          {(!focused || !value) && (
            <Icon
              name="calendar"
              strokeWidth={2}
              size={20}
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
        maxHeight={320}
      >
        {dropdownContent}
      </InputDropdown>
    </div>
  );
};

MultipleDatePicker.isFormInput = true;

export default MultipleDatePicker;
