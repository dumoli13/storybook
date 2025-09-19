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
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width?: number;
    direction: 'down' | 'up';
  }>({ top: 0, left: 0, width: 0, direction: 'down' });

  const calculateDropdownPosition = React.useCallback(() => {
    if (!elementRef.current || !dropdownRef.current) return;

    const anchorRect = elementRef.current.getBoundingClientRect();
    const popperRect = dropdownRef.current.getBoundingClientRect();
    const dropdownHeight = popperRect.height;
    const dropdownWidth = popperRect.width;

    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    const spaceRight = window.innerWidth - anchorRect.right;
    const spaceLeft = anchorRect.left;

    // Determine vertical placement
    let top: number;
    let direction: 'up' | 'down';

    if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
      // Place below
      console.log("condition 1")
      top = anchorRect.bottom + window.scrollY;
      direction = 'down';
    } else {
      // Place above
      console.log("condition 2")
      top = anchorRect.top - dropdownHeight - 10 + window.scrollY;
      direction = 'up';
    }

    // Determine horizontal placement
    let left: number;
    let width: number | undefined;

    if (fullWidth) {
      left = anchorRect.left + window.scrollX;
      width = anchorRect.width;
    } else if (spaceRight >= dropdownWidth || spaceRight > spaceLeft) {
        // Check if dropdown fits to the right
        left = anchorRect.left + window.scrollX;
      } else {
        // Place to the left
        left = anchorRect.right - dropdownWidth + window.scrollX;
      }
    

    // Ensure dropdown stays within viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left + dropdownWidth > viewportWidth + window.scrollX) {
      left = viewportWidth - dropdownWidth + window.scrollX - 24;
    }
    if (left < window.scrollX) {
      left = window.scrollX;
    }

    // Adjust vertical position if needed
    if (top + dropdownHeight > viewportHeight + window.scrollY) {
      console.log("condition 3")
      top = viewportHeight - dropdownHeight + window.scrollY;
    }
    if (top < window.scrollY) {
      console.log("condition 4")
      top = window.scrollY;
    }

    setPosition({
      top,
      left,
      width,
      direction,
    });
  }, [elementRef, dropdownRef, fullWidth]);

  React.useEffect(() => {
    calculateDropdownPosition();
    const handleScrollOrResize = () => calculateDropdownPosition();
    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open, children, calculateDropdownPosition]);

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      onMouseDown={(e) => e.stopPropagation()}
      ref={dropdownRef}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight,
      }}
      className={cx(
        ' bg-neutral-10 dark:bg-neutral-10-dark shadow-box-2 rounded-lg py-1.5 text-neutral-100 dark:text-neutral-100-dark overflow-y-auto cursor-default',
        {
          'mt-1': position.direction === 'down',
          'mb-1': position.direction === 'up',
          'absolute z-[2200]': open,
          hidden: !open,
        },
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      }}
    >
      {open ? children : null}
    </div>,
    document.body,
  );
};

export default InputDropdown;
