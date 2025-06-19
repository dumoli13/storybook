import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

export interface PopperProps {
  className?: string;
  disabled?: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  verticalAlign?: 'top' | 'center' | 'bottom'; // Vertical position on the anchor element
  horizontalAlign?: 'left' | 'center' | 'right'; // Horizontal position on the anchor element
}

/**
 *
 * A flexible and customizable popper component designed to display a floating or dropdown-like content relative to a target element. 
 * It can handle positioning and alignment adjustments, including dynamic changes due to screen resizing or scrolling. 
 * The popper can also be toggled open or closed, and it supports detecting clicks outside the popper to close it automatically.
 * 
 */
const Popper = ({
  className,
  disabled = false,
  content,
  children,
  open: openProp,
  onOpen = () => {},
  verticalAlign = 'bottom',
  horizontalAlign = 'left',
}: PopperProps) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(openProp ?? false);
  const [positionReady, setPositionReady] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const isDropdownOpen = openProp ?? open;

  const calculateDropdownPosition = React.useCallback(() => {
    if (elementRef.current && popperRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const dropdownRect = popperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;

      // Check and adjust for vertical alignment
      if (verticalAlign === 'top') {
        top = rect.top + window.scrollY - dropdownRect.height;
        if (top < 0) {
          // If overflow at top, flip to bottom
          top = rect.bottom + window.scrollY;
        }
      } else if (verticalAlign === 'bottom') {
        top = rect.bottom + window.scrollY;
        if (top + dropdownRect.height > viewportHeight) {
          // If overflow at bottom, flip to top
          top = rect.top + window.scrollY - dropdownRect.height;
        }
      } else if (verticalAlign === 'center') {
        top =
          rect.top + window.scrollY + rect.height / 2 - dropdownRect.height / 2;
      }

      // Check and adjust for horizontal alignment
      if (horizontalAlign === 'left') {
        left = rect.left + window.scrollX;
        if (left + dropdownRect.width > viewportWidth) {
          // If overflow on right, flip to left
          left = rect.right + window.scrollX - dropdownRect.width;
        }
      } else if (horizontalAlign === 'right') {
        left = rect.right + window.scrollX - dropdownRect.width;
        if (left < 0) {
          // If overflow on left, flip to right
          left = rect.left + window.scrollX;
        }
      } else if (horizontalAlign === 'center') {
        left =
          rect.left + window.scrollX + rect.width / 2 - dropdownRect.width / 2;
      }

      setDropdownPosition({
        top,
        left,
        width: rect.width,
      });
      setPositionReady(true);
    }
  }, [verticalAlign, horizontalAlign]);

  React.useEffect(() => {
    if (isDropdownOpen) {
      setPositionReady(false);
      requestAnimationFrame(() => {
        calculateDropdownPosition();
      });
    }
  }, [isDropdownOpen, calculateDropdownPosition]);

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      if (isDropdownOpen) {
        calculateDropdownPosition();
      }
    };
    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isDropdownOpen, calculateDropdownPosition]);

  React.useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp);
    }
  }, [openProp]);

  React.useEffect(() => {
    onOpen(open);
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
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cx('relative', className)}>
      <div ref={elementRef}>
        {disabled ? (
          <div>{children}</div>
        ) : (
          <div
            role="button"
            tabIndex={-1}
            aria-pressed={isDropdownOpen ? 'true' : 'false'}
            onClick={handleDropdownToggle}
          >
            {children}
          </div>
        )}
      </div>
      {!disabled &&
        isDropdownOpen &&
        createPortal(
          <div
            ref={popperRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              visibility: positionReady ? 'visible' : 'hidden',
            }}
            className="text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-30-dark shadow-box-2 rounded-lg p-4 mt-1 absolute z-[100]"
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Popper;
