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
  const modalRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    if (open && modalRef.current) {
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open, modalRef.current]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      id="modal-container"
      className="flex items-center justify-center z-[1300] inset-0 fixed"
      onKeyDown={handleKeyDown}
      ref={modalRef}
      aria-modal="true"
      tabIndex={-1}
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
