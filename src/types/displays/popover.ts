export interface PopoverProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  elementRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
  verticalAlign?: 'top' | 'center' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right';
}
