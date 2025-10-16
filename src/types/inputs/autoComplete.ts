import { SelectValue } from './select';

export interface AutoCompleteRef<T, D = undefined> {
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
    | React.RefObject<AutoCompleteRef<T, D> | null>
    | React.RefCallback<AutoCompleteRef<T, D> | null>;
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

interface WithoutAppendProps<T, D = undefined> {
  appendIfNotFound?: false;
  onAppend?: (input: SelectValue<T, D>) => never;
}

interface WithAppendProps<T, D = undefined> extends BaseProps<T, D> {
  appendIfNotFound: true;
  onAppend?: (input: SelectValue<T, D>) => void;
}

interface AsyncProps<T, D> {
  async: true;
  fetchOptions: (
    keyword: string,
    page: number,
    limit: number,
  ) => Promise<SelectValue<T, D>[]>;
  options?: never;
  loading?: never;
}

interface NonAsyncProps<T, D> {
  async?: false;
  fetchOptions?: never;
  options: SelectValue<T, D>[];
  loading?: boolean;
}

export type AutoCompleteProps<T, D = undefined> =
  | (BaseProps<T, D> & WithoutAppendProps<T, D> & AsyncProps<T, D>)
  | (BaseProps<T, D> & WithoutAppendProps<T, D> & NonAsyncProps<T, D>)
  | (BaseProps<T, D> & WithAppendProps<T, D> & AsyncProps<T, D>)
  | (BaseProps<T, D> & WithAppendProps<T, D> & NonAsyncProps<T, D>);
