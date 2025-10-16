export interface NumberTextfieldRef {
  element: HTMLInputElement | null;
  value: number | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface NumberTextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'size'
    | 'required'
    | 'checked'
    | 'max'
    | 'min'
  > {
  id?: string;
  value?: number | null;
  defaultValue?: number | null;
  initialValue?: number | null;
  max?: number;
  min?: number;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: number | null) => void;
  className?: string;
  helperText?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
  inputRef?:
    | React.RefObject<NumberTextfieldRef | null>
    | React.RefCallback<NumberTextfieldRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
  required?: boolean;
}
