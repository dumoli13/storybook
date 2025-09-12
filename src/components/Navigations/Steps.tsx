/* eslint-disable react/no-array-index-key */
import React from 'react';
import cx from 'classnames';
import { useMisDesignContext } from '../../context';
import { COLORS } from '../../libs';
import Icon from '../Icon';

export interface StepProps {
  active: number;
  items: Array<{
    title: string;
    description?: string;
    error?: boolean;
    success?: boolean;
    available?: boolean;
    progress?: number;
  }>;
  onChange?: (index: number) => void;
  disabled?: boolean;
}

/**
 * A component that renders a multi-step progress tracker. Each step can represent a process or a task.
 * The component displays the title and description for each step, along with visual indicators for success, error,
 * or default state. It also provides interactivity for navigation between steps, with the ability to disable
 * navigation and indicate whether a step is available or not.
 */
function Steps({
  active,
  items,
  onChange,
  disabled = false,
}: Readonly<StepProps>) {
  const handleChangePage = (index: number) => {
    if (!disabled) {
      onChange?.(index);
    }
  };

  const { theme } = useMisDesignContext();
  const circumference = 2 * Math.PI * 48;

  return (
    <div className="flex items-start justify-between gap-4 w-full">
      {items.map((item, index) => {
        const { description, title, available, error, success, progress } =
          item;

        if (active === index) {
          return (
            <div
              key={index}
              className={cx('flex gap-2 relative flex-1', {
                'items-start': !!description,
                'items-center': !description,
              })}
            >
              {progress != null ? (
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                  >
                    {/* Gray track (full circle) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke={COLORS[theme].neutral[40]}
                      strokeWidth="5"
                    />
                    {/* Blue progress (partial circle) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke={COLORS[theme].primary.main}
                      strokeWidth="5"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={`${circumference * (1 - Math.min(progress, 100) / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Your existing circle */}
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-16px leading-none bg-primary-main dark:bg-primary-main-dark text-neutral-10 dark:text-neutral-10-dark">
                    {index + 1}
                  </div>
                </div>
              ) : (
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-16px leading-none bg-primary-main dark:bg-primary-main-dark text-neutral-10 dark:text-neutral-10-dark">
                  {index + 1}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h4 className="text-neutral-90 dark:text-neutral-90-dark">
                    {title}
                  </h4>
                  {index < items.length - 1 && (
                    <div className="h-1 w-full flex-1 border-t border-neutral-40 dark:border-neutral-40-dark" />
                  )}
                </div>
                <p className="text-neutral-90 dark:text-neutral-90-dark text-14px">
                  {description}
                </p>
              </div>
            </div>
          );
        } else if (error || success) {
          return (
            <div
              key={index}
              className={cx(
                `flex gap-2 relative flex-1 rounded-2xl ${!disabled && available ? 'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark cursor-pointer' : 'cursor-default'}`,
                {
                  'items-start': !!description,
                  'items-center': !description,
                },
              )}
              role="button"
              onClick={() => {
                if (available) handleChangePage?.(index);
              }}
            >
              {success ? (
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-16px leading-none border text-primary-main dark:text-primary-main-dark border-primary-main dark:border-primary-main-dark">
                  <Icon name="check" size={16} />
                </div>
              ) : (
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-16px leading-none border text-danger-main dark:text-danger-main-dark border-danger-main dark:border-danger-main-dark">
                  <Icon name="x-mark" size={16} />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h4 className="text-primary-main dark:text-primary-main-dark">
                    {title}
                  </h4>
                  {index < items.length - 1 && (
                    <div className="h-1 w-full flex-1 border-t border-neutral-40 dark:border-neutral-40-dark" />
                  )}
                </div>
                <p
                  className={cx('text-14px', {
                    'text-primary-main dark:text-primary-main-dark': error,
                    'text-neutral-50 dark:text-neutral-50-dark': success,
                  })}
                >
                  {description}
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className={cx(
                `flex gap-2 relative flex-1 rounded-2xl ${!disabled && available ? 'hover:bg-neutral-20 dark:hover:bg-neutral-20-dark cursor-pointer' : 'cursor-default'}`,
                {
                  'items-start': !!description,
                  'items-center': !description,
                },
              )}
              role="button"
              onClick={() => {
                if (available) handleChangePage?.(index);
              }}
            >
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-16px leading-none  border text-neutral-50 dark:text-neutral-50-dark border-neutral-50 dark:border-neutral-50-dark">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h4 className="text-neutral-50 dark:text-neutral-50-dark">
                    {title}
                  </h4>
                  {index < items.length - 1 && (
                    <div className="h-1 w-full flex-1 border-t border-neutral-40 dark:border-neutral-40-dark" />
                  )}
                </div>
                <p className="text-14px text-neutral-50 dark:text-neutral-50-dark">
                  {description}
                </p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Steps;
