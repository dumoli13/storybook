import { SelectValue } from './select';

export interface RadioGroupRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D> | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

export interface RadioGroupProps<T, D = undefined>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  value?: T | null;
  defaultValue?: T | null;
  initialValue?: T | null;
  name?: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  options: SelectValue<T, D>[];
  direction?: 'row' | 'column';
  onChange?: (value: SelectValue<T, D>) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  inputRef?:
    | React.RefObject<RadioGroupRef<T, D> | null>
    | React.RefCallback<RadioGroupRef<T, D> | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  loading?: boolean;
  width?: number;
  required?: boolean;
}
