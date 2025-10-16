import { SelectValue } from '../inputs';
import { PaginationDataType } from '../navigations';

type BaseColumnCommon = {
  key: string;
  label: string;
  subLabel?: React.ReactNode;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
};

type ColumnWithDataIndex<T, K extends keyof T> = BaseColumnCommon & {
  dataIndex: K;
  render?: (value: T[K], record: T, index: number) => React.ReactNode;
};

type ColumnWithoutDataIndex<T> = BaseColumnCommon & {
  dataIndex?: never;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
};

type TextFieldColumn<T, K extends keyof T> =
  | (ColumnWithDataIndex<T, K> & {
      filter: 'textfield';
      filterValue: string;
      onChange: (value: string) => void;
    })
  | (ColumnWithoutDataIndex<T> & {
      filter: 'textfield';
      filterValue: string;
      onChange: (value: string) => void;
    });

type SelectColumn<T, K extends keyof T, D = undefined> =
  | (ColumnWithDataIndex<T, K> & {
      filter: 'select' | 'autocomplete';
      filterValue: SelectValue<T[K], D> | null;
      onChange: (value: SelectValue<T[K], D> | null) => void;
      option: Array<SelectValue<T[K], D>>;
    })
  | (ColumnWithoutDataIndex<T> & {
      filter: 'select' | 'autocomplete';
      filterValue: unknown;
      onChange: (value: unknown) => void;
      option: Array<SelectValue<any, D>>;
    });

type NoFilterColumn<T, K extends keyof T = keyof T> =
  | (ColumnWithDataIndex<T, K> & {
      filter?: 'none';
      filterValue?: T[K] | null;
    })
  | (ColumnWithoutDataIndex<T> & {
      filter?: 'none';
      filterValue?: unknown;
    });

export type TableColumn<T> =
  | { [K in keyof T]: TextFieldColumn<T, K> }[keyof T]
  | { [K in keyof T]: SelectColumn<T, K> }[keyof T]
  | { [K in keyof T]: NoFilterColumn<T, K> }[keyof T];

export type TableSortingProps<T> = {
  direction: 'asc' | 'desc' | null;
  key: keyof T;
};

interface BaseProps<T> {
  columns: TableColumn<T>[];
  stickyHeader?: boolean;
  maxHeight?: number | string;
  selectedRows?: number[];
  onRowSelect?: (row: number, value: boolean, selectedRows: number[]) => void; // selectedRows is indexes of the list
  sorting?: TableSortingProps<T> | null;
  onSort?: (sort: TableSortingProps<T>) => void;
  rowClassName?: (record: T) => string;
  rowStyle?: (record: T) => React.CSSProperties;
  fullwidth?: boolean;
  showSelected?: boolean;
  size?: 'small' | 'default' | 'large';
  verticalAlign?: 'top' | 'center' | 'bottom';
  style?: 'default' | 'simple';
  onRowClick?: (record: T, index: number) => void;
}

interface PaginationProps {
  paginate: true;
  total?: number;
  pagination: PaginationDataType;
  onPageChange: (data: PaginationDataType) => void;
}

interface NoPaginationProps {
  paginate?: false;
  total?: never;
  pagination?: never;
  onPageChange?: never;
}

interface AsyncProps<T> {
  async: true;
  fetchData: (
    keyword: Record<keyof T, string>,
    pagination: PaginationDataType,
    ordering: TableSortingProps<T>,
  ) => Promise<T[]>;
  data?: never;
}

interface NonAsyncProps<T> {
  async?: false;
  fetchData?: never;
  data: T[];
}

export type TableProps<T> =
  | (BaseProps<T> & AsyncProps<T> & PaginationProps)
  | (BaseProps<T> & AsyncProps<T> & NoPaginationProps)
  | (BaseProps<T> & NonAsyncProps<T> & PaginationProps)
  | (BaseProps<T> & NonAsyncProps<T> & NoPaginationProps);
