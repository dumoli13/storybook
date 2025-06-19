import React from 'react';
import { createRoot } from 'react-dom/client';
import Icon from '../Icon';
import ModalConfirmContainer from './ModalConfirmContainer';

export interface ConfirmModalProps {
  icon?: React.ReactNode;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  customAction?: Array<React.JSX.Element>;
  size?: 'default' | 'large';
}

const ConfirmModal = ({
  icon = (
    <Icon
      name="alert-triangle"
      size={24}
      strokeWidth={2}
      className="text-neutral-90 dark:text-neutral-90-dark"
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
        onConfirm?.();
        handleClose();
      }}
      confirmText={confirmText}
      cancelText={cancelText}
    >
      {content}
    </ModalConfirmContainer>,
  );
};

export default ConfirmModal;
