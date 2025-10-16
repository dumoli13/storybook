import { SelectValue } from './select';

export interface AutoCompleteMultipleRef<T, D = undefined> {
  element: HTMLDivElement | null;
  value: SelectValue<T, D>[];
  focus: () => void;
  reset: () => void;
  disabled: boolean;
}

interface BaseAutoCompleteMultipleProps<T, D = undefined>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue' | 'size' | 'required' | 'checked'
  > {
  value?: SelectValue<T, D>[];
  defaultValue?: T[];
  initialValue?: SelectValue<T, D>[];
  label?: string;
  labelPosition?: 'top' | 'left';
  autoHideLabel?: boolean;
  placeholder?: string;
  onChange?: (value: SelectValue<T, D>[]) => void;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?:
    | React.RefObject<AutoCompleteMultipleRef<T, D> | null>
    | React.RefCallback<AutoCompleteMultipleRef<T, D> | null>;
  size?: 'default' | 'large';
  error?: boolean | string;
  success?: boolean;
  clearable?: boolean;
  width?: number;
  required?: boolean;
  renderOption?: (
    option: Array<SelectValue<T, D>>,
    onClick: (value: SelectValue<T, D>) => void,
    selected: Array<SelectValue<T, D>>,
    highlightedIndex: number,
  ) => React.ReactNode;
}

interface WithoutAppendProps<T, D = undefined>
  extends BaseAutoCompleteMultipleProps<T, D> {
  appendIfNotFound?: false;
  onAppend?: (input: SelectValue<T, D>) => never;
}
interface WithAppendProps<T, D = undefined>
  extends BaseAutoCompleteMultipleProps<T, D> {
  appendIfNotFound: true;
  onAppend?: (input: SelectValue<T>) => void;
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

export type AutoCompleteMultipleProps<T, D = undefined> =
  | (WithoutAppendProps<T, D> & AsyncProps<T, D>)
  | (WithoutAppendProps<T, D> & NonAsyncProps<T, D>)
  | (WithAppendProps<T, D> & AsyncProps<T, D>)
  | (WithAppendProps<T, D> & NonAsyncProps<T, D>);
