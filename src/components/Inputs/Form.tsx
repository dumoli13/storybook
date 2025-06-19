import React from 'react';
import { InputProps, InputPropsRefType } from '../../types/input';
import { ButtonProps } from './Button';

export interface FormRef<T> {
  submit: () => Promise<void>;
  reset: () => void;
  validate: () => boolean;
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
    validate?: (value: any) => boolean | string;
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
  onSubmit: (values: T) => Promise<void> | void;
  onReset?: () => void;
  className?: string;
  children: React.ReactNode;
  rules?: FormRules;
  disabled?: boolean;
  formRef?: React.Ref<FormRef<T>>;
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
}: FormProps<T>) => {
  const inputRefsRef = React.useRef<Record<string, InputPropsRefType>>({});
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const inputOrderRef = React.useRef<string[]>([]);

  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formDisabled = disabled || isSubmitting;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

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
          newErrors[fieldName] = getErrorMessage(rule, 'required');
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
          String(value).length < normalizedRule.minLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'minLength');
          break;
        }

        if (
          normalizedRule.maxLength !== undefined &&
          String(value).length > normalizedRule.maxLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'maxLength');
          break;
        }

        if (
          normalizedRule.exactLength !== undefined &&
          String(value).length !== normalizedRule.exactLength
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'exactLength');
          break;
        }

        if (
          normalizedRule.min !== undefined &&
          Number(value) < normalizedRule.min
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'min');
          break;
        }

        if (
          normalizedRule.max !== undefined &&
          Number(value) > normalizedRule.max
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'max');
          break;
        }

        if (normalizedRule.email && !emailRegex.test(String(value))) {
          newErrors[fieldName] = getErrorMessage(rule, 'email');
          break;
        }

        if (normalizedRule.url && !urlRegex.test(String(value))) {
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
          if (result !== true) {
            newErrors[fieldName] =
              typeof result === 'string' ? result : 'Invalid value';
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentKey: string,
  ) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const order = inputOrderRef.current;
      const currentIndex = order.indexOf(currentKey);

      for (let i = currentIndex + 1; i < order.length; i++) {
        const nextKey = order[i];
        const ref = inputRefsRef.current[nextKey];

        // Skip disabled or unfocusable inputs
        if (ref && typeof ref.focus === 'function' && !ref.disabled) {
          ref.focus();
          return;
        }
      }

      // No enabled input found, focus the submit button
      submitButtonRef.current?.focus();
    }
  };

  const enhanceChild = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;
    if (isFormSubmitButton(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        ref: submitButtonRef,
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
      };

      // Preserve existing ref and props
      return React.cloneElement(child, {
        ...child.props,
        defaultValue,
        onChange: handleChange,
        error: errors[fieldName] ?? undefined,
        disabled: formDisabled || childProps.disabled,
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          handleInputKeyDown(e, fieldName),
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const isValid = validate();

    for (const key of inputOrderRef.current) {
      const input = inputRefsRef.current[key];
      if (input && !input.disabled) {
        input.focus?.();
        break;
      }
    }

    if (isValid) {
      const result = {} as T;
      for (const key in inputRefsRef.current) {
        result[key as keyof T] = inputRefsRef.current[key].value as T[keyof T];
      }

      onSubmit(result);
    }
    setIsSubmitting(false);
  };

  const handleReset = () => {
    Object.values(inputRefsRef.current).forEach((ref) => {
      if (ref && typeof ref.reset === 'function') {
        ref.reset();
      }
    });
    setErrors({});
    onReset?.();
  };

  React.useImperativeHandle(formRef, () => ({
    submit: handleSubmit,
    reset: handleReset,
    validate,
    getValues: () => {
      const result = {} as T;
      for (const key in inputRefsRef.current) {
        result[key as keyof T] = inputRefsRef.current[key].value as T[keyof T];
      }
      return result;
    },
    getErrors: () => errors,
    setErrors: (errors) => {
      setErrors(errors);
    },
  }));

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
