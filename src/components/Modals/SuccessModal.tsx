import React from 'react';
import { createRoot } from 'react-dom/client';
import Icon from '../Icon';
import { ConfirmModalProps } from './ConfirmModal';
import ModalConfirmContainer from './ModalConfirmContainer';

const SuccessModal = ({
  icon = (
    <Icon
      name="check"
      size={24}
      strokeWidth={3}
      className="text-success-main dark:text-success-main-dark"
    />
  ),
  content,
  confirmText = 'OK',
  onConfirm,
  customAction,
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
      onConfirm={() => {
        onConfirm?.();
        handleClose();
      }}
      confirmText={confirmText}
      confirmButtonColor="success"
      customAction={customAction}
    >
      {content}
    </ModalConfirmContainer>,
  );
};

export default SuccessModal;
