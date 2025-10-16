import React from 'react';
import cx from 'classnames';
import { useInView } from 'react-intersection-observer';
import { useDebouncedCallback } from 'use-debounce';
import InputDropdown from './InputDropdown';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';
import Icon from '../Icon';
import { FETCH_LIMIT } from '../../const/select';
import { AutoCompleteProps, SelectValue } from '../../types';

/**
 * The autocomplete is a normal text input enhanced by a panel of suggested options.
 */
const AutoComplete = <T, D = undefined>({
  id,
  name,
  value: valueProp,
  defaultValue,
  initialValue = null,
  label,
  labelPosition = 'top',
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
  size = 'default',
  error: errorProp,
  success: successProp,
  loading = false,
  clearable = false,
  width,
  appendIfNotFound,
  onAppend,
  required,
  renderOption,
  async,
  fetchOptions,
  onKeyDown,
  ...props
}: AutoCompleteProps<T, D>) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const valueRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { ref: refInView, inView } = useInView({ threshold: 0.1 });

  const [focused, setFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const [loadingFetchOptions, setLoadingFetchOptions] = React.useState(!!async);
  const [stopAsyncFetch, setStopAsyncFetch] = React.useState(false);
  const [asyncOptions, setAsyncOptions] = React.useState<SelectValue<T, D>[]>(
    optionsProp || [],
  );
  const [appendOptions, setAppendOptions] = React.useState<SelectValue<T, D>[]>(
    [],
  );
  const [inputValue, setInputValue] = React.useState('');
  const [page, setPage] = React.useState(0);

  const options = React.useMemo(() => {
    const sourceOptions = async ? asyncOptions : optionsProp;
    const combinedOptions = [...appendOptions, ...sourceOptions];

    return Array.from(
      new Map(combinedOptions.map((item) => [item.label, item])).values(),
    );
  }, [async, optionsProp, asyncOptions, appendOptions]);

  const [internalValue, setInternalValue] = React.useState<SelectValue<
    T,
    D
  > | null>(
    options.find((item) => item.value === defaultValue) || initialValue,
  );

  const filteredOptions = React.useMemo(() => {
    if (async) return options;

    const filterKeyword = inputValue.trim().toLowerCase();
    return options.filter(
      (option) =>
        !inputValue || option.label.toLowerCase().includes(filterKeyword),
    );
  }, [async, inputValue, options]);

  React.useEffect(() => {
    setInternalValue(
      options.find(
        (item) => item.value === (internalValue?.value ?? defaultValue),
      ) || null,
    );
  }, [optionsProp]);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const helperMessage = errorProp ?? helperText;
  const isError = !!errorProp;
  const disabled = loading || disabledProp;

  React.useImperativeHandle(inputRef, () => ({
    element: elementRef.current,
    value,
    focus: () => valueRef.current?.focus(),
    reset: () => setInternalValue(initialValue),
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

      setFocused(false);
      setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    const getAsyncOptions = async () => {
      setLoadingFetchOptions(true);
      const newPage = page + 1;
      const response = await fetchOptions(inputValue, newPage, FETCH_LIMIT);
      setPage(newPage);
      if (response.length < FETCH_LIMIT) {
        setStopAsyncFetch(true);
      }
      setAsyncOptions((prev) => [...prev, ...response]);
      setLoadingFetchOptions(false);
    };

    if (async && inView && !stopAsyncFetch) getAsyncOptions();
  }, [async, inView, dropdownOpen]);

  const handleFetchOption = async (keyword: string) => {
    // Fetch new options and reset page
    setAsyncOptions([]);
    setStopAsyncFetch(false);
    setLoadingFetchOptions(true);
    const newPage = 1;
    const response = await fetchOptions(keyword, newPage, FETCH_LIMIT);
    setPage(newPage);
    if (response.length < FETCH_LIMIT) {
      setStopAsyncFetch(true);
    }
    setAsyncOptions(response);
    setLoadingFetchOptions(false);
  };

  const debouncedSearch = useDebouncedCallback(
    (keyword: string) => handleFetchOption(keyword),
    500,
  );

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
    setHighlightedIndex(-1);
    setInputValue('');
  };

  const handleDropdown = () => {
    setFocused(true);
    setDropdownOpen((prev) => !prev);
  };

  const handleClearValue = () => {
    setDropdownOpen(true);
    onChange?.(null);
    if (!isControlled) setInternalValue(null);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(e.target.value ? 0 : -1);

    const input = e.target.value.toLowerCase();
    if (async) {
      debouncedSearch(input);
    } else {
      // if what user typed exactly match with any option, select it
      const filtered = options.find(
        ({ label }) => label.toLowerCase() === input,
      );

      if (filtered) {
        handleSelectOption(filtered);
        setInputValue('');
      }
    }
  };

  const handleSelectOption = (option: SelectValue<T, D>) => {
    if (value?.value === option.value) return;

    if (!isControlled) {
      setInternalValue(option);
    }

    onChange?.(option);
    setFocused(false);
    setDropdownOpen(false);
  };

  const handleAppend = () => {
    if (inputValue.length === 0 || !appendIfNotFound) return;

    const newValue = {
      label: inputValue,
      value: inputValue as T,
    };
    setAppendOptions((prev) => [...prev, newValue]);
    if (!isControlled) {
      setInternalValue(newValue);
    }

    setInputValue('');
    setDropdownOpen(false);
    setFocused(false);
    onAppend?.(newValue);
  };

  const isCreateNew =
    appendIfNotFound &&
    inputValue &&
    !options.some((option) => option.label === inputValue)
      ? 1
      : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = filteredOptions.length - 1 + isCreateNew;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!dropdownOpen) {
        setFocused(true);
        setInputValue('');
        setDropdownOpen(true);
      }
      setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!dropdownOpen) {
        setFocused(true);
        setInputValue('');
        setDropdownOpen(true);
      }
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setDropdownOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Enter' && dropdownOpen) {
      e.preventDefault();
      if (isCreateNew && highlightedIndex === 0) {
        handleAppend();
        return;
      }
      if (highlightedIndex > -1) {
        handleSelectOption(filteredOptions[highlightedIndex - isCreateNew]);
      }
    } else {
      onKeyDown?.(e);
    }
  };

  const dropdownContent = (
    <>
      {!!isCreateNew && (
        <div
          role="button"
          onClick={handleAppend}
          data-highlighted={highlightedIndex === 0}
          className={cx(
            'w-full py-1.5 px-4 text-left break-words cursor-pointer hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100 dark:text-neutral-100-dark',
            {
              'text-14px': size === 'default',
              'text-18px': size === 'large',
              '!bg-neutral-20 !dark:bg-neutral-20-dark': highlightedIndex === 0,
            },
          )}
        >
          Create <b>{inputValue}</b>...
        </div>
      )}
      {renderOption
        ? renderOption(
            filteredOptions,
            handleSelectOption,
            value,
            highlightedIndex,
          )
        : filteredOptions.map((option, index) => (
            <div
              role="button"
              key={String(option.value)}
              onClick={() => handleSelectOption(option)}
              onMouseOver={() => setHighlightedIndex(index)}
              data-highlighted={highlightedIndex === index + isCreateNew}
              className={cx(
                'select-text w-full py-1.5 px-4 text-left break-words',
                {
                  'text-14px': size === 'default',
                  'text-18px': size === 'large',
                  'cursor-default bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark':
                    value && option.value === value.value,
                  'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-neutral-100 dark:text-neutral-100-dark':
                    option.value !== value?.value,
                  '!bg-neutral-20 !dark:bg-neutral-20-dark':
                    highlightedIndex === index + isCreateNew,
                },
              )}
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
      {!loading &&
        !loadingFetchOptions &&
        ((options.length === 0 && !inputValue) ||
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

  React.useEffect(() => {
    if (!dropdownRef.current || highlightedIndex < 0) return;

    // Find any element that is marked as the highlighted one
    const activeItem = dropdownRef.current.querySelector(
      '[data-highlighted="true"]',
    ) as HTMLElement | null;

    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [highlightedIndex, dropdownContent]);

  const inputId = `autocomplete-${id || name}-${React.useId()}`;

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
        ref={elementRef}
      >
        {!!startIcon && (
          <div className="text-neutral-70 dark:text-neutral-70-dark">
            {startIcon}
          </div>
        )}
        <input
          {...props}
          tabIndex={disabled ? -1 : 0}
          id={inputId}
          name={name}
          value={focused ? inputValue : ''}
          onChange={handleChangeInput}
          placeholder={focused ? '' : value?.label || placeholder}
          className={cx(
            'w-full outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark text-neutral-90 dark:text-neutral-90-dark disabled:cursor-not-allowed',
            {
              'text-14px py-0.5': size === 'default',
              'text-18px py-0.5': size === 'large',
              'placeholder:text-neutral-100 dark:placeholder:text-neutral-100-dark':
                value?.label,
            },
          )}
          disabled={disabled}
          aria-label={label}
          autoComplete="off"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleFocus}
          ref={valueRef}
          onKeyDown={handleKeyDown}
        />
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
                'rounded-full p-0.5 text-neutral-70 dark:text-neutral-70-dark hover:bg-neutral-30 dark:hover:bg-neutral-30-dark cursor-pointer transition-color',
                {
                  'rotate-180': dropdownOpen,
                },
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

AutoComplete.isFormInput = true;

export default AutoComplete;
