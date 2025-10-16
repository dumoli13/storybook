import React from 'react';
import { createRoot } from 'react-dom/client';
import Icon from '../Icon';
import ModalConfirmContainer from './ModalConfirmContainer';
import { ConfirmModalProps } from '../../types';

const InfoModal = ({
  icon = (
    <Icon
      name="alert-circle"
      size={24}
      strokeWidth={3}
      className="text-info-main dark:text-info-main-dark"
    />
  ),
  title,
  content,
  confirmText = 'OK',
  onConfirm,
  customAction,
}: ConfirmModalProps) => {
  const container = document.createElement('div');
  const root = createRoot(container); // Use `!` if you're using TypeScript and are sure `root` exists.
  document.body.appendChild(container);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(
    <ModalConfirmContainer
      open
      title={title}
      icon={icon}
      onConfirm={() => {
        onConfirm?.();
        handleClose();
      }}
      confirmText={confirmText}
      confirmButtonColor="info"
      customAction={customAction}
    >
      {content}
    </ModalConfirmContainer>,
  );
};

export default InfoModal;
