export interface CheckboxRef {
  element: HTMLInputElement | null;
  value: boolean;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'placeholder' | 'required'
  > {
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  checked?: boolean;
  defaultChecked?: boolean;
  initialChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  inputRef?:
    | React.RefObject<CheckboxRef | null>
    | React.RefCallback<CheckboxRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  loading?: boolean;
  width?: number;
}
