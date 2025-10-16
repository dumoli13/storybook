export interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export type PaginationDataType = { page: number; limit: number };

export interface PaginationRef {
  next: () => void;
  prev: () => void;
}

interface BasePaginationProps {
  currentPage: number;
  pageSize?: number;
  itemPerPage?: Array<number>;
  onPageChange?: (data: PaginationDataType) => void;
  paginationRef?:
    | React.RefObject<PaginationRef | null>
    | React.RefCallback<PaginationRef | null>;
}
interface PaginationWithTotal {
  total: number;
  hasNext?: never;
}

interface PaginationWithoutTotal {
  total?: never;
  hasNext: boolean;
}

export type PaginationProps =
  | (BasePaginationProps & PaginationWithTotal)
  | (BasePaginationProps & PaginationWithoutTotal);
