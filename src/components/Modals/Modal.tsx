import React from 'react';
import ConfirmModal, { ConfirmModalProps } from './ConfirmModal';
import DangerModal from './DangerModal';
import InfoModal from './InfoModal';
import ModalContainer from './ModalContainer';
import PrimaryModal from './PrimaryModal';
import SuccessModal from './SuccessModal';
import WarningModal from './WarningModal';

export interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number; 
  closeOnOverlayClick?: boolean;
  onClose?: () => void;
}

interface ExtendedModal extends React.FC<ModalProps> {
  confirm: (props: ConfirmModalProps) => void;
  success: (props: ConfirmModalProps) => void;
  info: (props: ConfirmModalProps) => void;
  warning: (props: ConfirmModalProps) => void;
  danger: (props: ConfirmModalProps) => void;
  primary: (props: ConfirmModalProps) => void;
}

const Modal: ExtendedModal = (props: ModalProps) => {
  return <ModalContainer {...props} />;
};

Modal.confirm = ConfirmModal;
Modal.success = SuccessModal;
Modal.info = InfoModal;
Modal.warning = WarningModal;
Modal.danger = DangerModal;
Modal.primary = PrimaryModal;

export default Modal;
