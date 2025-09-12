import React from 'react';
import cx from 'classnames';
import Button from '../Inputs/Button';

export interface ModalProps {
  open: boolean;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  width?: number;

  closeOnOverlayClick?: boolean;
  onClose?: () => void;
  cancelText?: string;
  cancelButtonColor?: 'primary' | 'success' | 'danger' | 'warning' | 'info';

  onConfirm?: () => Promise<void> | void;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  confirmText?: string;
  confirmButtonColor?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  customAction?: Array<React.JSX.Element>;
  size?: 'default' | 'large';
}

/**
 * ModalConfirmContainer Component
 *
 * A flexible and customizable modal container that can display various content inside a modal with customizable buttons for
 * confirm and cancel actions. It supports closing the modal when clicking on the overlay and handling keyboard interactions.
 *
 * This modal includes focus management, trapping focus inside the modal when it's open, and providing options to customize
 * the modal's width, title, icon, and button actions.
 *
 * @property {boolean} open - A boolean value to determine if the modal should be displayed.
 * @property {ReactNode} [title] - Optional title of the modal.
 * @property {ReactNode} children - Content to be displayed inside the modal.
 * @property {ReactNode} [icon] - Optional icon to be displayed next to the title.
 * @property {string} [className] - Optional additional CSS classes for custom styling.
 * @property {number} [width=804] - Optional custom width for the input field (in px).
 * @property {boolean} [closeOnOverlayClick=false] - Determines whether the modal should close when clicking on the overlay (background).
 * @property {Function} [onClose] - Optional callback function triggered when the notification is closed manually.
 * @property {string} [cancelText='Cancel'] - The text to display on the cancel button (default is "Cancel").
 * @property {ButtonColor} [cancelButtonColor='primary'] - The color for the cancel button.
 * @property {Function} [onConfirm] - An optional callback function that is called when the confirm button is clicked.
 * @property {boolean} [confirmLoading=false] - Determines whether the confirm button should show a loading spinner.
 * @property {boolean} [confirmDisabled=false] - Determines whether the confirm button should be disabled.
 * @property {string} [confirmText='Confirm'] - The text to be displayed on the confirm button (default is "Confirm").
 * @property {ButtonColor} [confirmButtonColor='primary'] - The color for the confirm button.
 *
 */

const ModalConfirmContainer = ({
  open,
  title,
  children,
  icon,
  className,
  width = 600,
  closeOnOverlayClick = false,
  onClose,
  cancelText = 'Cancel',
  cancelButtonColor = 'primary',

  onConfirm,
  confirmLoading = false,
  confirmDisabled = false,
  confirmText = 'Confirm',
  confirmButtonColor = 'primary',
  customAction,
  size = 'default',
}: ModalProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    } else if (e.key === 'Enter' && onConfirm) {
      onConfirm();
    } else if (e.key === 'Tab' && open) {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer?.focus();
  }, []);

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

  if (!open) return null;

  return (
    <div
      role="none"
      id="modal-container"
      className="flex items-center justify-center z-[1300] inset-0 fixed"
      onKeyDown={handleKeyDown}
    >
      {closeOnOverlayClick ? (
        <div
          role="button"
          aria-label="Close Modal"
          onClick={onClose}
          className="fixed top-0 left-0 bottom-0 right-0 bg-[#00000080]"
        />
      ) : (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#00000080]" />
      )}
      <div
        className={cx(
          'border border-neutral-40 dark:border-neutral-50-dark rounded-md drop-shadow-sm bg-neutral-10 dark:bg-neutral-10-dark m-8 flex flex-col max-h-[90vh] ',
          className,
        )}
        style={{ width }}
        tabIndex={-1}
        onSubmit={onConfirm}
      >
        {(title || icon) && (
          <div className="pt-6 pb-2 px-6 flex items-center gap-4">
            {icon}
            <div className="text-20px font-semibold text-neutral-100 dark:text-neutral-100-dark w-full break-words">
              {title}
            </div>
          </div>
        )}
        <div
          className={cx(
            'pb-4 px-6 h-full text-neutral-80 dark:text-neutral-90-dark text-14px flex-1 overflow-auto',
            { 'ml-10': !!icon },
          )}
        >
          {children}
        </div>
        <div className="px-6 py-3 bg-neutral-20 dark:bg-neutral-30-dark flex justify-end items-center gap-3 rounded-b-md">
          {onClose && (
            <Button
              variant="outlined"
              onClick={onClose}
              color={cancelButtonColor}
              size={size}
            >
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              type="button"
              variant="contained"
              onClick={onConfirm}
              color={confirmButtonColor}
              loading={confirmLoading}
              disabled={confirmDisabled}
              size={size}
            >
              {confirmText}
            </Button>
          )}
          {customAction?.map((action) => action)}
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmContainer;
