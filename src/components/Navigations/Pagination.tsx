import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_ITEMS_PER_PAGE = [5, 10, 20, 30, 40, 50, 100];

export interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export type PaginationDataType = { page: number; limit: number };
export interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize?: number;
  itemPerPage?: Array<number>;
  onPageChange?: (data: PaginationDataType) => void;
}

const navButtonStyle = cx(
  'text-14px text-neutral-100 dark:text-neutral-100-dark px-2 shadow-box-1 rounded-md border border-neutral-40 dark:border-neutral-40-dark bg-neutral-10 dark:bg-neutral-10-dark h-8 flex items-center gap-2',
  'disabled:bg-neutral-40 dark:disabled:bg-neutral-30-dark disabled:text-neutral-60 dark:disabled:text-neutral-60-dark',
  'hover:bg-primary-hover dark:hover:bg-primary-hover-dark hover:text-neutral-10 dark:hover:text-neutral-10-dark',
);

const pageButtonStyle = cx(
  'text-16px text-neutral-100 dark:text-neutral-100-dark px-2 shadow-box-1 rounded-md border border-neutral-40 dark:border-neutral-40-dark bg-neutral-10 dark:bg-neutral-10-dark h-8 min-w-8',
  'disabled:bg-primary-surface dark:disabled:bg-primary-surface-dark disabled:text-primary-main dark:disabled:text-primary-main-dark disabled:border-primary-surface dark:disabled:border-primary-surface-dark disabled:cursor-default',
  'hover:bg-primary-hover dark:hover:bg-primary-hover-dark hover:text-neutral-10 dark:hover:text-neutral-10-dark',
);


const PrevButton = ({ onClick, disabled }: PaginationButtonProps) => {
  return (
    <button
      key="prev"
      type="button"
      className={navButtonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name="chevron-left" size={16} strokeWidth={2} />
      <span>Prev</span>
    </button>
  );
};


const NextButton = ({ onClick, disabled }: PaginationButtonProps) => {
  return (
    <button
      type="button"
      className={navButtonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      <span>Next</span>
      <Icon name="chevron-right" size={16} strokeWidth={2} />
    </button>
  );
};

/**
 * The Pagination component enables the user to select a specific page from a range of pages.
 */
const Pagination = ({
  total,
  currentPage,
  itemPerPage: itempPerPageProp = DEFAULT_ITEMS_PER_PAGE,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const itemPerPage = itempPerPageProp.some(item => item === pageSize) ? [...itempPerPageProp, pageSize] : itempPerPageProp;
  const [itemsPerPage, setItemsPerPage] = React.useState(
    pageSize ?? itemPerPage[0],
  );
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    onPageChange?.({ page: page, limit: itemsPerPage });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const limit = Number(e.target.value);
    setItemsPerPage(limit);

    onPageChange?.({ page: 1, limit });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    pages.push(
      <button
        type="button"
        key={1}
        className={pageButtonStyle}
        onClick={() => handlePageChange(1)}
        disabled={1 === currentPage}
      >
        1
      </button>,
    );

    if (totalPages <= maxVisiblePages) {
      for (let item = 2; item <= totalPages; item++) {
        pages.push(
          <button
            type="button"
            key={item}
            className={pageButtonStyle}
            onClick={() => handlePageChange(item)}
            disabled={item === currentPage}
          >
            {item}
          </button>,
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let item = 2; item <= 4; item++) {
          pages.push(
            <button
              type="button"
              key={item}
              className={pageButtonStyle}
              onClick={() => handlePageChange(item)}
              disabled={item === currentPage}
            >
              {item}
            </button>,
          );
        }

        if (totalPages > 5) {
          pages.push(
            <span key="end-ellipsis" className="px-2">
              ...
            </span>,
          );
        }
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>,
        );

        for (let item = currentPage - 1; item <= currentPage + 1; item++) {
          pages.push(
            <button
              type="button"
              key={item}
              className={pageButtonStyle}
              onClick={() => handlePageChange(item)}
              disabled={item === currentPage}
            >
              {item}
            </button>,
          );
        }

        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>,
        );
      } else {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>,
        );

        for (let item = totalPages - 3; item <= totalPages - 1; item++) {
          pages.push(
            <button
              type="button"
              key={item}
              className={pageButtonStyle}
              onClick={() => handlePageChange(item)}
              disabled={item === currentPage}
            >
              {item}
            </button>,
          );
        }
      }

      pages.push(
        <button
          type="button"
          key={totalPages}
          className={pageButtonStyle}
          onClick={() => handlePageChange(totalPages)}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div
      className={`flex gap-10 items-center justify-between ${totalPages > 1 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {totalPages > 1 && (
        <div className="flex item-center flex-wrap gap-2">
          <PrevButton onClick={handlePrevPage} disabled={currentPage === 1} />
          {renderPageNumbers()}
          <NextButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          />
        </div>
      )}

      <select
        id="pagination"
        aria-label="items-per-page"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="text-14px flex items-center gap-2 h-8 px-2 shadow-box-1 rounded border border-neutral-40 dark:border-neutral-40-dark text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-10-dark focus:ring-3 focus:ring-primary-focus dark:focus:ring-primary-focus-dark"
      >
        {itemPerPage.map((option) => (
          <option key={option} value={option} className="p-2">
            {`${option}/page`}
          </option>
        ))}
      </select>
    </div>
  );
};

Pagination.Prev = PrevButton;

Pagination.Next = NextButton;

export default Pagination;
