import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';

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
    disableEscapeKeyDown = false
}: DrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    // Handle escape key press
    useEffect(() => {
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
    useEffect(() => {
        if (open) {
            previouslyFocusedElement.current = document.activeElement as HTMLElement;
            drawerRef.current?.focus();
        } else {
            previouslyFocusedElement.current?.focus?.();
        }
    }, [open]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const drawerStyle = {
        width: position === 'left' || position === 'right' ? width : '100%',
        height: position === 'top' || position === 'bottom' ? height : '100%',
    };

    return createPortal(
        <div className=" fixed inset-0 z-[1300] bg-[#00000080]">
            {/* Backdrop */}
            <div
                className={cx(
                    'fixed inset-0 bg-black/50 transition-opacity',
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                aria-hidden="true"
                onClick={disableBackdropClick ? undefined : onClose}
            />

            {/* Drawer content */}
            <div
                ref={drawerRef}
                className={cx(
                    'bg-neutral-15 dark:bg-neutral-15-dark fixed bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out',
                    'focus:outline-none', // for accessibility
                    {
                        'left-0 top-0': position === 'left',
                        'right-0 top-0': position === 'right',
                        'top-0 left-0 right-0': position === 'top',
                        'bottom-0 left-0 right-0': position === 'bottom',
                    },
                    className
                )}
                style={drawerStyle}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Drawer;