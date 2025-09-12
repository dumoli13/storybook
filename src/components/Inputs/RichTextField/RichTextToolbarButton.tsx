import React from 'react';
import cx from 'classnames';

interface RichTextToolbarButtonProps {
  active?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}


const RichTextToolbarButton = ({ active, onMouseDown, children }: RichTextToolbarButtonProps) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    className={cx('shrink-0 h-8 w-8 hover:border border-neutral-40 rounded-md', {
      'bg-neutral-30': active,
      'bg-neutral-10': !active,
    })}
  >
    {children}
  </button>
);

export default RichTextToolbarButton;
