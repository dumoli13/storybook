export interface SwitchRef {
  element: HTMLInputElement | null;
  value: boolean;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'defaultChecked' | 'onChange' | 'size' | 'required'
  > {
  defaultChecked?: boolean;
  initialChecked?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  onChange?: (checked: boolean) => void;
  helperText?: React.ReactNode;
  inputRef?:
    | React.RefObject<SwitchRef | null>
    | React.RefCallback<SwitchRef | null>;
  size?: 'default' | 'large';
  fullWidth?: boolean;
  error?: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
  width?: number;
  loading?: boolean;
  required?: boolean;
}
