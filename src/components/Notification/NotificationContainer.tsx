import React from 'react';
import cx from 'classnames';
import Icon from '../Icon';

export interface NotificationContainerProps {
  title: string;
  description: string | number;
  icon?: React.ReactNode;
  open: boolean;
  color: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  onClose?: () => void;
  duration?: number;
}

/**
 *
 * A component that displays an individual notification with a title, description, icon, and a progress bar indicating the remaining time.
 * The notification automatically closes after a specified duration (default is 5 seconds), but the user can also manually close it.
 * The progress bar visually decreases over time, and it pauses when the user hovers over the notification.
 * It supports different colors to indicate various types of notifications (e.g., success, danger, warning).
 *
 * @property {string} title - The title of the notification.
 * @property {string | number} description - The description or content of the notification. Can be a string or a number.
 * @property {React.ReactNode} [icon] - Optional custom icon to display alongside the notification. Defaults to predefined icons based on the color.
 * @property {boolean} open - A boolean to control whether the notification is visible. If `true`, the notification is shown.
 * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} color - The color of the notification, which influences the icon and progress bar color. Possible values are:
 *    - 'primary': Default color, blue progress bar and icon.
 *    - 'success': Green progress bar and icon.
 *    - 'danger': Red progress bar and icon.
 *    - 'warning': Yellow progress bar and icon.
 *    - 'info': Light blue progress bar and icon.
 * @property {Function} [onClose] - Optional callback function triggered when the notification is closed manually.
 *
 */
const NotificationContainer = ({
  open,
  title,
  description,
  icon,
  color = 'primary',
  duration = 5000,
  onClose,
}: NotificationContainerProps) => {
  const [visible, setVisible] = React.useState(open);
  const [progressWidth, setProgressWidth] = React.useState(100);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const decrementInterval = 10;
  const decrementRate = 100 / (duration / decrementInterval);

  React.useEffect(() => {
    setVisible(open);

    if (open) {
      setProgressWidth(100);
      startProgress();

      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(timerRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, [open]);

  const startProgress = () => {
    intervalRef.current = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return Math.max(prev - decrementRate, 0);
      });
    }, decrementInterval);
  };

  const handleMouseEnter = () => {
    clearInterval(intervalRef.current!);
    clearTimeout(timerRef.current!);
  };

  const handleMouseLeave = () => {
    startProgress();
    timerRef.current = setTimeout(
      () => {
        handleClose();
      },
      duration * (progressWidth / 100),
    );
  };

  const handleClose = () => {
    if (visible) {
      setVisible(false);
      onClose?.();
    }
  };

  if (!visible) return null;

  return (
    <div
      role="none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative px-6 py-5 bg-neutral-10 dark:bg-neutral-10-dark text-neutral-90 dark:text-neutral-90-dark flex gap-4 rounded-md shadow-box-notification max-w-[448px] overflow-hidden">
        <div className="shrink-0">{icon}</div>
        <div>
          <div className="text-24px mb-2 break-words">{title}</div>
          <p className="text-20px break-words">{description}</p>
        </div>
        <div className="absolute right-4 top-4">
          <Icon
            name="x-mark"
            size={16}
            strokeWidth={2}
            className="p-1 shrink-0 rounded-full hover:bg-neutral-30 dark:hover:bg-neutral-30-dark text-neutral-70 dark:text-neutral-70-dark transition-color"
            onClick={handleClose}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-30 dark:bg-neutral-30-dark">
          <div
            className={cx('h-full transition-all ease-linear bg-primary-main', {
              'bg-primary-main dark:bg-primary-main-dark': color === 'primary',
              'bg-success-main dark:bg-success-main-dark': color === 'success',
              'bg-danger-main dark:bg-danger-main-dark': color === 'danger',
              'bg-warning-main dark:bg-warning-main-dark': color === 'warning',
              'bg-info-main dark:bg-info-main-dark': color === 'info',
            })}
            style={{
              width: `${progressWidth}%`,
              transitionDuration: '0s',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationContainer;
