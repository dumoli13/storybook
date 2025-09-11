import { Icon, IconNames } from 'mis-design';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { CustomRichText } from '.';
import ToolbarButton from './ToolbarButton';

const MarkButton: React.FC<{
  format: keyof CustomRichText;
  icon: IconNames;
}> = ({ format, icon }) => {
  const editor = useSlate();

  const isMarkActive = (editor: Editor, format: keyof CustomRichText) => {
    const marks = Editor.marks(editor) as Record<string, boolean> | null;
    return marks?.[format] === true;
  };

  const toggleMark = (editor: Editor, format: keyof CustomRichText) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);
  };

  return (
    <ToolbarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon name={icon} size={16} />
    </ToolbarButton>
  );
};

export default MarkButton;
