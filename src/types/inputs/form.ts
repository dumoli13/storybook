import { AutoCompleteProps, AutoCompleteRef } from './autoComplete';
import {
  AutoCompleteMultipleProps,
  AutoCompleteMultipleRef,
} from './autoCompleteMultiple';
import { ButtonProps } from './button';
import { CheckboxProps, CheckboxRef } from './checkbox';
import { DatePickerProps, DatePickerRef } from './datePicker';
import { DateRangePickerProps, DateRangePickerRef } from './dateRangePicker';
import {
  MultipleDatePickerProps,
  MultipleDatePickerRef,
} from './multipleDatePicker';
import { NumberTextFieldProps, NumberTextfieldRef } from './numberTextField';
import { PasswordFieldProps, PasswordFieldRef } from './passwordField';
import { RadioGroupProps } from './radioGroup';
import { SelectProps, SelectRef } from './select';
import { SwitchProps, SwitchRef } from './switch';
import { TextAreaProps, TextAreaRef } from './textArea';
import { TextFieldProps, TextfieldRef } from './textField';
import { TimerFieldProps, TimerFieldRef } from './timerField';

export type InputPropsRefType =
  | AutoCompleteRef<any>
  | AutoCompleteMultipleRef<any>
  | CheckboxRef
  | DatePickerRef
  | DateRangePickerRef
  | MultipleDatePickerRef
  | NumberTextfieldRef
  | PasswordFieldRef
  | SelectRef<any>
  | SwitchRef
  | TextAreaRef
  | TextfieldRef
  | TimerFieldRef;

export interface InputProps<T> {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean | string;
  success?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  value?: T;
  defaultValue?: T;
  initialValue?: T;
  onChange?: (value: T) => void;
  children?: React.ReactNode;
  inputRef?:
    | React.RefObject<InputPropsRefType>
    | React.RefCallback<InputPropsRefType>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface FormRef<T> {
  submit: () => Promise<void>;
  reset: () => void;
  validate: () => string[];
  getValue: <K extends keyof T>(key: K) => T[K] | undefined;
  getValues: () => Partial<T>;
  getErrors: () => Record<string, string | undefined>;
  setErrors: (errors: Record<string, string | undefined>) => void;
}

type BaseRule = {
  message?: string;
};

interface AllRuleKeys {
  required: boolean;
  email: boolean;
  url: boolean;
  pattern: RegExp | string;
  minLength: number;
  maxLength: number;
  exactLength: number;
  min: number;
  max: number;
  equal: any;
  validate: (value: any) => boolean;
}

export type FormTemplate =
  | ({
      component: 'div';
      children?: FormTemplate[];
    } & React.HTMLAttributes<HTMLDivElement>)
  | ({ component: 'Button' } & ButtonProps)
  | ({ component: 'AutoComplete' } & AutoCompleteProps<any>)
  | ({ component: 'AutoCompleteMultiple' } & AutoCompleteMultipleProps<any>)
  | ({ component: 'Checkbox' } & CheckboxProps)
  | ({ component: 'DatePicker' } & DatePickerProps)
  | ({ component: 'DateRangePicker' } & DateRangePickerProps)
  | ({ component: 'MultipleDatePicker' } & MultipleDatePickerProps)
  | ({ component: 'NumberTextField' } & NumberTextFieldProps)
  | ({ component: 'PasswordField' } & PasswordFieldProps)
  | ({ component: 'RadioGroup' } & RadioGroupProps<any>)
  | ({ component: 'Select' } & SelectProps<any>)
  | ({ component: 'Switch' } & SwitchProps)
  | ({ component: 'TextArea' } & TextAreaProps)
  | ({ component: 'TextField' } & TextFieldProps)
  | ({ component: 'TimerField' } & TimerFieldProps);

export type FormRule = BaseRule &
  {
    [K in keyof AllRuleKeys]: { [P in K]: AllRuleKeys[P] } & {
      [P in Exclude<keyof AllRuleKeys, K>]?: undefined;
    };
  }[keyof AllRuleKeys];

interface BaseFormProps<T> {
  onSubmit?: (values: T) => Promise<void> | void;
  onReset?: () => void;
  className?: string;
  rules?: (ref: T) => Partial<Record<keyof T, Array<FormRule>>>;
  disabled?: boolean;
  formRef?: React.Ref<FormRef<T>>;
  submitOnChange?: boolean;
  focusOnLastFieldEnter?: boolean;
}

export type FormProps<T> =
  | (BaseFormProps<T> & { children: React.ReactNode; template: undefined })
  | (BaseFormProps<T> & { template: FormTemplate[]; children: undefined });
