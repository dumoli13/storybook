import React from 'react';
import { useSlate } from 'slate-react';
import RichTextToolbarButton from './RichTextToolbarButton';
import Icon, { IconNames } from '../../Icon';
import { Editor, Element, Transforms } from 'slate';
import { isListType, isTextTag } from '../../../libs/richTextField';
import { LIST_TYPES } from '../../../types/richTextField';
import { CustomElement } from '.';

interface RichTextListButtonProps {
  format: LIST_TYPES;
  icon: IconNames;
  disabled?: boolean;
}

const RichTextListButton = ({
  format,
  icon,
  disabled,
}: RichTextListButtonProps) => {
  const editor = useSlate();

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === format,
      mode: 'lowest',
    }),
  );

  const handleToggleBlock = () => {
    const [parentList] = Array.from(
      Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === format,
      }),
    );

    if (parentList) {
      const matchListItem = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === 'list-item',
        }),
      );
      for (const [node, path] of matchListItem) {
        const li = node as any;
        const newType = li.heading ?? 'paragraph';

        Transforms.setNodes(
          editor,
          { type: newType, heading: undefined },
          { at: path },
        );
      }

      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && isListType(n.type),
        split: true,
      });

      const matches = Array.from(
        Editor.nodes(editor, {
          at: [],
          match: (n) =>
            Element.isElement(n) &&
            isListType(n.type) &&
            Editor.isEmpty(editor, n),
        }),
      );

      for (const [node, path] of matches) {
        Transforms.removeNodes(editor, { at: path });
      }
    } else {
      const [match] = Array.from(
        Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && isTextTag(n.type),
        }),
      );
      const currentHeading = match
        ? (match[0] as CustomElement).type
        : undefined;

      Transforms.setNodes(
        editor,
        { type: 'list-item', heading: currentHeading },
        {
          match: (n) => Element.isElement(n) && isTextTag(n.type),
        },
      );

      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && isListType(n.type),
        split: true,
      });

      Transforms.wrapNodes(
        editor,
        { type: format, children: [] },
        {
          match: (n) => Element.isElement(n) && n.type === 'list-item',
        },
      );
    }
  };

  return (
    <RichTextToolbarButton
      active={!!match}
      onClick={handleToggleBlock}
      disabled={disabled}
    >
      <Icon name={icon} size={24} />
    </RichTextToolbarButton>
  );
};

export default RichTextListButton;
