export interface InputDropdownProps {
  open: boolean;
  children: React.ReactNode;
  elementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  fullWidth?: boolean;
  maxHeight?: number;
}
