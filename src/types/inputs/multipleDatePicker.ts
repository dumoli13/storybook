import { PickerType } from './datePicker';

export type MultipleDateValue = Date[];

export interface MultipleDatePickerRef {
  element: HTMLDivElement | null;
  value: MultipleDateValue;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}
export interface MultipleDatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'required'
  > {
  value?: MultipleDateValue;
  defaultValue?: MultipleDateValue;
  initialValue?: MultipleDateValue;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: MultipleDateValue) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<MultipleDatePickerRef | null>
    | React.RefCallback<MultipleDatePickerRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  disabledDate?: (date: Date, firstSelectedDate: MultipleDateValue) => boolean;
  width?: number;
  picker?: PickerType;
  format?: string;
  required?: boolean;
}
