import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { CustomText } from '.';
import RichTextToolbarButton from './RichTextToolbarButton';
import Icon, { IconNames } from '../../Icon';

interface RichTextStyleButtonProps {
  format: keyof CustomText;
  icon: IconNames;
  disabled?: boolean;
}

const RichTextStyleButton = ({
  format,
  icon,
  disabled = false,
}: RichTextStyleButtonProps) => {
  const editor = useSlate();
  const isMarkActive = Editor.marks(editor)?.[format] === true;

  const toggleMark = () => {
    if (isMarkActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);
  };

  return (
    <RichTextToolbarButton
      active={isMarkActive}
      onClick={toggleMark}
      disabled={disabled}
      aria-pressed={isMarkActive}
      title={icon}
    >
      <Icon name={icon} size={20} />
    </RichTextToolbarButton>
  );
};

export default RichTextStyleButton;
