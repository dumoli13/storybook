import { AutoCompleteRef } from './autoComplete';
import { AutoCompleteMultipleRef } from './autoCompleteMultiple';
import { CheckboxRef } from './checkbox';
import { DatePickerRef } from './datePicker';
import { DateRangePickerRef } from './dateRangePicker';
import { MultipleDatePickerRef } from './multipleDatePicker';
import { NumberTextfieldRef } from './numberTextField';
import { PasswordFieldRef } from './passwordField';
import { SelectRef } from './select';
import { SwitchRef } from './switch';
import { TextAreaRef } from './textArea';
import { TextfieldRef } from './textField';
import { TimerFieldRef } from './timerField';

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
  getValue: <K extends keyof T>(key: K) => T[K];
  getValues: () => Partial<T>;
  getErrors: () => Record<string, string | undefined>;
  setErrors: (errors: Record<string, string | undefined>) => void;
}

type BaseRule = {
  message?: string;
};

type RequiredRule = BaseRule & {
  required: boolean;
  email?: boolean;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type EmailRule = BaseRule & {
  email: boolean;
  required?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type UrlRule = BaseRule & {
  url: boolean;
  required?: undefined;
  email?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type patternRule = BaseRule & {
  pattern: RegExp | string;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type minLengthRule = BaseRule & {
  minLength: number;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type maxLengthRule = BaseRule & {
  maxLength: number;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type exactLengthRule = BaseRule & {
  exactLength: number;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type minRule = BaseRule & {
  min: number;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: number;
  maxLength?: undefined;
  exactLength?: undefined;
  max?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type maxRule = BaseRule & {
  max: number;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  equal?: undefined;
  validate?: undefined;
};

type equalRule = BaseRule & {
  equal: any;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  validate?: undefined;
};

type customValidateRule = BaseRule & {
  validate: (value: any) => boolean;
  required?: undefined;
  email?: undefined;
  url?: undefined;
  pattern?: undefined;
  minLength?: undefined;
  maxLength?: undefined;
  exactLength?: undefined;
  min?: undefined;
  max?: undefined;
  equal?: undefined;
};

export type FormRule =
  | RequiredRule
  | EmailRule
  | UrlRule
  | patternRule
  | minLengthRule
  | maxLengthRule
  | exactLengthRule
  | minRule
  | maxRule
  | equalRule
  | customValidateRule
  | 'required'
  | 'email'
  | 'url';

export interface FormProps<T> {
  onSubmit?: (values: T) => Promise<void> | void;
  onReset?: () => void;
  className?: string;
  children: React.ReactNode;
  rules?: (ref: T) => Partial<Record<keyof T, Array<FormRule>>>;
  disabled?: boolean;
  formRef?: React.Ref<FormRef<T>>;
  submitOnChange?: boolean;
  focusOnLastFieldEnter?: boolean;
}
