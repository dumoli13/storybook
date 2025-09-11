import cx from 'classnames';

const ToolbarButton: React.FC<{
  active?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ active, onMouseDown, children }) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    className={cx('h-8 w-8 hover:ring ring-neutral-40 rounded-md', {
      'bg-neutral-40 text-black': active,
      'bg-neutral-10 text-black': !active,
    })}
  >
    {children}
  </button>
);

export default ToolbarButton;
