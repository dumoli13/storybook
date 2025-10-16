export interface TooltipProps {
  children: React.ReactNode;
  onOpen?: (open: boolean) => void;
  verticalAlign?: 'top' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right';
  arrow?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  title: string;
  disabled?: boolean;
}
