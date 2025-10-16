export type SelectValue<T, D = undefined> = {
  value: T;
  label: string;
  detail?: D;
};

export interface SelectRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D> | null;
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

interface BaseProps<T, D = undefined>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue' | 'size' | 'required' | 'checked'
  > {
  value?: SelectValue<T, D> | null;
  defaultValue?: T | null;
  initialValue?: SelectValue<T, D> | null;
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  placeholder?: string;
  onChange?: (value: SelectValue<T, D> | null) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<SelectRef<T, D> | null>
    | React.RefCallback<SelectRef<T, D> | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  clearable?: boolean;
  width?: number;
  required?: boolean;
  renderOption?: (
    option: Array<SelectValue<T, D>>,
    onClick: (value: SelectValue<T, D>) => void,
    selected: SelectValue<T, D> | null,
    highlightedIndex: number,
  ) => React.ReactNode;
}

interface AsyncProps<T, D> {
  async: true;
  fetchOptions: (page: number, limit: number) => Promise<SelectValue<T, D>[]>;
  options?: never;
  loading?: never;
}

interface NonAsyncProps<T, D> {
  async?: false;
  fetchOptions?: never;
  options: SelectValue<T, D>[];
  loading?: boolean;
}

export type SelectProps<T, D = undefined> =
  | (BaseProps<T, D> & AsyncProps<T, D>)
  | (BaseProps<T, D> & NonAsyncProps<T, D>);
