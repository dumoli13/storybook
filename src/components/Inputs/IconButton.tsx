import React from 'react';
import cx from 'classnames';
import Tooltip from '../Displays/Tooltip';
import Icon from '../Icon';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'secondary' | 'outlined' | 'text';
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  loading?: boolean;
  icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  size?: 'small' | 'default' | 'large';
  title: string;
  titleVerticalAlign?: 'top' | 'bottom';
  titleHorizontalAlign?: 'left' | 'center' | 'right';
}

/**
 *  Icon buttons are commonly found in app bars and toolbars.
 *
 * Icons are also appropriate for toggle buttons that allow a single choice to be selected or deselected,
 * such as adding or removing a star to an item.
 */
const IconButton = React.forwardRef(
  (
    {
      variant = 'contained',
      color = 'primary',
      className,
      disabled = false,
      loading = false,
      icon,
      size = 'default',
      onClick,
      title,
      titleVerticalAlign = 'bottom',
      titleHorizontalAlign = 'center',
      ...props
    }: IconButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    return (
      <Tooltip
        title={title}
        verticalAlign={titleVerticalAlign}
        horizontalAlign={titleHorizontalAlign}
        disabled={disabled}
      >
        <button
          {...props}
          ref={ref}
          disabled={disabled || loading}
          type="button"
          onClick={onClick}
          aria-label={title}
          className={cx(
            'relative rounded-md font-medium disabled:cursor-not-allowed shrink-0 leading-none aspect-square',
            {
              'w-[44px] h-[44px] text-28px': size === 'large',
              'w-[32px] h-[32px] text-20px': size === 'default',
              'w-[28px] h-[28px] text-16px': size === 'small',
            },
            // Variants
            {
              'focus:ring-3 disabled:ring drop-shadow text-neutral-10 dark:text-neutral-10-dark disabled:ring-neutral-40 dark:disabled:ring-neutral-40-dark disabled:text-neutral-60 dark:disabled:text-neutral-60-dark disabled:bg-neutral-30 dark:disabled:bg-neutral-30-dark':
                variant === 'contained',
              'bg-primary-main dark:bg-primary-main-dark hover:bg-primary-hover dark:hover:bg-primary-hover-dark active:bg-primary-pressed dark:active:bg-primary-pressed-dark focus:bg-primary-hover dark:focus:bg-primary-hover-dark focus:ring-primary-focus dark:focus:ring-primary-focus-dark':
                color === 'primary' && variant === 'contained',
              'bg-success-main dark:bg-success-main-dark hover:bg-success-hover dark:hover:bg-success-hover-dark active:bg-success-pressed dark:active:bg-success-pressed-dark focus:bg-success-hover dark:focus:bg-success-hover-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
                color === 'success' && variant === 'contained',
              'bg-danger-main dark:bg-danger-main-dark hover:bg-danger-hover dark:hover:bg-danger-hover-dark active:bg-danger-pressed dark:active:bg-danger-pressed-dark focus:bg-danger-hover dark:focus:bg-danger-hover-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
                color === 'danger' && variant === 'contained',
              'bg-warning-main dark:bg-warning-main-dark hover:bg-warning-hover dark:hover:bg-warning-hover-dark active:bg-warning-pressed dark:active:bg-warning-pressed-dark focus:bg-warning-hover dark:focus:bg-warning-hover-dark focus:ring-warning-focus dark:focus:ring-warning-focus-dark':
                color === 'warning' && variant === 'contained',
              'bg-info-main dark:bg-info-main-dark hover:bg-info-hover dark:hover:bg-info-hover-dark active:bg-info-pressed dark:active:bg-info-pressed-dark focus:bg-info-hover dark:focus:bg-info-hover-dark focus:ring-info-surface':
                color === 'info' && variant === 'contained',
              // Secondary
              'focus:ring-3 drop-shadow disabled:ring disabled:ring-neutral-40 dark:disabled:ring-neutral-40-dark disabled:text-neutral-60 dark:disabled:text-neutral-60-dark disabled:bg-neutral-30 dark:disabled:bg-neutral-30-dark':
                variant === 'secondary',
              'text-primary-main dark:text-primary-main-dark bg-primary-surface dark:bg-primary-surface-dark hover:text-primary-hover dark:hover:text-primary-hover-dark active:text-primary-pressed dark:active:text-primary-pressed-dark focus:ring-primary-focus dark:focus:ring-primary-focus-dark':
                color === 'primary' && variant === 'secondary',
              'text-success-main dark:text-success-main-dark bg-success-surface dark:bg-success-surface-dark hover:text-success-hover  dark:hover:text-success-hover-dark active:text-success-pressed dark:active:text-success-pressed-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
                color === 'success' && variant === 'secondary',
              'text-danger-main dark:text-danger-main-dark bg-danger-surface dark:bg-danger-surface-dark hover:text-danger-hover dark:hover:text-danger-hover-dark active:text-danger-pressed dark:active:text-danger-pressed-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
                color === 'danger' && variant === 'secondary',
              'text-warning-main dark:text-warning-main-dark bg-warning-surface dark:bg-warning-surface-dark hover:text-warning-hover dark:hover:text-warning-hover-dark active:text-warning-pressed dark:active:text-warning-pressed-dark focus:ring-warning-focus dark:focus:ring-warning-focus-dark':
                color === 'warning' && variant === 'secondary',
              'text-info-main dark:text-info-main-dark bg-info-surface dark:bg-info-surface-dark hover:text-info-hover dark:hover:text-info-hover-dark active:text-info-pressed dark:active:text-info-pressed-dark focus:ring-info-surface':
                color === 'info' && variant === 'secondary',
              // Outlined
              'focus:ring-3 ring drop-shadow text-neutral-100 dark:text-neutral-100-dark bg-neutral-10 dark:bg-neutral-10-dark hover:bg-neutral-20 dark:hover:bg-neutral-20-dark active:bg-neutral-30 dark:active:bg-neutral-30-dark ring-neutral-40 dark:ring-neutral-40-dark disabled:text-neutral-60 dark:disabled:text-neutral-60-dark disabled:bg-neutral-30 dark:disabled:bg-neutral-30-dark':
                variant === 'outlined',
              'focus:ring-primary-focus dark:focus:ring-primary-focus-dark':
                color === 'primary' && variant === 'outlined',
              'focus:ring-success-focus dark:focus:ring-success-focus-dark':
                color === 'success' && variant === 'outlined',
              'focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
                color === 'danger' && variant === 'outlined',
              'focus:ring-warning-focus dark:focus:ring-warning-focus-dark':
                color === 'warning' && variant === 'outlined',
              'focus:ring-info-focus dark:focus:ring-info-focus-dark':
                color === 'info' && variant === 'outlined',
              // Text
              'focus:ring-3 disabled:text-neutral-60 dark:disabled:text-neutral-60-dark':
                variant === 'text',
              'text-primary-main dark:text-primary-main-dark hover:text-primary-hover dark:hover:text-primary-hover-dark active:text-primary-pressed dark:active:text-primary-pressed-dark focus:ring-primary-focus dark:focus:ring-primary-focus-dark':
                color === 'primary' && variant === 'text',
              'text-success-main dark:text-success-main-dark hover:text-success-hover dark:hover:text-success-hover-dark active:text-success-pressed dark:active:text-success-pressed-dark focus:ring-success-focus dark:focus:ring-success-focus-dark':
                color === 'success' && variant === 'text',
              'text-danger-main dark:text-danger-main-dark hover:text-danger-hover dark:hover:text-danger-hover-dark active:text-danger-pressed dark:active:text-danger-pressed-dark focus:ring-danger-focus dark:focus:ring-danger-focus-dark':
                color === 'danger' && variant === 'text',
              'text-warning-main dark:text-warning-main-dark hover:text-warning-hover dark:hover:text-warning-hover-dark active:text-warning-pressed dark:active:text-warning-pressed-dark focus:ring-warning-focus dark:focus:ring-warning-focus-dark':
                color === 'warning' && variant === 'text',
              'text-info-main dark:text-info-main-dark hover:text-info-hover dark:hover:text-info-hover-dark active:text-info-pressed dark:active:text-info-pressed-dark focus:ring-info-focus dark:focus:ring-info-focus-dark':
                color === 'info' && variant === 'text',
            },
            className,
          )}
        >
          <span
            className={cx('flex justify-center items-center gap-1.5', {
              invisible: loading,
            })}
          >
            {icon}
          </span>
          {loading && (
            <span
              className={cx(
                'absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center',
                {
                  'text-16px': size !== 'large',
                  'text-20px': size === 'large',
                },
              )}
            >
              <Icon name="loader" animation="spin" strokeWidth={2} />
            </span>
          )}
        </button>
      </Tooltip>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
