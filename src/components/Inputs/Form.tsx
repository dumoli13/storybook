import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EMAIL_REGEX, URL_REGEX } from '../../const/regex';
import { InputProps, InputPropsRefType } from '../../types/input';
import { ButtonProps } from './Button';

export interface FormRef<T> {
  submit: () => Promise<void>;
  reset: () => void;
  validate: () => string[];
  getValues: () => Partial<T>;
  getErrors: () => Record<string, string | undefined>;
  setErrors: (errors: Record<string, string | undefined>) => void;
}

export type FormRule =
  | {
      required?: boolean;
      email?: boolean;
      url?: boolean;
      pattern?: RegExp | string;
      minLength?: number;
      maxLength?: number;
      exactLength?: number;
      min?: number;
      max?: number;
      equal?: any;
      validate?: (value: any) => string[];
      message?: string;
    }
  | 'required'
  | 'email'
  | 'url';

export type FormRules = Record<string, FormRule[]>;

const normalizeRule = (rule: FormRule) => {
  if (typeof rule === 'string') {
    switch (rule) {
      case 'required':
        return { required: true };
      case 'email':
        return { email: true };
      case 'url':
        return { url: true };
      default:
        return {};
    }
  }
  return rule;
};

export interface FormProps<T> {
  onSubmit?: (values: T) => Promise<void> | void;
  onReset?: () => void;
  className?: string;
  children: React.ReactNode;
  rules?: FormRules;
  disabled?: boolean;
  formRef?: React.Ref<FormRef<T>>;
  submitOnChange?: boolean;
  focusOnLastFieldEnter?: boolean;
}

/**
 * List of predefined rule. Other than this, user can add rule in pattern
 */
const DEFAULT_ERROR_MESSAGES = {
  required: 'This field is required',
  pattern: 'Invalid format',
  minLength: 'Must be at least {minLength} characters',
  maxLength: 'Must be no more than {maxLength} characters',
  exactLength: 'Must be exactly {exactLength} characters',
  min: 'Must be at least {min}',
  max: 'Must be no more than {max}',
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  equal: 'Values must match',
};

const isFormInput = (
  el: React.ReactNode,
): el is React.ReactElement<InputProps<any>> =>
  React.isValidElement(el) && !!(el.type as any).isFormInput;

const isFormSubmitButton = (
  el: React.ReactNode,
): el is React.ReactElement<ButtonProps> => {
  return React.isValidElement(el) && (el.props as any).type === 'submit';
};

/**
 * High-performance form component with data domain management. Includes data entry and validation.
 */
const Form = <T,>({
  onSubmit,
  onReset,
  className,
  children,
  rules = {},
  disabled = false,
  formRef,
  submitOnChange = false,
  focusOnLastFieldEnter = false,
}: FormProps<T>) => {
  const inputRefsRef = React.useRef<Record<string, InputPropsRefType>>({});
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const inputOrderRef = React.useRef<string[]>([]);

  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formDisabled = disabled || isSubmitting;

  const getErrorMessage = (
    rule: FormRule,
    ruleType: keyof typeof DEFAULT_ERROR_MESSAGES,
  ) => {
    if (typeof rule === 'string') return DEFAULT_ERROR_MESSAGES[ruleType];

    const message = rule.message ?? DEFAULT_ERROR_MESSAGES[ruleType];
    return message
      .replace('{minLength}', String(rule.minLength))
      .replace('{maxLength}', String(rule.maxLength))
      .replace('{exactLength}', String(rule.exactLength))
      .replace('{min}', String(rule.min))
      .replace('{max}', String(rule.max));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const isValid = validate();

    if (isValid.length === 0) {
      const result = {} as T;
      for (const key in inputRefsRef.current) {
        // inputRefsRef.current[key] may be undefined if user remove it in the jsx
        result[key as keyof T] = inputRefsRef.current[key]?.value as T[keyof T];
      }

      onSubmit?.(result);
    } else {
      const firstInvalid = isValid.find(
        (id) => inputRefsRef.current[id] && !inputRefsRef.current[id]?.disabled,
      );
      if (firstInvalid) {
        inputRefsRef.current[firstInvalid]?.focus?.();
      }
    }
    setIsSubmitting(false);
  };

  const handleReset = React.useCallback(() => {
    Object.values(inputRefsRef.current).forEach((ref) => {
      if (ref && typeof ref.reset === 'function') {
        ref.reset();
      }
    });
    setErrors({});
    onReset?.();
  }, []);

  const validate = React.useCallback(() => {
    const newErrors: Record<string, string> = {};
    const typedValues = {} as T;
    Object.entries(inputRefsRef.current).forEach(([key, ref]) => {
      if (ref?.value !== undefined) {
        typedValues[key as keyof T] = ref.value as T[keyof T];
      }
    });

    Object.entries(rules).forEach(([fieldName, fieldRules]) => {
      const value = typedValues[fieldName as keyof T];

      for (const rule of fieldRules) {
        const normalizedRule = normalizeRule(rule);

        if (
          normalizedRule.required &&
          (value === undefined || // Check for undefined
            value === null || // Check for null
            value === '' || // Check for empty string
            (Array.isArray(value) && value.length === 0) || // Check for empty array
            (value instanceof Date && isNaN(value.getTime()))) // Check for invalid Dayjs instance
        ) {
          // Do not show required error if submitOnChange is true since user need time to fill all fields
          if (!submitOnChange) {
            newErrors[fieldName] = getErrorMessage(rule, 'required');
          }
          break;
        }

        if (value === undefined || value === null || value === '') continue;

        if (normalizedRule.pattern) {
          const pattern =
            typeof normalizedRule.pattern === 'string'
              ? new RegExp(normalizedRule.pattern)
              : normalizedRule.pattern;
          if (!pattern.test(String(value))) {
            newErrors[fieldName] = getErrorMessage(rule, 'pattern');
            break;
          }
        }

        if (
          normalizedRule.minLength !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length < normalizedRule.minLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'minLength');
          break;
        }

        if (
          normalizedRule.maxLength !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length > normalizedRule.maxLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'maxLength');
          break;
        }

        if (
          normalizedRule.exactLength !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length !== normalizedRule.exactLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'exactLength');
          break;
        }

        if (
          normalizedRule.min !== undefined &&
          typeof value === 'number' &&
          Number(value) < normalizedRule.min
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'min');
          break;
        }

        if (
          normalizedRule.max &&
          typeof value === 'number' &&
          Number(value) > normalizedRule.max
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'max');
          break;
        }

        if (normalizedRule.email && !EMAIL_REGEX.test(String(value))) {
          newErrors[fieldName] = getErrorMessage(rule, 'email');
          break;
        }

        if (
          normalizedRule.url &&
          typeof value === 'string' &&
          !URL_REGEX.test(String(value))
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'url');
          break;
        }

        if (
          normalizedRule.equal !== undefined &&
          value !== normalizedRule.equal
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'equal');
          break;
        }

        if (normalizedRule.validate) {
          const result = normalizedRule.validate(value);
          if (result.length > 0) {
            newErrors[fieldName] =
              typeof result === 'string' ? result : 'Invalid value';
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors);
  }, [rules]);

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentKey: string,
  ) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const order = inputOrderRef.current;
      const currentIndex = order.indexOf(currentKey);

      if (currentIndex === -1) return;

      // Find the next enabled input
      let nextEnabledInputIndex = -1;
      for (let i = currentIndex + 1; i < order.length; i++) {
        const nextKey = order[i];
        const ref = inputRefsRef.current[nextKey];

        if (ref && typeof ref.focus === 'function' && !ref.disabled) {
          nextEnabledInputIndex = i;
          break;
        }
      }

      // If found, focus on the next enabled input
      if (nextEnabledInputIndex > -1) {
        const nextKey = order[nextEnabledInputIndex];
        const ref = inputRefsRef.current[nextKey];
        ref.focus?.();
        return;
      }

      // No more enabled inputs found
      if (focusOnLastFieldEnter) {
        if (submitButtonRef.current && !submitButtonRef.current.disabled) {
          submitButtonRef.current.focus();
        }
      } else {
        handleSubmit();
      }
    }
  };

  const getValues = React.useCallback(() => {
    const result = {} as T;
    for (const key in inputRefsRef.current) {
      result[key as keyof T] = inputRefsRef.current[key].value as T[keyof T];
    }
    return result;
  }, []);

  const errorsRef = React.useRef(errors);
  errorsRef.current = errors;

  const debounceSubmit = useDebouncedCallback(() => {
    const isValid = validate();
    if (isValid.length === 0) {
      const result = {} as T;
      for (const key in inputRefsRef.current) {
        result[key as keyof T] = inputRefsRef.current[key].value as T[keyof T];
      }
      onSubmit?.(result);
    }
  }, 2000);

  const enhanceChild = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;

    if (isFormSubmitButton(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        ref: (child as any).ref || submitButtonRef,
      });
    }

    const childProps = child.props as InputProps<any>;
    if (isFormInput(child)) {
      const {
        name,
        id,
        onChange: childOnChange,
        defaultValue,
        inputRef: originalInputRef,
      } = childProps;
      const fieldName = name ?? id;
      if (!fieldName) return child;

      if (!inputOrderRef.current.includes(fieldName)) {
        inputOrderRef.current.push(fieldName);
      }

      const handleChange = (value: any) => {
        if (errors[fieldName]) {
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
        childOnChange?.(value);
        if (submitOnChange) {
          debounceSubmit();
        }
      };

      // Preserve existing ref and props
      return React.cloneElement(child, {
        ...child.props,
        defaultValue,
        onChange: handleChange,
        error: errors[fieldName] ?? undefined,
        disabled: childProps.disabled ?? formDisabled,
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (childProps.onKeyDown) {
            childProps.onKeyDown(e);
          } else {
            handleInputKeyDown(e, fieldName);
          }
        },
        inputRef: (ref: InputPropsRefType) => {
          if (fieldName) {
            inputRefsRef.current[fieldName] = ref;
          }

          // Call original ref if it exists
          if (typeof originalInputRef === 'function') {
            originalInputRef(ref);
          } else if (originalInputRef?.current !== undefined) {
            originalInputRef.current = ref;
          }
        },
      });
    }

    if (childProps.children) {
      return React.cloneElement(
        child as React.ReactElement<React.PropsWithChildren<unknown>>,
        {
          children: React.Children.map(childProps.children, enhanceChild),
        },
      );
    }

    return child;
  };

  React.useImperativeHandle(
    formRef,
    () => ({
      submit: handleSubmit,
      reset: handleReset,
      validate,
      getValues,
      getErrors: () => errorsRef.current, // Use ref to avoid closure issues
      setErrors,
    }),
    [handleSubmit, handleReset, validate, getValues, setErrors],
  );

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      onReset={(e) => {
        e.preventDefault();
        handleReset();
      }}
    >
      {React.Children.map(children, enhanceChild)}
    </form>
  );
};

export default Form;
