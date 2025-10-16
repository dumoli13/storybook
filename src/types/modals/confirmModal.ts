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
