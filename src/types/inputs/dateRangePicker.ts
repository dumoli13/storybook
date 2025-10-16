import { PickerType } from './datePicker';

export type DateRangeValue = [Date, Date] | null;

export interface DateRangePickerRef {
  element: HTMLDivElement | null;
  value: DateRangeValue;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface DateRangePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'required' | 'checked'
  > {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  initialValue?: DateRangeValue;
  clearable?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: DateRangeValue) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<DateRangePickerRef | null>
    | React.RefCallback<DateRangePickerRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  disabledDate?: (date: Date, firstSelectedDate: Date | null) => boolean;
  width?: number;
  showTime?: boolean;
  picker?: PickerType;
  format?: string;
  required?: boolean;
}
