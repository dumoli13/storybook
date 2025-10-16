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
  getValues: () => Partial<T>;
  getErrors: () => Record<string, string | undefined>;
  setErrors: (errors: Record<string, string | undefined>) => void;
}

type RequiredRule = {
  required: boolean;
  email?: never;
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
};

type EmailRule = {
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
};

type UrlRule = {
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
};

type patternRule = {
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
};

type minLengthRule = {
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
};

type maxLengthRule = {
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
};

type exactLengthRule = {
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
};

type minRule = {
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
};

type maxRule = {
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
};

type equalRule = {
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
  | 'required'
  | 'email'
  | 'url';

export type FormRules = Record<string, FormRule[]>;

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
