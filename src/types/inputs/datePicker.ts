export type PickerType = 'date' | 'month' | 'year';

export type DateValue = Date | null;

export interface DatePickerRef {
  element: HTMLDivElement | null;
  value: DateValue;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'required' | 'checked'
  > {
  value?: DateValue;
  defaultValue?: DateValue;
  initialValue?: DateValue;
  clearable?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: DateValue) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<DatePickerRef | null>
    | React.RefCallback<DatePickerRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  disabledDate?: (date: Date) => boolean;
  width?: number;
  showTime?: boolean;
  picker?: PickerType;
  format?: string;
  required?: boolean;
}
