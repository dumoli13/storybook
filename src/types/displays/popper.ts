export type Placement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';

export interface PopperProps {
  disabled?: boolean;
  content: React.ReactNode;
  children: React.ReactElement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  placement?: Placement;
  offset?: number; // Distance between popper and anchor
  className?: string;
  style?: React.CSSProperties;
  closeOnClickChild?: boolean;
  onClickOutside?: () => void;
}
