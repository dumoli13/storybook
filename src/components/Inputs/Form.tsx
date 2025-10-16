import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EMAIL_REGEX, URL_REGEX } from '../../const/regex';
import { ButtonProps, FormRule } from '../../types/inputs';
import { FormProps } from '../../types';
import { InputProps, InputPropsRefType } from '../../types/inputs/form';

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
  validate: 'Invalid value',
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
  rules,
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
      .replace('{minLength}', String(rule.required))
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
    for (const ref of Object.values(inputRefsRef.current)) {
      if (ref && typeof ref.reset === 'function') {
        ref.reset();
      }
    }
    setErrors({});
    onReset?.();
  }, []);

  const validate = React.useCallback(() => {
    const newErrors: Record<string, string> = {};
    const typedValues = {} as T;

    for (const [key, ref] of Object.entries(inputRefsRef.current)) {
      if (ref?.value !== undefined) {
        typedValues[key as keyof T] = ref.value as T[keyof T];
      }
    }

    for (const [fieldName, fieldRules] of Object.entries(rules(typedValues))) {
      const value = typedValues[fieldName as keyof T];

      for (const rule of fieldRules as FormRule[]) {
        const normalizedRule = normalizeRule(rule);

        if (
          normalizedRule['required'] &&
          (value === undefined || // Check for undefined
            value === null || // Check for null
            value === '' || // Check for empty string
            (Array.isArray(value) && value.length === 0) || // Check for empty array
            (value instanceof Date && Number.isNaN(value.getTime()))) // Check for invalid Dayjs instance
        ) {
          // Do not show required error if submitOnChange is true since user need time to fill all fields
          if (!submitOnChange) {
            newErrors[fieldName] = getErrorMessage(rule, 'required');
          }
          break;
        }

        if (value === undefined || value === null || value === '') continue;

        if (normalizedRule['pattern']) {
          const pattern =
            typeof normalizedRule['pattern'] === 'string'
              ? new RegExp(normalizedRule['pattern'])
              : normalizedRule['pattern'];
          if (!pattern.test(String(value))) {
            newErrors[fieldName] = getErrorMessage(rule, 'pattern');
            break;
          }
        }

        if (
          normalizedRule['minLength'] !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length < normalizedRule['minLength']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'minLength');
          break;
        }

        if (
          normalizedRule['maxLength'] !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length > normalizedRule['maxLength']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'maxLength');
          break;
        }

        if (
          normalizedRule['exactLength'] !== undefined &&
          (typeof value === 'number' || typeof value === 'string') &&
          String(value).length !== normalizedRule['exactLength']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'exactLength');
          break;
        }

        if (
          normalizedRule['min'] !== undefined &&
          typeof value === 'number' &&
          Number(value) < normalizedRule['min']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'min');
          break;
        }

        if (
          normalizedRule['max'] &&
          typeof value === 'number' &&
          Number(value) > normalizedRule['max']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'max');
          break;
        }

        if (
          normalizedRule['email'] &&
          typeof value === 'string' &&
          !EMAIL_REGEX.test(value)
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'email');
          break;
        }

        if (
          normalizedRule['url'] &&
          typeof value === 'string' &&
          !URL_REGEX.test(String(value))
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'url');
          break;
        }

        if (
          normalizedRule['equal'] !== undefined &&
          value !== normalizedRule['equal']
        ) {
          newErrors[fieldName] = getErrorMessage(rule, 'equal');
          break;
        }

        if (normalizedRule['validate']) {
          const result = normalizedRule['validate'](value);
          if (!result) {
            newErrors[fieldName] = getErrorMessage(rule, 'validate');
            break;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors);
  }, [rules]);

  const handleFormKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentKey: string,
  ) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      console.log('form enter');
      e.preventDefault();
      const order = inputOrderRef.current;
      const currentIndex = order.indexOf(currentKey);
      if (currentIndex === -1) return;

      let nextIndex = -1;

      if (e.shiftKey && e.key === 'Tab') {
        // 🔹 Go backward when Shift + Tab
        for (let i = currentIndex - 1; i >= 0; i--) {
          const prevKey = order[i];
          const ref = inputRefsRef.current[prevKey];
          if (ref && typeof ref.focus === 'function' && !ref.disabled) {
            nextIndex = i;
            break;
          }
        }
      } else {
        // 🔹 Normal Tab or Enter → go forward
        for (let i = currentIndex + 1; i < order.length; i++) {
          const nextKey = order[i];
          const ref = inputRefsRef.current[nextKey];
          if (ref && typeof ref.focus === 'function' && !ref.disabled) {
            nextIndex = i;
            break;
          }
        }
      }

      if (nextIndex > -1) {
        const targetRef = inputRefsRef.current[order[nextIndex]];
        targetRef.focus?.();
        return;
      }

      // 🔹 No more enabled inputs
      if (!e.shiftKey) {
        if (focusOnLastFieldEnter) {
          if (submitButtonRef.current && !submitButtonRef.current.disabled) {
            submitButtonRef.current.focus();
          }
        } else {
          handleSubmit();
        }
      }
    }
  };

  const getValue = React.useCallback(
    <K extends keyof T>(key: K) => inputRefsRef.current[key].value as T[K],
    [],
  );

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
            handleFormKeyDown(e, fieldName);
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
      getValue,
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
