/* eslint-disable react/no-array-index-key */
import React, { CSSProperties } from 'react';
import cx from 'classnames';
import Checkbox from '../Inputs/Checkbox';
import { SelectValue } from '../Inputs/Select';
import FilterSearch from './FilterSearch';
import FilterSelect from './FilterSelect';

type BaseColumnCommon = {
  key: string;
  label: string;
  subLabel?: string;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number;
};

type ColumnWithDataIndex<T, K extends keyof T> = BaseColumnCommon & {
  dataIndex: K;
  render?: (value: T[K], record: T, index: number) => React.ReactNode;
};

type ColumnWithoutDataIndex<T> = BaseColumnCommon & {
  dataIndex: undefined;
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

export type TableFilterProps<T> = {
  [key in keyof T]?: string | SelectValue<T[keyof T]> | null;
};

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  stickyHeader?: boolean;
  maxHeight?: number | string;
  selectedRows?: number[];
  onRowSelect?: (row: number, value: boolean, selectedRows: number[]) => void; // selectedRows is indexes of the list
  sorting?: TableSortingProps<T> | null;
  onSort?: (sort: TableSortingProps<T>) => void;
  rowClassName?: (record: T) => string;
  rowStyle?: (record: T) => CSSProperties;
  fullwidth?: boolean;
  showSelected?: boolean;
  size?: 'default' | 'large';
  verticalAlign?: 'top' | 'center' | 'bottom';
}

/**
 * Tables display sets of data. They can be fully customized.
 */

const Table = <T extends { [key: string]: any }>({
  columns,
  data,
  stickyHeader = false,
  maxHeight = 680,
  selectedRows: selectedRowsProp,
  onRowSelect,
  sorting,
  rowClassName,
  rowStyle,
  onSort,
  fullwidth,
  showSelected = false,
  size = 'default',
  verticalAlign,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = React.useState<TableSortingProps<T>>(
    sorting || { key: columns[0].key, direction: null },
  );

  const [internalSelectedRows, setInternalSelectedRows] = React.useState<
    number[]
  >([]);
  const isControlled = selectedRowsProp !== undefined;
  const selectedRows = isControlled ? selectedRowsProp : internalSelectedRows;

  const handleSort = (columnKey: keyof T) => {
    let newConfig: TableSortingProps<T>;

    if (sortConfig.key === columnKey) {
      let direction: 'asc' | 'desc' | null;
      switch (sortConfig.direction) {
        case 'asc':
          direction = 'desc';
          break;
        case 'desc':
          direction = null;
          break;
        default:
          direction = 'asc';
          break;
      }

      newConfig = {
        key: columnKey,
        direction,
      };
    } else {
      newConfig = { key: columnKey, direction: 'asc' };
    }
    setSortConfig(newConfig);
    onSort?.(newConfig);
  };

  const handleRowSelect = (row: number, isSelected: boolean) => {
    const newSelectedRows = isSelected
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow !== row);
    onRowSelect?.(row, isSelected, newSelectedRows);

    if (!isControlled) {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  return (
    <div
      className={cx(
        'text-neutral-100 dark:text-neutral-100-dark overflow-x-auto',
        { 'w-full': fullwidth },
      )}
    >
      <div
        className="overflow-y-auto border border-neutral-30 dark:border-neutral-30-dark rounded-md"
        style={stickyHeader ? { maxHeight } : undefined}
      >
        <table
          className="min-w-full border-collapse"
          style={{ tableLayout: 'auto' }} // Ensure `auto` layout for responsive columns
        >
          <thead
            className={cx({
              'sticky top-0 bg-neutral-10 shadow-md z-10': stickyHeader,
            })}
          >
            <tr>
              {showSelected && (
                <th
                  className={cx(
                    'font-medium text-left bg-neutral-20 dark:bg-neutral-20-dark px-4 py-3 border-r border-neutral-30 dark:border-neutral-30-dark last:border-none',
                    {
                      'text-18px': size === 'large',
                      'text-14px': size === 'default',
                    },
                  )}
                >
                  <div className="flex items-center justify-center">Select</div>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  className={cx(
                    'font-medium text-left bg-neutral-20 dark:bg-neutral-20-dark px-4 py-3 border-r border-neutral-30 dark:border-neutral-30-dark last:border-none',
                    {
                      'text-18px': size === 'large',
                      'text-14px': size === 'default',
                    },
                  )}
                  style={{
                    width: col.width,
                    minWidth:
                      col.width ??
                      `${Math.max(
                        typeof col.width === 'number' ? col.width : 0,
                        col.minWidth
                          ? parseInt(col.minWidth.toString(), 10)
                          : 0,
                        150,
                      )}px`,
                  }}
                >
                  <div className="flex gap-4 items-center justify-between">
                    {col.sortable ? (
                      <div
                        role="button"
                        className="w-full flex items-center gap-2.5"
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        {col.subLabel ? (
                          <div className="flex flex-col items-center">
                            {col.label}
                            <span className="text-16px">{col.subLabel}</span>
                          </div>
                        ) : (
                          col.label
                        )}
                        {col.sortable && (
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`w-0 h-0 border-l-4 border-l-transparent dark:border-l-transparent border-r-4 border-r-transparent dark:border-r-transparent border-b-8 transition-colors duration-300 ${
                                col.key === sortConfig.key &&
                                sortConfig.direction === 'asc'
                                  ? 'border-primary-main dark:border-primary-main-dark'
                                  : 'border-neutral-60 dark:border-neutral-60-dark'
                              }`}
                            />
                            <span
                              className={`w-0 h-0 border-l-4 border-l-transparent dark:border-l-transparent border-r-4 border-r-transparent dark:border-r-transparent border-t-8 transition-colors duration-300 ${
                                col.key === sortConfig.key &&
                                sortConfig.direction === 'desc'
                                  ? 'border-primary-main dark:border-primary-main-dark'
                                  : 'border-neutral-60 dark:border-neutral-60-dark'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center">
                        {col.subLabel ? (
                          <div className="flex flex-col items-start">
                            {col.label}
                            <span className="text-16px">{col.subLabel}</span>
                          </div>
                        ) : (
                          col.label
                        )}
                      </div>
                    )}

                    {/* Filters */}
                    {'filter' in col &&
                      col.filter !== undefined &&
                      col.filter === 'textfield' && (
                        <FilterSearch
                          label={col.label}
                          value={col.filterValue}
                          onChange={(value) => col.onChange?.(value)}
                        />
                      )}
                    {'filter' in col &&
                      (col.filter === 'select' ||
                        col.filter === 'autocomplete') && (
                        <FilterSelect
                          type={col.filter}
                          label={col.label}
                          value={
                            col.filterValue as SelectValue<T[keyof T]> | null
                          }
                          option={col.option || []}
                          onChange={(value) =>
                            col.onChange?.(value as SelectValue<T[keyof T]>)
                          }
                        />
                      )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isCustomRowClassName = rowClassName?.(row);
              const isSelected =
                showSelected &&
                selectedRows.some((index) => index === rowIndex);
              return (
                <tr
                  key={rowIndex}
                  className={cx(
                    'group border-b border-neutral-30 last:border-none',
                    {
                      'text-18px': size === 'large',
                      'text-14px': size === 'default', 
                      'bg-neutral-10 dark:bg-neutral-10-dark even:bg-neutral-15 dark:even:bg-neutral-15-dark hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                        !isCustomRowClassName,
                    },
                    isCustomRowClassName
                  )}
                  style={rowStyle?.(row)}
                >
                  {showSelected && (
                    <td
                      className="py-1.5 text-center break-words"
                      style={{ verticalAlign }}
                    >
                      <div
                        className={cx('px-4 py-3', {
                          'bg-primary-surface dark:bg-primary-surface-dark':
                            isSelected,
                        })}
                      >
                        <Checkbox
                          id={`select_row_${rowIndex}`}
                          checked={isSelected}
                          onChange={(isChecked) =>
                            handleRowSelect(rowIndex, isChecked)
                          }
                          disabled={!onRowSelect}
                          className="h-5"
                          aria-label={`select_row_${rowIndex}`}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col) => {
                    const rowCol = col.dataIndex ? row[col.dataIndex] : null;
                    const value =
                      rowCol == null || rowCol === '' ? '-' : rowCol;
                    return (
                      <td
                        key={col.key.toString()}
                        className="py-1.5 break-words"
                        style={{ verticalAlign }}
                      >
                        <div
                          className={cx('px-4 py-3', {
                            'bg-primary-surface dark:bg-primary-surface-dark':
                              isSelected,
                          })}
                        >
                          {col.render ? (
                            col.render(
                              rowCol as NonNullable<typeof rowCol>,
                              row,
                              rowIndex,
                            )
                          ) : (
                            <div className="line-clamp-3">{value}</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
