export interface PasswordFieldRef {
  element: HTMLInputElement | null;
  value: string;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface PasswordFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'required' | 'checked'
  > {
  value?: string;
  defaultValue?: string;
  initialValue?: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (value: string) => void;
  helperText?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<PasswordFieldRef | null>
    | React.RefCallback<PasswordFieldRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
  required?: boolean;
}
