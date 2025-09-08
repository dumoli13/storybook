import React from 'react';
import cx from 'classnames';
import InputEndIconWrapper from './InputEndIconWrapper';
import InputHelper from './InputHelper';
import InputLabel from './InputLabel';

export interface TextAreaRef {
  element: HTMLTextAreaElement | null;
  value: string;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface TextAreaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onChange' | 'size' | 'required' | 'checked'
  > {
  value?: string;
  defaultValue?: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: string) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<TextAreaRef | null>
    | React.RefCallback<TextAreaRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  lines?: number;
  width?: number;
}

/**
 * The Text Area component is used for collecting large amounts of text from users.
 */
const TextArea = ({
  id,
  value: valueProp,
  defaultValue,
  label,

  labelPosition = 'top',
  autoHideLabel = false,
  onChange,
  className,
  helperText,
  placeholder = '',
  disabled: disabledProp = false,
  fullWidth,
  startIcon,
  endIcon,
  inputRef,
  size = 'default',
  error: errorProp,
  success: successProp,
  loading = false,
  lines: minLines = 2,
  width,
  ...props
}: TextAreaProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const elementRef = React.useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue?.toString() ?? '',
  );
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp.toString() : internalValue;

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
      setInternalValue('');
    },
    disabled,
  }));

  const handleFocus = () => {
    if (disabled) return;
    setFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;

    const selectElementContainsTarget =
      parentRef.current?.contains(relatedTarget);

    if (selectElementContainsTarget) {
      return;
    }

    setFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    if (!isControlled) {
      setInternalValue(newValue);
    }
  };

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
          ' relative px-4 border rounded-md flex gap-2 items-start',
          {
            'w-full': fullWidth,
            'border-danger-main dark:border-danger-main-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
              isError,
            'border-success-main dark:border-success-main-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
              !isError && successProp,
            'border-neutral-50 dark:border-neutral-50-dark hover:border-primary-hover dark:hover:border-primary-hover-dark focus:ring-primary-main dark:focus:ring-primary-main-dark':
              !isError && !successProp,
            'bg-neutral-20 dark:bg-neutral-30-dark cursor-not-allowed text-neutral-60 dark:text-neutral-60-dark':
              disabled,
            'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-3': !disabled,
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
        <textarea
          {...props}
          tabIndex={!disabled ? 0 : -1}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={focused ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cx(
            'w-full outline-none resize-none bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-30-dark disabled:cursor-not-allowed',
            {
              'text-14px py-0.5': size === 'default',
              'text-18px py-0.5': size === 'large',
            },
          )}
          disabled={disabled}
          rows={minLines}
          style={{
            minHeight: `${minLines * 24}px`,
          }}
          aria-label={label}
          ref={elementRef}
        />
        <InputEndIconWrapper
          loading={loading}
          error={isError}
          success={successProp}
          endIcon={endIcon}
        />
      </div>
      <InputHelper message={helperMessage} error={isError} size={size} />
    </div>
  );
};

TextArea.isFormInput = true;

export default TextArea;
