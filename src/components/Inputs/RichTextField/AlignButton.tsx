import React from 'react';
import Icon, { IconNames } from '../../Icon';
import RichTextToolbarButton from './RichTextToolbarButton';
import { useSlate } from 'slate-react';
import { Editor, Element, Transforms } from 'slate';
import { CustomElement } from '.';

interface AlignButtonProps {
  align: 'left' | 'center' | 'right' | 'justify';
  icon: IconNames;
  disabled?: boolean;
}

const AlignButton = ({ align, icon, disabled }: AlignButtonProps) => {
  const editor = useSlate();
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && 'type' in n,
    }),
  );
  const isMarkActive = (match?.[0].align || 'left') === align;

  const toggleAlign = () => {
    Transforms.setNodes(editor, { align } as CustomElement, {
      match: (n) => Element.isElement(n),
    });
  };

  return (
    <RichTextToolbarButton
      active={isMarkActive}
      onClick={toggleAlign}
      disabled={disabled || isMarkActive}
    >
      <Icon name={icon} size={20} />
    </RichTextToolbarButton>
  );
};

export default AlignButton;
