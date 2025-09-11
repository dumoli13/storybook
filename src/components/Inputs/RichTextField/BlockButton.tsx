import { Icon, IconNames } from 'mis-design';
import { useSlate } from 'slate-react';
import { CustomRichElement } from '.';
import ToolbarButton from './ToolbarButton';

const BlockButton: React.FC<{
  format: CustomRichElement['type'];
  icon: IconNames;
}> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <ToolbarButton
      active={isBlockActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon name={icon} size={16} />
    </ToolbarButton>
  );
};

export default BlockButton;
