import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

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

/**
 * The navigation drawers (or "sidebars") provide ergonomic access to destinations
 * in a site or app functionality such as switching accounts.
 */
const Drawer = ({
  className,
  position = 'left',
  open,
  onClose,
  children,
  width = 250,
  height = 'auto',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
}: DrawerProps) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

  // Handle escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !disableEscapeKeyDown) {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, disableEscapeKeyDown]);

  // Manage focus when drawer opens/closes
  React.useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      drawerRef.current?.focus();
    } else {
      previouslyFocusedElement.current?.focus?.();
    }
  }, [open]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, document.body.style.overflow]);

  const drawerStyle = {
    width: position === 'left' || position === 'right' ? width : '100%',
    height: position === 'top' || position === 'bottom' ? height : '100%',
  };

  // Calculate transform based on position
  const getTransform = () => {
    if (!open) {
      switch (position) {
        case 'left':
          return 'translateX(-100%)';
        case 'right':
          return 'translateX(100%)';
        case 'top':
          return 'translateY(-100%)';
        case 'bottom':
          return 'translateY(100%)';
        default:
          return '';
      }
    }
    return '';
  };

  return createPortal(
    <div
      className={cx(
        'fixed inset-0 z-[1300] transition-opacity duration-300',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className={cx(
          'fixed inset-0 bg-neutral-100/50 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
        onClick={disableBackdropClick ? undefined : onClose}
      />

      {/* Drawer content */}
      <div
        ref={drawerRef}
        className={cx(
          'bg-neutral-15 dark:bg-neutral-15-dark fixed shadow-xl',
          'transition-all duration-300 ease-in-out transform',
          'focus:outline-none', // for accessibility
          {
            'left-0 top-0': position === 'left',
            'right-0 top-0': position === 'right',
            'top-0 left-0 right-0': position === 'top',
            'bottom-0 left-0 right-0': position === 'bottom',
          },
          className,
        )}
        style={{
          ...drawerStyle,
          transform: getTransform(),
          ...(open ? { transform: 'translateX(0)' } : {}),
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Drawer;
