import React from 'react';
import { createRoot } from 'react-dom/client';
import Icon from '../Icon';
import { ConfirmModalProps } from './ConfirmModal';
import ModalConfirmContainer from './ModalConfirmContainer';

const DangerModal = ({
  icon = (
    <Icon
      name="x-mark"
      size={24}
      strokeWidth={3}
      className="text-danger-main dark:text-danger-main-dark"
    />
  ),
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
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
      onClose={() => {
        onCancel?.();
        handleClose();
      }}
      onConfirm={() => {
        handleClose();
        onConfirm?.();
      }}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmButtonColor="danger"
    >
      {content}
    </ModalConfirmContainer>,
  );
};
export default DangerModal;
