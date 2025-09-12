import React from 'react';
import cx from 'classnames';
import { createPortal } from 'react-dom';

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

/**
 * Tooltips display informative text when users hover over an element
 */
const Tooltip = ({
  children,
  verticalAlign = 'bottom',
  horizontalAlign = 'center',
  arrow = true,
  mouseEnterDelay = 500,
  mouseLeaveDelay = 0,
  title,
  disabled = false,
}: TooltipProps) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [dropdownStyles, setDropdownStyles] = React.useState<{
    top: number;
    left: number;
    width: number | undefined;
    opacity: number;
  } | null>(null);
  const enterTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const calculateDropdownPosition = React.useCallback(() => {
    if (elementRef.current && dropdownRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;

      // Vertical alignment
      if (verticalAlign === 'top') {
        top = rect.top + window.scrollY - dropdownRect.height - 12;
        if (top < 0) top = rect.bottom + window.scrollY;
      } else if (verticalAlign === 'bottom') {
        top = rect.bottom + window.scrollY;
        if (top + dropdownRect.height > viewportHeight)
          top = rect.top + window.scrollY - dropdownRect.height;
      } else if (verticalAlign === 'center') {
        top =
          rect.top + window.scrollY + rect.height / 2 - dropdownRect.height / 2;
      }

      // Horizontal alignment
      if (horizontalAlign === 'left') {
        left = rect.left + window.scrollX - 4;
        if (left + dropdownRect.width > viewportWidth)
          left = rect.right + window.scrollX - dropdownRect.width;
      } else if (horizontalAlign === 'right') {
        left = rect.right + window.scrollX - dropdownRect.width + 4;
        if (left < 0) left = rect.left + window.scrollX;
      } else if (horizontalAlign === 'center') {
        left =
          rect.left + window.scrollX + rect.width / 2 - dropdownRect.width / 2;
      }

      setDropdownStyles({
        top,
        left,
        width: rect.width,
        opacity: 1, // Make visible only after position calculation
      });
    }
  }, [verticalAlign, horizontalAlign]);

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
      setDropdownStyles(null);
    }
  }, [open, calculateDropdownPosition]);

  const handleMouseEnter = () => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => setOpen(true), mouseEnterDelay);
  };

  const handleMouseLeave = () => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => setOpen(false), mouseLeaveDelay);
  };

  return (
    <div className="relative">
      {/* Wrap children to ensure hover works on disabled buttons */}
      <div
        ref={elementRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={-1}
        className={cx({
          'cursor-not-allowed': disabled,
        })}
      >
        {disabled ? (
          <span className="pointer-events-none">{children}</span>
        ) : (
          children
        )}
      </div>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              top: dropdownStyles?.top ?? 0,
              left: dropdownStyles?.left ?? 0,
              opacity: dropdownStyles?.opacity ?? 0,
              transformOrigin: 'center center',
              transition: 'opacity 0.15s ease-out',
            }}
            className="absolute z-[2100] bg-neutral-90 dark:bg-neutral-90-dark text-neutral-10 dark:text-neutral-10-dark rounded-sm px-2 py-1.5 mt-1 text-14px"
          >
            {arrow && (
              <div
                className="absolute bg-neutral-90 dark:bg-neutral-90-dark w-2 h-2 transform rotate-45"
                style={{
                  top:
                    verticalAlign === 'top'
                      ? '100%'
                      : verticalAlign === 'bottom'
                        ? '-0.375rem'
                        : '50%',
                  left:
                    horizontalAlign === 'left'
                      ? '0.75rem'
                      : horizontalAlign === 'right'
                        ? 'calc(100% - 0.75rem)'
                        : '50%',
                  transform:
                    verticalAlign === 'top'
                      ? 'translate(-50%, -50%) rotate(45deg)'
                      : verticalAlign === 'bottom'
                        ? 'translate(-50%, 50%) rotate(45deg)'
                        : 'rotate(45deg)',
                }}
              />
            )}
            {title}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
