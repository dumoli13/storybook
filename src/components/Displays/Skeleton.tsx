/* eslint-disable react/no-array-index-key */
import React from 'react';
import cx from 'classnames';

export interface SkeletonProps {
  width?: number;
  height?: number;
  type?: 'circle' | 'rounded' | 'rect';
}

export interface SkeletonInputProps {
  size?: 'default' | 'large';
}

export interface SkeletonTableProps {
  column?: number;
  row?: number;
  size?: 'small' | 'default' | 'large';
}

/**
 *
 * A predefined skeleton loader for input fields, designed to simulate loading states for forms or inputs.
 * It consists of a title placeholder and a large input field placeholder.
 *
 */
const Skeleton = ({ width, height, type = 'circle' }: SkeletonProps) => {
  return (
    <div
      className={cx('bg-neutral-40  dark:bg-neutral-40-dark animate-pulse', {
        'rounded-full': type === 'circle',
        'rounded-md': type === 'rounded',
        'shrink-0': !!height || !!width,
      })}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    />
  );
};
const SkeletonInput: React.FC<SkeletonInputProps> = ({ size = 'default' }) => (
  <div>
    <div className="w-1/5 h-5 mb-1 bg-neutral-40 dark:bg-neutral-40-dark rounded-full animate-pulse" />
    <div
      className={cx(
        'w-full bg-neutral-40 dark:bg-neutral-40-dark rounded-full animate-pulse',
        {
          'h-[42px]': size === 'default',
          'h-[54px]': size === 'large',
        },
      )}
    />
  </div>
);
SkeletonInput.displayName = 'SkeletonInput';
Skeleton.Input = SkeletonInput;

const SkeletonTable = ({
  column = 2,
  row = 3,
  size = 'default',
}: SkeletonTableProps) => {
  return (
    <div className="overflow-y-auto border border-neutral-30 dark:border-neutral-30-dark rounded-md">
      <table className="w-full">
        <thead>
          <tr>
            {new Array(column < 1 ? 1 : column).fill(0).map((_col, key) => (
              <th
                key={key}
                className="text-left bg-neutral-20 dark:bg-neutral-20-dark px-4 py-3 border-r border-neutral-30 dark:border-neutral-30-dark last:border-none"
                scope="col"
                aria-label={`Column ${key + 1}`}
              >
                <div className="flex gap-4 items-center justify-between">
                  <div className="w-full flex items-center gap-2.5">
                    <div className="bg-neutral-40 dark:bg-neutral-40-dark rounded-full animate-pulse w-1/3 h-5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-neutral-30 dark:border-neutral-30-dark" />
                      <span className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-neutral-30 dark:border-neutral-30-dark" />
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {new Array(row < 1 ? 1 : row).fill(0).map((_row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-neutral-30 dark:border-neutral-30-dark last:border-none"
            >
              {new Array(column).fill(0).map((_col, colIndex) => (
                <td
                  key={colIndex}
                  aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                >
                  <div
                    className={cx('flex items-center justify-start px-4 py-2', {
                      'h-[36px]': size === 'small',
                      'h-[56px]': size === 'default',
                      'h-[62px]': size === 'large',
                    })}
                  >
                    <div className="bg-neutral-40 dark:bg-neutral-40-dark rounded-full animate-pulse w-4/5 h-5" />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
SkeletonTable.displayName = 'SkeletonTable';
Skeleton.Table = SkeletonTable;

export default Skeleton;
