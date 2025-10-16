import { type NavigateFunction } from 'react-router-dom';

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string; // Optional URL to link the breadcrumb item
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  maxDisplay?: number; // Maximum number of breadcrumb items to display, defaults to 4
} & (
  | {
      isFormEdited?: never;
      onNavigate?: never;
    }
  | {
      isFormEdited: boolean;
      onNavigate: NavigateFunction;
    }
);

export type BreadcrumbLinkProps = {
  item: BreadcrumbItem;
  isLast?: boolean;
} & (
  | {
      isFormEdited?: never;
      onNavigate?: never;
    }
  | {
      isFormEdited: boolean;
      onNavigate: NavigateFunction;
    }
);
