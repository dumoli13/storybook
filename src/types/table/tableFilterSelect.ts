import { SelectValue } from '../inputs';

export interface TableFilterSelectProps<T, D> {
  type: 'select' | 'autocomplete';
  value?: SelectValue<T, D> | null;
  option: Array<SelectValue<T, D>>;
  label?: string;
  onChange?: (value: SelectValue<T, D> | null) => void;
}
