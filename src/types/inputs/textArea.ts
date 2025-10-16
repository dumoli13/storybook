export interface TextAreaRef {
  element: HTMLTextAreaElement | null;
  value: string;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface TextAreaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
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
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<TextAreaRef | null>
    | React.RefCallback<TextAreaRef | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  lines?: number;
  width?: number;
  required?: boolean;
}
