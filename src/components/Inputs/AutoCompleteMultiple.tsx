import React from 'react';
import cx from 'classnames';
import Tag from '../Displays/Tag';
import Icon from '../Icon';
import InputDropdown from './InputDropdown';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';
import { useInView } from 'react-intersection-observer';
import { FETCH_LIMIT } from '../../const/select';
import { useDebouncedCallback } from 'use-debounce';
import { AutoCompleteMultipleProps, SelectValue } from '../../types';

/**
 * An autocomplete where multiple options can be selected
 */
const AutoCompleteMultiple = <T, D>({
  id,
  name,
  value: valueProp,
  defaultValue = [],
  initialValue = [],
  label,
  labelPosition = 'top',
  autoHideLabel = false,
  placeholder = '',
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
}: AutoCompleteMultipleProps<T, D>) => {
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

  const [internalValue, setInternalValue] = React.useState<SelectValue<T, D>[]>(
    options.filter((item) => defaultValue.includes(item.value)) || initialValue,
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
      options.filter((item) =>
        defaultValue.map((v) => v).includes(item.value),
      ) || [],
    );
  }, [optionsProp]);

  const isControlled = valueProp !== undefined;
  const value = valueProp ?? internalValue; // Default to internal state if undefined

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

      if (!dropdownContainsTarget && !selectElementContainsTarget) {
        setDropdownOpen(false);
        setFocused(false); // Add this line to ensure 'focused' is set to false
      }
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
    onChange?.([]); // Clear with an empty array
    if (!isControlled) setInternalValue([]); // Update internal state if uncontrolled
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(e.target.value ? 0 : -1);

    const input = e.target.value.toLowerCase();
    if (async) {
      debouncedSearch(input);
    } else {
      const filtered = options.find(
        ({ label }) => label.toLowerCase() === input,
      );
      if (filtered) {
        handleSelectOption(filtered);
      }
    }
  };

  const handleSelectOption = (option: SelectValue<T, D>) => {
    const selected = value?.some((v) => v.value === option.value);

    let newValue: SelectValue<T, D>[];
    if (selected) {
      newValue = value.filter((v) => v.value !== option.value);
    } else {
      newValue = [...(value || []), option];
    }

    if (!isControlled) setInternalValue(newValue); // Update internal state if uncontrolled
    onChange?.(newValue);
  };

  const handleAppend = () => {
    if (inputValue.length === 0 || !appendIfNotFound) return;

    const newValue = {
      label: inputValue,
      value: inputValue as T,
    };
    setAppendOptions((prev) => [...prev, newValue]);
    handleSelectOption(newValue);
    setInputValue('');
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
      setInputValue('');
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
        : filteredOptions.map((option, index) => {
            const selected = value?.some((v) => v.value === option.value);

            return (
              <div
                role="button"
                key={String(option.value)}
                onClick={() => handleSelectOption(option)}
                onMouseOver={() => setHighlightedIndex(index)}
                data-highlighted={highlightedIndex === index + isCreateNew}
                className={cx(
                  'cursor-pointer py-1.5 px-4 hover:bg-neutral-20 dark:hover:bg-neutral-20-dark text-left break-words',
                  {
                    'text-14px': size === 'default',
                    'text-18px': size === 'large',
                    '!bg-neutral-20 !dark:bg-neutral-20-dark':
                      highlightedIndex === index + isCreateNew,
                    'flex items-center justify-between gap-2.5 bg-primary-surface dark:bg-primary-surface-dark text-primary-main dark:text-primary-main-dark':
                      selected,
                    'text-neutral-100 dark:text-neutral-100-dark': !selected,
                  },
                )}
              >
                <span>{option.label}</span>
                {selected && (
                  <Icon
                    name="check"
                    size={10}
                    strokeWidth={3}
                    className="text-primary-main dark:text-primary-main-dark"
                  />
                )}
              </div>
            );
          })}
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
          <div className="flex flex-col items-center gap-4 text center text-neutral-60 text-16px dark:text-neutral-60-dark">
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

  const inputId = `autocompletemultiple-${id || name}-${React.useId()}`;

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
        <div
          className={cx('flex flex-1 gap-x-2 gap-y-1 items-center flex-wrap', {
            'w-full': fullWidth,
          })}
        >
          {value?.map((selected) => (
            <Tag key={String(selected.value)} color="info">
              {selected.label}
            </Tag>
          ))}
          <input
            {...props}
            tabIndex={disabled ? -1 : 0}
            id={inputId}
            name={name}
            value={focused ? inputValue : ''}
            onChange={handleChangeInput}
            placeholder={focused ? '' : placeholder}
            className={cx(
              'flex-grow outline-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark disabled:cursor-not-allowed',
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
            ref={valueRef}
            onKeyDown={handleKeyDown}
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

AutoCompleteMultiple.isFormInput = true;

export default AutoCompleteMultiple;
