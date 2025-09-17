import React from "react";
import cx from "classnames";
import { SelectValue } from "../../types/input";
import Icon from "../Icon";
import InputDropdown from "./InputDropdown";
import InputEndIconWrapper from "./InputEndIconWrapper";
import InputHelper from "./InputHelper";
import InputLabel from "./InputLabel";

export interface AutoCompleteRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D> | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

interface BaseAutoCompleteProps<T, D = undefined>
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
  options: SelectValue<T, D>[];
  onChange?: (value: SelectValue<T, D> | null) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<AutoCompleteRef<T> | null>
    | React.RefCallback<AutoCompleteRef<T> | null>;
  size?: "default" | "large";
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  clearable?: boolean;
  width?: number;
}

interface AutoCompleteWithoutAppendProps<T, D = undefined>
  extends BaseAutoCompleteProps<T, D> {
  appendIfNotFound?: false;
  onAppend?: (input: SelectValue<T, D>) => never;
}

interface AutoCompleteWithAppendProps<T, D = undefined>
  extends BaseAutoCompleteProps<T, D> {
  appendIfNotFound: true;
  onAppend: (input: SelectValue<T, D>) => void;
}

export type AutoCompleteProps<T, D = undefined> =
  | AutoCompleteWithoutAppendProps<T, D>
  | AutoCompleteWithAppendProps<T, D>;

/**
 * The autocomplete is a normal text input enhanced by a panel of suggested options.
 */
const AutoComplete = <T, D = undefined>({
  id,
  name,
  value: valueProp,
  defaultValue,
  label,
  labelPosition = "top",
  autoHideLabel = false,
  placeholder,
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
  appendIfNotFound,
  onAppend,
  ...props
}: AutoCompleteProps<T, D>) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const valueRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [focused, setFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [injectOptions, setInjectOptions] = React.useState<SelectValue<T, D>[]>(
    []
  );

  const options = React.useMemo(
    () =>
      Array.from(
        new Map(
          [...injectOptions, ...optionsProp].map((item) => [item.label, item])
        ).values()
      ),
    [optionsProp, injectOptions]
  );

  const [filteredOptions, setFilteredOptions] = React.useState<
    SelectValue<T, D>[]
  >([]);

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
  const [inputValue, setInputValue] = React.useState(value?.label ?? "");

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value: value as SelectValue<T, undefined>,
    focus: () => {
      valueRef.current?.focus();
    },
    reset: () => {
      setInternalValue(null);
    },
    disabled,
  }));

  React.useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value]);

  React.useEffect(() => {
    const filtered = options.filter(
      (option) =>
        !inputValue ||
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownContainsTarget = dropdownRef.current?.contains(target);
      const selectElementContainsTarget = elementRef.current?.contains(target);

      if (dropdownContainsTarget || selectElementContainsTarget) {
        elementRef.current?.focus();
        return;
      }

      setFocused(false);
      setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    if (disabled) return;
    setFocused(true);
    setDropdownOpen(true);
    setFilteredOptions(options);
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
    setFocused(true);
    setDropdownOpen((prev) => !prev);
    setFilteredOptions(options);
  };

  const handleClearValue = () => {
    setDropdownOpen(true);
    onChange?.(null);
    if (!isControlled) setInternalValue(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.length === 0) {
      handleClearValue();
    } else {
      const filtered = options.find(
        (option) => option.label.toLowerCase() === newValue.toLowerCase()
      );

      if (filtered) {
        onChange?.(filtered);
        if (!isControlled) {
          setInternalValue(filtered);
        }
      }
    }
  };

  const handleOptionSelect = (option: SelectValue<T, D>) => {
    onChange?.(option);
    if (!isControlled) {
      setInternalValue(option);
      setInputValue(option.label);
    }

    setFocused(false);
    setDropdownOpen(false);
  };

  const handleAppend = () => {
    if (inputValue.length === 0 || !appendIfNotFound) return;

    const newValue = {
      label: inputValue,
      value: inputValue as T,
    };
    setInjectOptions((prev) => [...prev, newValue]);
    if (!isControlled) {
      setInternalValue(newValue);
    }

    setFocused(false);
    setDropdownOpen(false);
    onAppend(newValue);
  };

  const dropdownContent = (
    <>
      {appendIfNotFound &&
        inputValue &&
        !options.find((option) => option.label === inputValue) && (
          <div
            role="button"
            onClick={handleAppend}
            className={cx(
              "py-1.5 px-4 text-left break-words cursor-pointer bg-neutral-15 dark:bg-neutral-15-dark hover:bg-neutral-20 dark:hover:bg-neutral-20-dark",
              {
                "text-14px": size === "default",
                "text-18px": size === "large",
              }
            )}
          >
            Create <b>{inputValue}</b>...
          </div>
        )}
      {filteredOptions.map((option) => (
        <div
          role="button"
          key={String(option.value)}
          onClick={() => handleOptionSelect(option)}
          className={cx("py-1.5 px-4 text-left break-words", {
            "bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark":
              option.value === value?.value,
            "cursor-pointer hover:bg-neutral-20 dark:hover:bg-neutral-20-dark ":
              option.value !== value?.value,
            "text-14px": size === "default",
            "text-18px": size === "large",
          })}
        >
          {option.label}
        </div>
      ))}
      {((optionsProp.length === 0 && !inputValue) ||
        (!appendIfNotFound && filteredOptions.length === 0)) && (
        <div className="flex flex-col items-center gap-4 text center text-neutral-60 dark:text-neutral-60-dark text-16px">
          <div className="h-12 w-12 bg-neutral-60 dark:bg-neutral-60-dark flex items-center justify-center rounded-full text-neutral-10 dark:text-neutral-10-dark text-36px font-semibold mt-1">
            !
          </div>
          <div>Empty Option</div>
        </div>
      )}
    </>
  );

  const inputId = `autocomplete-${id || name}-${React.useId()}`;

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
        <InputLabel id={inputId} size={size}>
          {label}
        </InputLabel>
      )}
      <div
        className={cx(
          " relative px-3 border rounded-md flex gap-2 items-center",
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
        style={width ? { width } : undefined}
        ref={elementRef}
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
          value={inputValue}
          onChange={handleInputChange}
          placeholder={focused ? "" : placeholder}
          className={cx(
            "w-full outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark text-neutral-90 dark:text-neutral-90-dark disabled:cursor-not-allowed",
            {
              "text-14px py-0.5": size === "default",
              "text-18px py-0.5": size === "large",
            }
          )}
          disabled={disabled}
          aria-label={label}
          autoComplete="off"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleFocus}
          ref={valueRef}
        />
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          clearable={clearable && focused && !!value}
          onClear={handleClearValue}
          endIcon={endIcon}
        >
          <Icon
            name="chevron-down"
            size={20}
            strokeWidth={2}
            onClick={handleDropdown}
            className={cx(
              "rounded-full p-0.5 text-neutral-70 dark:text-neutral-70-dark",
              {
                "cursor-not-allowed": disabled,
                "hover:bg-neutral-30 dark:hover:bg-neutral-30-dark cursor-pointer transition-color":
                  !disabled,
                "rotate-180": dropdownOpen,
              }
            )}
          />
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

AutoComplete.isFormInput = true;

export default AutoComplete;
