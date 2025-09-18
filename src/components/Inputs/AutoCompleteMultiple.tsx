import React from "react";
import cx from "classnames";
import { SelectValue } from "../../types/input";
import Tag from "../Displays/Tag";
import Icon from "../Icon";
import InputDropdown from "./InputDropdown";
import InputEndIconWrapper from "./InputEndIconWrapper";
import InputHelper from "./InputHelper";
import InputLabel from "./InputLabel";

export interface AutoCompleteMultipleRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D>[];
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

interface BaseAutoCompleteMultipleProps<T, D = undefined>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "defaultValue" | "size" | "required" | "checked"
  > {
  value?: SelectValue<T, D>[];
  defaultValue?: T[];
  label?: string;
  labelPosition?: "top" | "left";
  autoHideLabel?: boolean;
  placeholder?: string;
  options: SelectValue<T, D>[];
  onChange?: (value: SelectValue<T, D>[]) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<AutoCompleteMultipleRef<T> | null>
    | React.RefCallback<AutoCompleteMultipleRef<T> | null>;
  size?: "default" | "large";
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  clearable?: boolean;
  width?: number;
  required?: boolean;
}

interface AutoCompleteMultipleWithoutAppendProps<T, D = undefined>
  extends BaseAutoCompleteMultipleProps<T, D> {
  appendIfNotFound?: false;
  onAppend?: (input: SelectValue<T, D>) => never;
}
interface AutoCompleteMultipleWithAppendProps<T, D = undefined>
  extends BaseAutoCompleteMultipleProps<T, D> {
  appendIfNotFound: true;
  onAppend: (input: SelectValue<T>) => void;
}

export type AutoCompleteMultipleProps<T, D = undefined> =
  | AutoCompleteMultipleWithoutAppendProps<T, D>
  | AutoCompleteMultipleWithAppendProps<T, D>;

/**
 * An autocomplete where multiple options can be selected
 */
const AutoCompleteMultiple = <T, D = undefined>({
  id,
  name,
  value: valueProp,
  defaultValue = [],
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
  appendIfNotFound,
  onAppend,
  required,
  ...props
}: AutoCompleteMultipleProps<T, D>) => {
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

  const [internalValue, setInternalValue] = React.useState<SelectValue<T, D>[]>(
    options.filter((item) => defaultValue.includes(item.value)) || []
  );

  React.useEffect(() => {
    setInternalValue(
      options.filter((item) =>
        defaultValue.map((v) => v).includes(item.value)
      ) || []
    );
  }, [optionsProp]);

  const isControlled = valueProp !== undefined;
  const value = valueProp ?? internalValue; // Default to internal state if undefined
  const [inputValue, setInputValue] = React.useState("");

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value: value as SelectValue<T, undefined>[],
    focus: () => {
      valueRef.current?.focus();
    },
    reset: () => {
      setInternalValue([]);
    },
    disabled,
  }));

  React.useEffect(() => {
    const filtered = options.filter(
      (option) =>
        !inputValue ||
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, optionsProp, value]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownContainsTarget = dropdownRef.current?.contains(target);
      const selectElementContainsTarget = elementRef.current?.contains(target);

      if (!dropdownContainsTarget && !selectElementContainsTarget) {
        setDropdownOpen(false);
        setFocused(false); // Add this line to ensure 'focused' is set to false
      }
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
  };

  const handleClearValue = () => {
    setDropdownOpen(true);
    onChange?.([]); // Clear with an empty array
    if (!isControlled) setInternalValue([]); // Update internal state if uncontrolled
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleOptionSelect = (option: SelectValue<T, D>) => {
    const newValue = [...(value || []), option];
    setInputValue("");
    if (!isControlled) setInternalValue(newValue); // Update internal state if uncontrolled
    onChange?.(newValue);
  };

  const handleRemoveSelected = (option: SelectValue<T, D>) => {
    const newValue = value.filter((v) => v.value !== option.value);
    setInputValue("");
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleAppend = () => {
    if (inputValue.length === 0 || !appendIfNotFound) return;

    const newValue = {
      label: inputValue,
      value: inputValue as T,
    };
    setInjectOptions((prev) => [...prev, newValue]);
    handleOptionSelect(newValue);
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
      {filteredOptions.map((option) => {
        const selected = value?.some((v) => v.value === option.value);

        return selected ? (
          <div
            role="button"
            key={String(option.value)}
            onMouseDown={() => handleRemoveSelected(option)}
            className={cx(
              "cursor-pointer py-1.5 px-4 hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-left break-words flex items-center justify-between gap-2.5 bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark",
              {
                "text-14px": size === "default",
                "text-18px": size === "large",
              }
            )}
          >
            <span>{option.label}</span>
            <Icon
              name="check"
              size={10}
              strokeWidth={3}
              className="text-primary-main dark:text-primary-main-dark"
            />
          </div>
        ) : (
          <div
            role="button"
            key={String(option.value)}
            onMouseDown={() => handleOptionSelect(option)}
            className={cx(
              "cursor-pointer py-1.5 px-4 hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-left break-words text-neutral-100 dark:text-neutral-100-dark",
              {
                "text-14px": size === "default",
                "text-18px": size === "large",
              }
            )}
          >
            {option.label}
          </div>
        );
      })}
      {((optionsProp.length === 0 && !inputValue) ||
        (!appendIfNotFound && filteredOptions.length === 0)) && (
        <div className="flex flex-col items-center gap-4 text center text-neutral-60 text-16px dark:text-neutral-60-dark">
          <div className="h-12 w-12 bg-neutral-60 dark:bg-neutral-60-dark flex items-center justify-center rounded-full text-neutral-10 dark:text-neutral-10-dark text-36px font-semibold mt-1">
            !
          </div>
          <div>Empty Option</div>
        </div>
      )}
    </>
  );

  const inputId = `autocompletemultiple-${id || name}-${React.useId()}`;

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
        <div
          className={cx("flex flex-1 gap-x-2 gap-y-1 items-center flex-wrap", {
            "w-full": fullWidth,
          })}
        >
          {value?.map((selected) => (
            <Tag key={String(selected.value)} color="info">
              {selected.label}
            </Tag>
          ))}
          <input
            {...props}
            tabIndex={!disabled ? 0 : -1}
            id={inputId}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={focused ? "" : placeholder}
            className={cx(
              "flex-grow outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark disabled:cursor-not-allowed",
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
          />
        </div>
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

AutoCompleteMultiple.isFormInput = true;

export default AutoCompleteMultiple;
