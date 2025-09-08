import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

export interface InputDropdownProps {
  open: boolean;
  children: React.ReactNode;
  elementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement>;
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
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRect.height;

    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;

    let top: number;
    let direction: 'up' | 'down';

    if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
      top = anchorRect.height;
      direction = 'down';
    } else {
      top = anchorRect.top - dropdownHeight;
      direction = 'up';
    }

    setPosition({
      top,
      left: anchorRect.left,
      width: fullWidth ? anchorRect.width : undefined,
      direction,
    });
  }, [elementRef, dropdownRef, fullWidth]);

  const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
    let parent = element.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflow === 'auto' ||
        style.overflow === 'scroll' ||
        style.overflowX === 'auto' ||
        style.overflowX === 'scroll' ||
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll'
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  React.useEffect(() => {
    if (!elementRef.current || !open) return;

    // Find the scroll container of the elementRef
    const scrollContainer = findScrollContainer(elementRef.current);

    const handleScroll = () => calculateDropdownPosition();

    // Listen to scroll events on the container (if found) or window
    const scrollTarget = scrollContainer || window;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen for resize and element changes
    const resizeObserver = new ResizeObserver(calculateDropdownPosition);
    const mutationObserver = new MutationObserver(calculateDropdownPosition);

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
      mutationObserver.observe(elementRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false,
      });
    }

    // Observe the scroll container too if it exists
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    // Initial calculation
    calculateDropdownPosition();

    // Cleanup
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [elementRef, open, calculateDropdownPosition]);

  React.useEffect(() => {
    if (open) {
      calculateDropdownPosition();
    }
  }, [open, children, calculateDropdownPosition]);

  return (
    <div
      role="listbox"
      ref={dropdownRef}
      style={{
        transform: `translate(${0}px, ${position.top}px)`,
        width: position.width,
        maxHeight,
      }}
      className={cx(
        'top-0 left-0 absolute bg-neutral-10 dark:bg-neutral-10-dark shadow-box-2 rounded-lg py-1.5 text-neutral-100 dark:text-neutral-100-dark overflow-y-auto cursor-default border border-neutral-30 dark:border-neutral-30-dark',
        {
          'mt-1': position.direction === 'down',
          'mb-1': position.direction === 'up',
          'block z-[10]': open,
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
    </div>
  );
};

export default InputDropdown;
