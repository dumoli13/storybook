import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EMAIL_REGEX, URL_REGEX } from '../../const/regex';
import { FormProps } from '../../types';
import { ButtonProps, FormRule } from '../../types/inputs';
import {
  FormTemplate,
  InputProps,
  InputPropsRefType,
} from '../../types/inputs/form';
import AutoComplete from './AutoComplete';
import AutoCompleteMultiple from './AutoCompleteMultiple';
import Button from './Button';
import Checkbox from './Checkbox';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';
import MultipleDatePicker from './MultipleDatePicker';
import NumberTextField from './NumberTextField';
import PasswordField from './PasswordField';
import RadioGroup from './RadioGroup';
import Select from './Select';
import Switch from './Switch';
import TextArea from './TextArea';
import TextField from './TextField';
import TimerField from './TimerField';

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
  rules,
  disabled = false,
  formRef,
  submitOnChange = false,
  focusOnLastFieldEnter = false,
  children,
  template,
}: FormProps<T>) => {
  const inputRefsRef = React.useRef<Record<string, InputPropsRefType[]>>({});
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
    const invalidFields = validate();

    if (invalidFields.length === 0) {
      const result = getValues();
      onSubmit?.(result);
    }
    setIsSubmitting(false);
  };

  const handleReset = React.useCallback(() => {
    for (const refs of Object.values(inputRefsRef.current)) {
      for (const ref of refs) {
        if (ref && typeof ref.reset === 'function') {
          ref.reset();
        }
      }
    }
    setErrors({});
    onReset?.();
  }, []);

  const validate = React.useCallback(() => {
    const newErrors: Record<string, string> = {};
    const typedValues: Record<string, any> = {};

    for (const [key, refs] of Object.entries(inputRefsRef.current)) {
      const values = refs.map((r) => r?.value).filter((v) => v !== undefined);
      typedValues[key] = values;
    }

    if (!rules) return [];

    for (const [fieldName, fieldRules] of Object.entries(
      rules(typedValues as T),
    )) {
      const value = typedValues[fieldName];
      const refs = inputRefsRef.current[fieldName];
      if (!refs) continue;

      for (const rule of fieldRules as FormRule[]) {
        const checkValue = (val: any) => {
          // Handle required rule
          if (
            rule.required &&
            (val === undefined ||
              val === null ||
              val === '' ||
              (Array.isArray(val) && val.length === 0) ||
              (val instanceof Date && Number.isNaN(val.getTime())))
          ) {
            // Do not show required error if submitOnChange is true since user need time to fill all fields
            if (!submitOnChange) {
              newErrors[fieldName] = getErrorMessage(rule, 'required');
            }
          } else if (rule.pattern) {
            const pattern =
              typeof rule.pattern === 'string'
                ? new RegExp(rule.pattern)
                : rule.pattern;
            if (!pattern.test(String(val))) {
              newErrors[fieldName] = getErrorMessage(rule, 'pattern');
            }
          } else if (
            rule.minLength !== undefined &&
            (typeof val === 'number' || typeof val === 'string') &&
            String(val).length < rule.minLength
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'minLength');
          } else if (
            rule.maxLength !== undefined &&
            (typeof val === 'number' || typeof val === 'string') &&
            String(val).length > rule.maxLength
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'maxLength');
          } else if (
            rule.exactLength !== undefined &&
            (typeof val === 'number' || typeof val === 'string') &&
            String(val).length !== rule.exactLength
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'exactLength');
          } else if (
            rule.min !== undefined &&
            typeof val === 'number' &&
            val < rule.min
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'min');
          } else if (
            rule.max !== undefined &&
            typeof val === 'number' &&
            val > rule.max
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'max');
          } else if (
            rule.email &&
            typeof val === 'string' &&
            !EMAIL_REGEX.test(val)
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'email');
          } else if (
            rule.url &&
            typeof val === 'string' &&
            !URL_REGEX.test(val)
          ) {
            newErrors[fieldName] = getErrorMessage(rule, 'url');
          } else if (rule.equal !== undefined && val !== rule.equal) {
            newErrors[fieldName] = getErrorMessage(rule, 'equal');
          } else if (rule.validate && !rule.validate(val)) {
            newErrors[fieldName] = getErrorMessage(rule, 'validate');
          }
          setErrors(newErrors);
          return Object.keys(newErrors);
        };

        for (const v of value) {
          checkValue(v);
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
      e.preventDefault();
      const order = inputOrderRef.current;
      const currentIndex = order.indexOf(currentKey);
      if (currentIndex === -1) return;

      let nextIndex = -1;

      if (e.shiftKey && e.key === 'Tab') {
        // 🔹 Go backward when Shift + Tab
        for (let i = currentIndex - 1; i >= 0; i--) {
          const prevKey = order[i];
          const refs = inputRefsRef.current[prevKey];
          if (refs?.some((r) => !r.disabled)) {
            nextIndex = i;
            break;
          }
        }
      } else {
        // 🔹 Normal Tab or Enter → go forward
        for (let i = currentIndex + 1; i < order.length; i++) {
          const nextKey = order[i];
          const refs = inputRefsRef.current[nextKey];
          if (refs?.some((r) => !r.disabled)) {
            nextIndex = i;
            break;
          }
        }
      }

      if (nextIndex > -1) {
        const targetRefs = inputRefsRef.current[order[nextIndex]];
        const target = targetRefs.find((r) => !r?.disabled);
        target?.focus?.();
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

  const getValue = React.useCallback(<K extends keyof T>(key: K) => {
    const refs = inputRefsRef.current[key as string];
    if (!refs || refs.length === 0) return undefined;
    if (refs.length === 1) return refs[0].value as T[K];
    return refs.map((r) => r?.value) as unknown as T[K];
  }, []);

  const getValues = React.useCallback(() => {
    const result: Record<string, any> = {};

    for (const [key, refs] of Object.entries(inputRefsRef.current)) {
      const values = refs.map((r) => r?.value).filter((v) => v !== undefined);

      if (values.length === 1) {
        result[key] = values[0];
      } else if (values.length > 1) {
        result[key] = values;
      }
    }

    return result as T;
  }, []);

  const errorsRef = React.useRef(errors);
  errorsRef.current = errors;

  const debounceSubmit = useDebouncedCallback(() => {
    const invalidFields = validate();
    if (invalidFields.length === 0) {
      const result = getValues();
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
        onChange: childOnChange,
        defaultValue,
        inputRef: originalInputRef,
      } = childProps;
      if (!name) return child;

      if (!inputOrderRef.current.includes(name)) {
        inputOrderRef.current.push(name);
      }

      const handleChange = (value: any) => {
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
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
        error: errors[name] ?? undefined,
        disabled: childProps.disabled ?? formDisabled,
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (childProps.onKeyDown) {
            childProps.onKeyDown(e);
          } else {
            handleFormKeyDown(e, name);
          }
        },
        inputRef: (ref: InputPropsRefType) => {
          if (name && ref) {
            if (!inputRefsRef.current[name]) {
              inputRefsRef.current[name] = [];
            }
            const refsArray = inputRefsRef.current[name];
            if (!refsArray.includes(ref)) {
              refsArray.push(ref);
            }
          }

          // Call original ref if it exists
          if (typeof originalInputRef === 'function') {
            originalInputRef(ref);
          } else if (originalInputRef?.current !== undefined) {
            originalInputRef.current = ref;
          }

          // Clean up on unmount
          return () => {
            if (inputRefsRef.current[name]) {
              inputRefsRef.current[name] = inputRefsRef.current[name].filter(
                (r) => r !== ref,
              );
              if (inputRefsRef.current[name].length === 0) {
                delete inputRefsRef.current[name];
              }
            }
          };
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

  const renderTemplate = React.useCallback(
    (template: FormTemplate[]): React.ReactNode => {
      const registerInputRef = (name?: string) => (ref: any) => {
        if (!name || !ref) return;
        if (!inputRefsRef.current[name]) {
          inputRefsRef.current[name] = [];
        }
        const refsArray = inputRefsRef.current[name];
        if (!refsArray.includes(ref)) {
          refsArray.push(ref);
        }

        return () => {
          if (inputRefsRef.current[name]) {
            inputRefsRef.current[name] = inputRefsRef.current[name].filter(
              (r) => r !== ref,
            );
            if (inputRefsRef.current[name].length === 0) {
              delete inputRefsRef.current[name];
            }
          }
        };
      };

      const renderItem = (
        item: FormTemplate,
        index: number,
      ): React.ReactNode => {
        const key = item.id ?? index;

        const commonInputProps = (
          name?: string,
          childOnChange?: (value: any) => void,
        ) =>
          name
            ? {
                disabled: formDisabled,
                error: errors[name],
                onChange: (value: any) => {
                  if (errors[name]) {
                    setErrors((prev) => ({ ...prev, [name]: undefined }));
                  }
                  childOnChange?.(value);
                  if (submitOnChange) {
                    debounceSubmit();
                  }
                },
                inputRef: registerInputRef(name),
              }
            : {};

        switch (item.component) {
          case 'div':
            return (
              <div key={key} className={item.className} style={item.style}>
                {item.children ? renderTemplate(item.children) : null}
              </div>
            );

          case 'Button':
            return (
              <Button key={key} {...item}>
                {item.children}
              </Button>
            );

          case 'AutoComplete':
            return (
              <AutoComplete
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'AutoCompleteMultiple':
            return (
              <AutoCompleteMultiple
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'Checkbox':
            return (
              <Checkbox
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'DatePicker':
            return (
              <DatePicker
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'DateRangePicker':
            return (
              <DateRangePicker
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'MultipleDatePicker':
            return (
              <MultipleDatePicker
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'NumberTextField':
            return (
              <NumberTextField
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'PasswordField':
            return (
              <PasswordField
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'RadioGroup':
            return (
              <RadioGroup
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'Select':
            return (
              <Select
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'Switch':
            return (
              <Switch
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'TextArea':
            return (
              <TextArea
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'TextField':
            return (
              <TextField
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          case 'TimerField':
            return (
              <TimerField
                key={key}
                {...item}
                {...commonInputProps(item.name, item.onChange)}
              />
            );
          default:
            // eslint-disable-next-line no-console
            console.warn('Unknown component:', item);
            return null;
        }
      };

      return template.map((item, index) => renderItem(item, index));
    },
    [errors, formDisabled, submitOnChange, debounceSubmit],
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
      {template
        ? renderTemplate(template)
        : React.Children.map(children, enhanceChild)}
    </form>
  );
};

export default Form;
