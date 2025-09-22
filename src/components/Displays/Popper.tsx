import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

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

const Popper = ({
  disabled = false,
  content,
  children,
  open: openProp,
  onOpen,
  placement = 'bottom-left',
  offset = 8,
  className,
  style,
  closeOnClickChild = false,
  onClickOutside,
}: PopperProps) => {
  const elementRef = React.useRef<HTMLElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(openProp ?? false);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  const isDropdownOpen = openProp ?? open;

  const calculatePosition = React.useCallback(() => {
    if (!elementRef.current || !popperRef.current) return;

    const anchorRect = elementRef.current.getBoundingClientRect();
    const popperRect = popperRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let newPosition = { top: 0, left: 0 };
    let fixPlacement = placement;

    const { top, bottom, left, right } = anchorRect;
    const { width, height } = popperRect;

    if (top - height - offset < 0) {
      fixPlacement = fixPlacement.replace('top', 'bottom') as Placement;
    } else if (bottom + height + offset > window.innerHeight) {
      fixPlacement = fixPlacement.replace('bottom', 'top') as Placement;
    }
    if (left + width + offset > window.innerWidth) {
      fixPlacement = fixPlacement.replace('left', 'right') as Placement;
    } else if (right - width - offset < 0) {
      fixPlacement = fixPlacement.replace('right', 'left') as Placement;
    }

    // Calculate position based on effective placement
    switch (fixPlacement) {
      case 'top':
        newPosition = {
          top: anchorRect.top + scrollY - popperRect.height - offset,
          left:
            anchorRect.left +
            scrollX +
            anchorRect.width / 2 -
            popperRect.width / 2,
        };
        break;
      case 'top-left':
        newPosition = {
          top: anchorRect.top + scrollY - popperRect.height - offset,
          left: anchorRect.left + scrollX,
        };
        break;
      case 'top-right':
        newPosition = {
          top: anchorRect.top + scrollY - popperRect.height - offset,
          left: anchorRect.right + scrollX - popperRect.width,
        };
        break;
      case 'bottom':
        newPosition = {
          top: anchorRect.bottom + scrollY + offset,
          left:
            anchorRect.left +
            scrollX +
            anchorRect.width / 2 -
            popperRect.width / 2,
        };
        break;
      case 'bottom-left':
        newPosition = {
          top: anchorRect.bottom + scrollY + offset,
          left: anchorRect.left + scrollX,
        };
        break;
      case 'bottom-right':
        newPosition = {
          top: anchorRect.bottom + scrollY + offset,
          left: anchorRect.right + scrollX - popperRect.width,
        };
        break;
      case 'left':
        newPosition = {
          top:
            anchorRect.top +
            scrollY +
            anchorRect.height / 2 -
            popperRect.height / 2,
          left: anchorRect.left + scrollX - popperRect.width - offset,
        };
        break;
      case 'left-top':
        newPosition = {
          top: anchorRect.top + scrollY,
          left: anchorRect.left + scrollX - popperRect.width - offset,
        };
        break;
      case 'left-bottom':
        newPosition = {
          top: anchorRect.bottom + scrollY - popperRect.height,
          left: anchorRect.left + scrollX - popperRect.width - offset,
        };
        break;
      case 'right':
        newPosition = {
          top:
            anchorRect.top +
            scrollY +
            anchorRect.height / 2 -
            popperRect.height / 2,
          left: anchorRect.right + scrollX + offset,
        };
        break;
      case 'right-top':
        newPosition = {
          top: anchorRect.top + scrollY,
          left: anchorRect.right + scrollX + offset,
        };
        break;
      case 'right-bottom':
        newPosition = {
          top: anchorRect.bottom + scrollY - popperRect.height,
          left: anchorRect.right + scrollX + offset,
        };
        break;
    }

    setPosition({
      top: newPosition.top,
      left: newPosition.left,
    });
  }, [placement, offset]);

  React.useEffect(() => {
    if (isDropdownOpen) {
      calculatePosition();
    }
  }, [isDropdownOpen, calculatePosition]);

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      if (isDropdownOpen) {
        calculatePosition();
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isDropdownOpen, calculatePosition]);

  React.useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  React.useEffect(() => {
    onOpen?.(open);
  }, [open, onOpen]);

  const handleDropdownToggle = () => {
    if (!disabled) {
      setOpen((prev) => !prev);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      !popperRef.current?.contains(target) &&
      !elementRef.current?.contains(target)
    ) {
      setOpen(false);
      onClickOutside?.();
    }
  };
  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent event from bubbling to document
    e.stopPropagation();
    // Close when any content is clicked
    if (closeOnClickChild) setOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const anchorElement = React.cloneElement(children, {
    ['ref' as string]: (node: HTMLElement | null) => {
      elementRef.current = node;

      // Handle original ref if exists
      const childRef = (children as any).ref;

      if (childRef) {
        if (typeof childRef === 'function') {
          childRef(node);
        } else {
          childRef.current = node;
        }
      }
    },
    ['onClick' as string]: (e: React.MouseEvent) => {
      // Call original onClick handler if it exists
      const childProps = (children as any).props;
      if (childProps.onClick) {
        childProps.onClick(e);
      }

      if (!e.isPropagationStopped() && !disabled) {
        handleDropdownToggle();
      }
    },
    ['aria-expanded' as string]: isDropdownOpen ? 'true' : 'false',
    ['aria-haspopup' as string]: 'dialog',
    ['role' as string]: 'button',
  });

  if (disabled) {
    return children;
  }

  return (
    <>
      {anchorElement}
      {!disabled &&
        isDropdownOpen &&
        createPortal(
          <div
            ref={popperRef}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              ...style,
            }}
            onClick={handleContentClick}
            className={cx(
              'absolute z-[2100] bg-neutral-10 dark:bg-neutral-30-dark shadow-lg drop-shadow rounded-lg',
              className,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Popper;
