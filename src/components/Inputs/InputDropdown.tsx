import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

export interface InputDropdownProps {
  open: boolean;
  children: React.ReactNode;
  elementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  fullWidth?: boolean;
  maxHeight?: number;
}

/**
 *
 * A dropdown component that displays content below or above a reference element, dynamically positioning itself based on available space on the screen.
 * This component supports handling scroll and resize events to adjust the position of the dropdown.
 *
 * @property {boolean} open - A boolean flag to control whether the dropdown is open or closed.
 * @property {ReactNode} children - The content to display inside the dropdown (usually options or items).
 * @property {RefObject<HTMLDivElement>} elementRef - A reference to the element to which the dropdown is attached.
 * @property {RefObject<HTMLDivElement>} dropdownRef - A reference to the dropdown element itself.
 * @property {boolean} [fullWidth=false] - A flag that expand to full container width if set to true.
 * @property {number} [maxHeight=300] - The maximum height of the dropdown, allowing for scroll if content overflows.
 *
 */
const InputDropdown = ({
  open,
  children,
  elementRef,
  dropdownRef,
  fullWidth,
  maxHeight = 300,
}: InputDropdownProps) => {
  const [dropdownStyles, setDropdownStyles] = React.useState<{
    top: number;
    left: number;
    width?: number;
    direction: 'down' | 'up';
  } | null>(null);

  const calculateDropdownPosition = React.useCallback(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current?.offsetHeight || 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setDropdownStyles({
        top:
          spaceBelow >= dropdownHeight || spaceBelow > spaceAbove
            ? rect.bottom + window.scrollY
            : rect.top - dropdownHeight - 10 + window.scrollY,
        left: rect.left + window.scrollX,
        width: fullWidth ? rect.width : undefined,
        direction:
          spaceBelow >= dropdownHeight || spaceBelow > spaceAbove
            ? 'down'
            : 'up',
      });
    }
  }, [elementRef, dropdownRef, fullWidth]);

  React.useEffect(() => {
    if (open) {
      calculateDropdownPosition();
      const handleScrollOrResize = () => calculateDropdownPosition();
      window.addEventListener('scroll', handleScrollOrResize);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    } else {
      setDropdownStyles(null); // Reset styles when closed
    }
  }, [open, calculateDropdownPosition]);

  // Don't render until position is calculated
  if (!open || !dropdownStyles) return null;

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      onMouseDown={(e) => e.stopPropagation()}
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: dropdownStyles.top,
        left: dropdownStyles.left,
        width: dropdownStyles.width,
        maxHeight,
      }}
      className={cx(
        'bg-neutral-10 dark:bg-neutral-10-dark shadow-box-2 rounded-lg py-1.5 text-neutral-100 dark:text-neutral-100-dark overflow-y-auto z-[1999] cursor-default',
        {
          'mt-1': dropdownStyles.direction === 'down',
          'mb-1': dropdownStyles.direction === 'up',
        },
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

export default InputDropdown;
