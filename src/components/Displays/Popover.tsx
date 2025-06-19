import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

export interface PopoverProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  elementRef: React.RefObject<HTMLElement | null>;
  onClose?: () => void;
  verticalAlign?: 'top' | 'center' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right'; 
}

const Popover = ({
  children,
  className,
  open,
  elementRef,
  onClose,
  verticalAlign = 'bottom',
  horizontalAlign = 'left', 
}: PopoverProps) => {
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const calculateDropdownPosition = React.useCallback(() => {
    if (elementRef.current && popoverRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const dropdownRect = popoverRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;

      // Check and adjust for vertical alignment
      if (verticalAlign === 'top') {
        top = rect.top + window.scrollY - dropdownRect.height - 8;
        if (top < 0) {
          top = rect.bottom + window.scrollY;
        }
      } else if (verticalAlign === 'bottom') {
        top = rect.bottom + window.scrollY;
        if (top + dropdownRect.height > viewportHeight) {
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
          left = rect.right + window.scrollX - dropdownRect.width;
        }
      } else if (horizontalAlign === 'right') {
        left = rect.right + window.scrollX - dropdownRect.width;
        if (left < 0) {
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
    }
  }, [verticalAlign, horizontalAlign]);

  React.useEffect(() => {
    if (open) {
      calculateDropdownPosition();
    }
  }, [open, calculateDropdownPosition]);

  React.useEffect(() => {
    const handleScrollOrResize = () => {
      if (open) {
        calculateDropdownPosition();
      }
    };
    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open, calculateDropdownPosition]);

  if (!open) return null;

  // Create the transform-origin string
 
  return createPortal(
    <div role="none" className="fixed z-[1300] inset-0">
      <div
        aria-hidden="true"
        className="z-[2000] fixed inset-0"
        onClick={() => onClose?.()}
      />

      <div
        ref={popoverRef}
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
         }}
        className={cx(
          'text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-30-dark shadow-box-2 rounded-lg p-4 mt-1 absolute z-[2100]',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Popover;