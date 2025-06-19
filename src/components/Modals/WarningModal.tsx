import React from 'react';
import { createRoot } from 'react-dom/client';
import Icon from '../Icon';
import { ConfirmModalProps } from './ConfirmModal';
import ModalConfirmContainer from './ModalConfirmContainer';

const WarningModal = ({
  icon = (
    <Icon
      name="alert-circle"
      size={24}
      strokeWidth={3}
      className="text-warning-main dark:text-warning-main-dark"
    />
  ),
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  ...props
}: ConfirmModalProps) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  document.body.appendChild(container);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(
    <ModalConfirmContainer
      {...props}
      open
      icon={icon}
      onClose={handleClose}
      onConfirm={() => {
        onConfirm?.();
        handleClose();
      }}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmButtonColor="warning"
    >
      {content}
    </ModalConfirmContainer>,
  );
};

export default WarningModal;
