import React from "react";
import cx from "classnames";
import { SelectValue } from "../../types/input";
import Icon from "../Icon";
import InputDropdown from "./InputDropdown";
import InputEndIconWrapper from "./InputEndIconWrapper";
import InputHelper from "./InputHelper";
import InputLabel from "./InputLabel";
import { useInView } from "react-intersection-observer";
import { FETCH_LIMIT } from "../../const/select";

export interface SelectRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D> | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

interface BaseProps<T, D = undefined>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "defaultValue" | "size" | "required" | "checked"
  > {
  value?: SelectValue<T, D> | null;
  defaultValue?: T | null;
  label?: string;
  labelPosition?: "top" | "left";
  autoHideLabel?: boolean;
  placeholder?: string;
  onChange?: (value: SelectValue<T, D> | null) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<SelectRef<T> | null>
    | React.RefCallback<SelectRef<T> | null>;
  size?: "default" | "large";
  error?: boolean | string;
  success?: boolean;
  clearable?: boolean;
  width?: number;
  required?: boolean;
  renderOption?: (
    option: Array<SelectValue<T, D>>,
    onClick: (value: SelectValue<T, D>) => void,
    selected: SelectValue<T, D> | null
  ) => React.ReactNode;
}

interface AsyncProps<T, D> {
  async: true;
  fetchOptions: (page: number, limit: number) => Promise<SelectValue<T, D>[]>;
  options?: never;
  loading?: never;
}

interface NonAsyncProps<T, D> {
  async?: false;
  fetchOptions?: never;
  options: SelectValue<T, D>[];
  loading?: boolean;
}

export type SelectProps<T, D = undefined> =
  | (BaseProps<T, D> & AsyncProps<T, D>)
  | (BaseProps<T, D> & NonAsyncProps<T, D>);

/**
 * Select components are used for collecting user provided information from a list of options.
 */
const Select = <T, D = undefined>({
  id,
  name,
  value: valueProp,
  defaultValue,
  label,
  labelPosition = "top",
  autoHideLabel = false,
  placeholder = "",
  options: optionsProp,
  onChange,
  className,
  helperText,
  disabled: disabledProp = false,
  fullWidth,
  startIcon,
  endIcon,
  inputRef,
  size = "default",
  error: errorProp,
  success: successProp,
  loading = false,
  clearable = false,
  width,
  required,
  renderOption,
  async,
  fetchOptions,
}: SelectProps<T, D>) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [focused, setFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const { ref: refInView, inView } = useInView({ threshold: 0.1 });
  const [loadingFetchOptions, setLoadingFetchOptions] = React.useState(!!async);
  const [stopAsyncFetch, setStopAsyncFetch] = React.useState(false);
  const [inheritOptions, setInheritOptions] = React.useState<
    SelectValue<T, D>[]
  >(optionsProp || []);

  const [page, setPage] = React.useState(0);

  const options = React.useMemo(
    () => (async ? inheritOptions : optionsProp),
    [async, optionsProp, inheritOptions]
  );

  const [internalValue, setInternalValue] = React.useState<SelectValue<
    T,
    D
  > | null>(options.find((item) => item.value === defaultValue) || null);

  React.useEffect(() => {
    setInternalValue(
      options.find(
        (item) => item.value === (internalValue?.value ?? defaultValue)
      ) || null
    );
  }, [optionsProp]);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value: value as SelectValue<T, undefined>,
    focus: () => valueRef.current?.focus(),
    reset: () => setInternalValue(null),
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

      setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    const getAsyncOptions = async () => {
      setLoadingFetchOptions(true);
      const newPage = page + 1;
      const response = await fetchOptions(newPage, FETCH_LIMIT);
      setPage(newPage);
      if (response.length < FETCH_LIMIT) {
        setStopAsyncFetch(true);
      }
      setInheritOptions((prev) => [...prev, ...response]);
      setLoadingFetchOptions(false);
    };

    if (async && inView && !stopAsyncFetch) getAsyncOptions();
  }, [async, inView, dropdownOpen]);

  const handleFocus = () => {
    if (disabled) return;
    setFocused(true);
    setDropdownOpen(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;

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
    setDropdownOpen((prev) => !prev);
  };

  const handleClearValue = () => {
    setDropdownOpen(true);
    onChange?.(null);
    if (!isControlled) setInternalValue(null);
  };

  const handleOptionSelect = (option: SelectValue<T, D>) => {
    if (value?.value === option.value) return;

    if (!isControlled) setInternalValue(option);
    onChange?.(option);

    setFocused(false);
    setDropdownOpen(false);
  };

  const dropdownContent = (
    <>
      {renderOption
        ? renderOption(options, handleOptionSelect, value)
        : options.map((option) => (
            <div
              role="button"
              key={String(option.value)}
              onClick={() => handleOptionSelect(option)}
              className={cx("py-1.5 px-4 text-left break-words", {
                "bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark":
                  option.value === value?.value,
                "cursor-pointer hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100 dark:text-neutral-100-dark":
                  option.value !== value?.value,
                "text-14px": size === "default",
                "text-18px": size === "large",
              })}
            >
              {option.label}
            </div>
          ))}
      <div ref={refInView} />
      {(loading || loadingFetchOptions) && (
        <Icon
          name="loader"
          size={24}
          strokeWidth={2}
          animation="spin"
          className="p-2 text-neutral-60 dark:text-neutral-60-dark"
        />
      )}
      {!loadingFetchOptions && options.length === 0 && (
        <div className="flex flex-col items-center gap-4 text center text-neutral-60 dark:text-neutral-60-dark text-16px">
          <div className="h-12 w-12 bg-neutral-60 dark:bg-neutral-60-dark flex items-center justify-center rounded-full text-neutral-10 dark:text-neutral-10-dark text-36px font-semibold mt-1">
            !
          </div>
          <div>Empty Option</div>
        </div>
      )}
    </>
  );

  const inputId = `select-${id || name}-${React.useId()}`;

  return (
    <div
      className={cx(
        "relative",
        {
          "w-full": fullWidth,
          "flex items-center gap-4": labelPosition === "left",
        },
        className
      )}
    >
      {((autoHideLabel && focused) || !autoHideLabel) && label && (
        <InputLabel id={inputId} size={size} required={required}>
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
            "border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark":
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
        {!!startIcon && (
          <div className="text-neutral-70 dark:text-neutral-70-dark">
            {startIcon}
          </div>
        )}
        <div
          role="button"
          tabIndex={!disabled ? 0 : -1}
          aria-pressed="true"
          className={cx("w-full outline-none truncate", {
            "text-14px py-0.5": size === "default",
            "text-18px py-0.5": size === "large",
            "text-neutral-60 dark:text-neutral-60-dark": !value || !value.label,
            "!bg-neutral-20 dark:!bg-neutral-30-dark cursor-not-allowed":
              disabled,
          })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleFocus}
          ref={valueRef}
        >
          {value?.label ?? placeholder}
        </div>
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={clearable && focused && !!value}
          onClear={handleClearValue}
          endIcon={endIcon}
        >
          {disabled ? (
            <Icon
              name="chevron-down"
              size={20}
              strokeWidth={2}
              className="p-0.5 text-neutral-70 dark:text-neutral-70-dark"
            />
          ) : (
            <Icon
              name="chevron-down"
              size={20}
              strokeWidth={2}
              onClick={handleDropdown}
              className={cx(
                "rounded-full p-0.5 text-neutral-70 dark:text-neutral-70-dark hover:bg-neutral-30 dark:hover:bg-neutral-30-dark cursor-pointer transition-color",
                {
                  "rotate-180": dropdownOpen,
                }
              )}
            />
          )}
        </InputEndIconWrapper>
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
      <InputDropdown
        open={dropdownOpen}
        elementRef={elementRef}
        dropdownRef={dropdownRef}
        fullWidth
      >
        {dropdownContent}
      </InputDropdown>
    </div>
  );
};

Select.isFormInput = true;

export default Select;
