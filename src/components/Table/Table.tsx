/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import cx from 'classnames';
import { SelectValue } from '../../types';
import Checkbox from '../Inputs/Checkbox';
import TableFilterSearch from './TableFilterSearch';
import TableFilterSelect from './TableFilterSelect';
import { Pagination, PaginationDataType } from '../Navigations';
import { useDebouncedCallback } from 'use-debounce';
import { DEFAULT_ITEMS_PER_PAGE } from '../../const';
import { PaginationRef } from '../Navigations/Pagination';
import { Skeleton } from '../Displays';

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
  | (BaseProps<T> & AsyncProps<T>)
  | (BaseProps<T> & NonAsyncProps<T>);

/**
 * Tables display sets of data. They can be fully customized.
 */
const Table = <T extends { [key: string]: any }>({
  columns,
  stickyHeader = false,
  maxHeight = 680,
  selectedRows: selectedRowsProp,
  onRowSelect,
  sorting = { key: columns[0].key, direction: null },
  rowClassName,
  rowStyle,
  onSort,
  fullwidth,
  showSelected = false,
  size = 'default',
  verticalAlign,
  style = 'default',
  onRowClick,
  data: dataProps,
  async,
  fetchData,
}: TableProps<T>) => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const paginationRef = React.useRef<PaginationRef>(null);

  const [focused, setFocused] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

  const [loadingFetchData, setLoadingFetchData] = React.useState(false);
  const [data, setData] = React.useState<T[]>(async ? [] : dataProps);
  const [pagination, setPagination] = React.useState<PaginationDataType>({
    page: 1,
    limit: DEFAULT_ITEMS_PER_PAGE[1],
  });
  const [filter, setFilter] = React.useState<Record<keyof T, string>>(
    columns.reduce<Record<keyof T, string>>((acc, col) => {
      const value = col.filterValue;
      if ('filterValue' in col && value) {
        acc[col.key as keyof T] = String(
          typeof value === 'object' && 'value' in value ? value.value : value,
        );
      }
      return acc;
    }, {} as Record<keyof T, string>),
  );
  const [ordering, setOrdering] = React.useState<TableSortingProps<T>>(sorting);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = data.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;

      case 'ArrowLeft':
        e.preventDefault();
        paginationRef.current?.prev();
        break;

      case 'ArrowRight':
        e.preventDefault();
        paginationRef.current?.next();
        break;

      case 'Enter':
        e.preventDefault();
        onRowClick(data[highlightedIndex], highlightedIndex);
        break;

      case 'Escape':
        e.preventDefault();
        setHighlightedIndex(-1);
        setFocused(false);
        break;

      default:
        break;
    }
  };

  const [internalSelectedRows, setInternalSelectedRows] = React.useState<
    number[]
  >([]);

  const isControlled = selectedRowsProp !== undefined;
  const selectedRows = isControlled ? selectedRowsProp : internalSelectedRows;

  const handleFilter = (columnKey: keyof T, value: string) => {
    setFilter((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[columnKey];
      } else {
        next[columnKey] = value;
      }
      return next;
    });
  };

  const handleSort = (columnKey: keyof T) => {
    let newConfig: TableSortingProps<T>;

    if (ordering.key === columnKey) {
      let direction: 'asc' | 'desc' | null;
      switch (ordering.direction) {
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
    setOrdering(newConfig);
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

  React.useEffect(() => {
    if (!tableRef.current || highlightedIndex < 0) return;

    // Find any element that is marked as the highlighted one
    const activeItem = tableRef.current.querySelector(
      '[data-highlighted="true"]',
    ) as HTMLElement | null;

    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'end',
      });
    }
  }, [highlightedIndex]);

  const fetchDebounced = useDebouncedCallback(async () => {
    setLoadingFetchData(true);
    const newData = await fetchData(filter, pagination, ordering);
    setData(newData);
    setLoadingFetchData(false);
  }, 1000);

  useEffect(() => {
    fetchDebounced();
    return () => fetchDebounced.cancel();
  }, [filter, pagination, ordering]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed="true"
      className={cx(
        'outline-none cursor-default text-neutral-100 dark:text-neutral-100-dark overflow-x-auto',
        {
          'w-full': fullwidth,
          'rounded-md ring-3 ring-primary-focus dark:ring-primary-focus-dark !border-primary-main dark:!border-primary-main-dark':
            focused,
        },
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
      ref={tableRef}
    >
      {loadingFetchData && data.length === 0 ? (
        <Skeleton.Table column={columns.length} row={pagination.limit} />
      ) : (
        <div
          className="overflow-y-auto border border-neutral-30 dark:border-neutral-30-dark rounded-md mb-4"
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
                      'font-medium text-left bg-neutral-20 dark:bg-neutral-20-dark border-r border-neutral-30 dark:border-neutral-30-dark last:border-none',
                      {
                        'px-4 py-3 text-18px': size === 'large',
                        'px-4 py-3 text-14px': size === 'default',
                        'px-4 py-2 text-14px': size === 'small',
                      },
                    )}
                  >
                    <div className="flex items-center justify-center">
                      Select
                    </div>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key.toString()}
                    className={cx(
                      'font-medium bg-neutral-20 dark:bg-neutral-20-dark border-r border-neutral-30 dark:border-neutral-30-dark last:border-none',
                      {
                        'px-4 py-3 text-18px': size === 'large',
                        'px-4 py-3 text-14px': size === 'default',
                        'px-4 py-2 text-14px': size === 'small',
                        'text-left': col.align === 'left',
                        'text-right': col.align === 'right',
                        'text-center': col.align === 'center',
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
                    <div
                      className={cx(
                        'flex gap-4 items-center justify-between',
                        {},
                      )}
                    >
                      {col.sortable && (
                        <div
                          role="button"
                          className={cx('flex gap-2.5 items-center w-full', {
                            'justify-start': !col.align || col.align === 'left',
                            'justify-end': col.align === 'right',
                            'justify-center': col.align === 'center',
                          })}
                          onClick={() => handleSort(col.key)}
                        >
                          {col.subLabel ? (
                            <div
                              className={cx('flex flex-col', {
                                'items-start':
                                  !col.align || col.align === 'left',
                                'items-end': col.align === 'right',
                                'items-center': col.align === 'center',
                              })}
                            >
                              <div>{col.label}</div>
                              <div>{col.subLabel}</div>
                            </div>
                          ) : (
                            col.label
                          )}
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`w-0 h-0 border-l-4 border-l-transparent dark:border-l-transparent border-r-4 border-r-transparent dark:border-r-transparent border-b-8 transition-colors duration-300 ${
                                col.key === ordering.key &&
                                ordering.direction === 'asc'
                                  ? 'border-primary-main dark:border-primary-main-dark'
                                  : 'border-neutral-60 dark:border-neutral-60-dark'
                              }`}
                            />
                            <span
                              className={`w-0 h-0 border-l-4 border-l-transparent dark:border-l-transparent border-r-4 border-r-transparent dark:border-r-transparent border-t-8 transition-colors duration-300 ${
                                col.key === ordering.key &&
                                ordering.direction === 'desc'
                                  ? 'border-primary-main dark:border-primary-main-dark'
                                  : 'border-neutral-60 dark:border-neutral-60-dark'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                      {!col.sortable && col.subLabel && (
                        <div
                          className={cx('w-full flex flex-col', {
                            'items-start': !col.align || col.align === 'left',
                            'items-end': col.align === 'right',
                            'items-center': col.align === 'center',
                          })}
                        >
                          <div>{col.label}</div>
                          <div>{col.subLabel}</div>
                        </div>
                      )}
                      {!col.sortable && !col.subLabel && (
                        <div
                          className={cx('w-full', {
                            'text-left': !col.align || col.align === 'left',
                            'text-right': col.align === 'right',
                            'text-center': col.align === 'center',
                          })}
                        >
                          {col.label}
                        </div>
                      )}
                      {/* Filters */}
                      {'filter' in col &&
                        col.filter !== undefined &&
                        col.filter === 'textfield' && (
                          <TableFilterSearch
                            label={col.label}
                            value={col.filterValue}
                            onChange={(value) => {
                              handleFilter(col.key, value);
                              col.onChange?.(value);
                            }}
                          />
                        )}
                      {'filter' in col &&
                        (col.filter === 'select' ||
                          col.filter === 'autocomplete') && (
                          <TableFilterSelect
                            type={col.filter}
                            label={col.label}
                            value={
                              col.filterValue as SelectValue<T[keyof T]> | null
                            }
                            option={col.option || []}
                            onChange={(value) => {
                              handleFilter(col.key, value.value);
                              col.onChange?.(value as SelectValue<T[keyof T]>);
                            }}
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
                    data-highlighted={rowIndex === highlightedIndex}
                    className={cx(
                      'group border-b border-neutral-30 last:border-none',
                      {
                        'text-18px': size === 'large',
                        'text-14px': size === 'small' || size === 'default',
                        'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark':
                          !isCustomRowClassName,
                        'bg-neutral-10 dark:bg-neutral-10-dark even:bg-neutral-15 dark:even:bg-neutral-15-dark':
                          style === 'default',
                        'bg-neutral-10 dark:bg-neutral-10-dark':
                          style === 'simple',
                        '!bg-primary-surface !dark:bg-primary-surface-dark':
                          rowIndex === highlightedIndex,
                        'cursor-pointer': !!onRowClick,
                      },
                      isCustomRowClassName,
                    )}
                    style={rowStyle?.(row)}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {showSelected && (
                      <td
                        className={cx('py-1.5 text-center break-words', {
                          'bg-primary-surface dark:bg-primary-surface-dark':
                            isSelected,
                        })}
                        style={{ verticalAlign }}
                      >
                        <div
                          className={cx({
                            'bg-primary-surface dark:bg-primary-surface-dark':
                              isSelected,
                            'px-4 py-3': size === 'default' || size === 'large',
                            'px-4 py-0.5': size === 'small',
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
                          className={cx('py-1.5 text-center break-words', {
                            'bg-primary-surface dark:bg-primary-surface-dark':
                              isSelected,
                          })}
                          style={{ verticalAlign }}
                        >
                          <div
                            className={cx({
                              'px-4 py-3':
                                size === 'default' || size === 'large',
                              'px-4 py-0.5': size === 'small',
                              'text-left': !col.align || col.align === 'left',
                              'text-right': col.align === 'right',
                              'text-center': col.align === 'center',
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
      )}

      <Pagination
        itemPerPage={DEFAULT_ITEMS_PER_PAGE}
        currentPage={pagination.page}
        pageSize={pagination.limit}
        onPageChange={setPagination}
        hasNext={data.length === pagination.limit}
        paginationRef={paginationRef}
      />
    </div>
  );
};

export default Table;
