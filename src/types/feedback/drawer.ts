type BaseDrawerProps = {
  className?: string;
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
};

type LeftRightDrawerProps = BaseDrawerProps & {
  position: 'left' | 'right';
  width?: number | string;
  height?: never; // Explicitly disallow height
};

type TopBottomDrawerProps = BaseDrawerProps & {
  position: 'top' | 'bottom';
  height?: number | string;
  width?: never; // Explicitly disallow width
};

export type DrawerProps = LeftRightDrawerProps | TopBottomDrawerProps;
