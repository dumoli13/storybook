import React, { useMemo } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { RichTextProps } from '.';
import RichTextToolbarButton from './RichTextToolbarButton';
import Icon, { IconNames } from '../../Icon';

interface RichTextMarkButtonProps {
  format: keyof RichTextProps;
  icon: IconNames;
}

const MarkButton = ({ format, icon }: RichTextMarkButtonProps) => {
  const editor = useSlate();
  const isMarkActive = Editor.marks(editor)?.[format] === true;

  const toggleMark = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isMarkActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);
  };

  return (
    <RichTextToolbarButton
      active={isMarkActive}
      onMouseDown={toggleMark}
    >
      <Icon name={icon} size={20} />
    </RichTextToolbarButton>
  );
};

export default MarkButton;
